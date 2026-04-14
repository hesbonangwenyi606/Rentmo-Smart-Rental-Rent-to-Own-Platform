"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Clock,
  Receipt,
  Download,
  Filter,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/contexts/AuthContext";
import { payments as paymentsApi, users as usersApi } from "@/lib/api";
import type { Payment } from "@/lib/api";

type PayMethod = "mpesa" | "card" | "bank";
type PayState = "idle" | "initiating" | "polling" | "success" | "failed";

interface DashboardData {
  activeLease?: {
    id: string;
    monthlyRent: number;
    property?: { title: string };
  };
}

const PAYMENT_METHODS = [
  {
    id: "mpesa" as PayMethod,
    label: "M-Pesa",
    icon: Smartphone,
    color: "bg-green-50 border-green-200 text-green-700",
  },
  {
    id: "card" as PayMethod,
    label: "Visa / Mastercard",
    icon: CreditCard,
    color: "bg-blue-50 border-blue-200 text-blue-700",
  },
  {
    id: "bank" as PayMethod,
    label: "Bank Transfer",
    icon: Building,
    color: "bg-gray-50 border-gray-200 text-gray-700",
  },
];

function methodLabel(m: string) {
  if (m === "MPESA") return "M-Pesa";
  if (m === "CARD") return "Card";
  if (m === "BANK") return "Bank";
  return m;
}

function methodColor(m: string) {
  if (m === "MPESA") return "bg-green-50 text-green-600";
  if (m === "CARD") return "bg-blue-50 text-blue-600";
  if (m === "LOAN") return "bg-purple-50 text-purple-600";
  return "bg-gray-100 text-gray-600";
}

function statusColor(s: string) {
  if (s === "COMPLETED") return "bg-green-50 text-green-600";
  if (s === "PENDING") return "bg-yellow-50 text-yellow-600";
  if (s === "FAILED") return "bg-red-50 text-red-600";
  return "bg-gray-100 text-gray-600";
}

export default function PaymentsPage() {
  const { user } = useAuth();

  // Lease context
  const [leaseId, setLeaseId] = useState<string | undefined>();
  const [leaseRent, setLeaseRent] = useState(0);
  const [propertyTitle, setPropertyTitle] = useState("");

  // Transaction history
  const [txns, setTxns] = useState<Payment[]>([]);
  const [loadingTxns, setLoadingTxns] = useState(true);

  // Payment form
  const [activeMethod, setActiveMethod] = useState<PayMethod>("mpesa");
  const [amount, setAmount] = useState("");
  const [phone, setPhone] = useState("");
  const [description, setDescription] = useState("Rent Payment");

  // Payment flow
  const [payState, setPayState] = useState<PayState>("idle");
  const [receiptNo, setReceiptNo] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(60);

  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const countdownRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopTimers = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    if (countdownRef.current) { clearInterval(countdownRef.current); countdownRef.current = null; }
  };

  const loadTxns = useCallback(async () => {
    try {
      const data = await paymentsApi.list();
      setTxns(data);
    } catch {
      // non-fatal
    } finally {
      setLoadingTxns(false);
    }
  }, []);

  // Load lease info from dashboard
  useEffect(() => {
    usersApi.getDashboard()
      .then((dash) => {
        const d = dash as DashboardData;
        if (d?.activeLease) {
          setLeaseId(d.activeLease.id);
          setLeaseRent(d.activeLease.monthlyRent);
          setAmount(String(d.activeLease.monthlyRent));
          setPropertyTitle(d.activeLease.property?.title ?? "");
        }
      })
      .catch(() => {});
  }, []);

  // Pre-fill phone from profile
  useEffect(() => {
    if (user?.phone) setPhone(user.phone);
  }, [user]);

  useEffect(() => { loadTxns(); }, [loadTxns]);

  // Cleanup on unmount
  useEffect(() => () => stopTimers(), []);

  const startPolling = (paymentId: string) => {
    let attempts = 0;
    const max = 20; // 20 × 3 s = 60 s

    setSecondsLeft(60);
    countdownRef.current = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1));
    }, 1000);

    pollRef.current = setInterval(async () => {
      attempts++;
      try {
        const p = await paymentsApi.getById(paymentId);

        if (p.status === "COMPLETED") {
          stopTimers();
          setReceiptNo(p.mpesaReceiptNo || p.transactionRef || paymentId.slice(0, 8).toUpperCase());
          setPayState("success");
          loadTxns();
        } else if (p.status === "FAILED") {
          stopTimers();
          setErrorMsg("Payment was declined or cancelled. Please try again.");
          setPayState("failed");
        } else if (attempts >= max) {
          stopTimers();
          setErrorMsg(
            "M-Pesa confirmation timed out. If you entered your PIN, your payment will appear in your history once confirmed."
          );
          setPayState("failed");
        }
      } catch {
        if (attempts >= max) {
          stopTimers();
          setErrorMsg("Unable to confirm payment status. Check your history.");
          setPayState("failed");
        }
      }
    }, 3000);
  };

  const handlePay = async () => {
    if (!amount || Number(amount) <= 0) return;
    setErrorMsg("");
    setPayState("initiating");

    try {
      if (activeMethod === "mpesa") {
        const result = await paymentsApi.initiateMpesa({
          amount: Number(amount),
          phone,
          leaseId,
          description,
        });
        setPayState("polling");
        startPolling(result.paymentId);
      } else {
        await paymentsApi.record({
          amount: Number(amount),
          method: activeMethod === "card" ? "CARD" : "BANK",
          leaseId,
          description,
        });
        setReceiptNo(`${activeMethod.toUpperCase()}-${Date.now()}`);
        setPayState("success");
        loadTxns();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Payment failed. Please try again.");
      setPayState("failed");
    }
  };

  const reset = () => {
    stopTimers();
    setPayState("idle");
    setReceiptNo("");
    setErrorMsg("");
    setSecondsLeft(60);
  };

  // ── Render form states ─────────────────────────────────────────────────────

  if (payState === "success") {
    return (
      <div className="min-h-screen bg-gray-50 page-content">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-navy">Payments</h1>
            <p className="text-gray-400 mt-1">Pay rent, view history, download receipts.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="card text-center py-8">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-navy text-lg">Payment Successful!</h3>
                <p className="text-gray-400 text-sm mt-2">
                  KES {Number(amount).toLocaleString()} received
                  {activeMethod === "mpesa" ? " via M-Pesa" : ""}
                </p>
                {receiptNo && (
                  <p className="text-xs text-gray-300 mt-1 font-mono">{receiptNo}</p>
                )}
                <button onClick={reset} className="btn-outline w-full mt-6 !py-2.5 text-sm">
                  Make Another Payment
                </button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <TransactionList txns={txns} loading={loadingTxns} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (payState === "polling") {
    return (
      <div className="min-h-screen bg-gray-50 page-content">
        <div className="bg-white border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-navy">Payments</h1>
            <p className="text-gray-400 mt-1">Pay rent, view history, download receipts.</p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <div className="card text-center py-8">
                <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
                  <Smartphone className="w-8 h-8 text-green-500" />
                </div>
                <h3 className="font-bold text-navy text-lg">Check Your Phone</h3>
                <p className="text-gray-500 text-sm mt-3 leading-relaxed">
                  An M-Pesa prompt has been sent to{" "}
                  <span className="font-semibold text-navy">{phone}</span>.
                  <br />Enter your PIN to confirm.
                </p>
                <div className="mt-5 flex items-center justify-center gap-2 text-sm text-gray-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Waiting for confirmation…
                </div>
                <p className="text-xs text-gray-300 mt-2">{secondsLeft}s remaining</p>
                <button
                  onClick={reset}
                  className="text-sm text-gray-400 hover:text-gray-600 mt-5 underline"
                >
                  Cancel
                </button>
              </div>
            </div>
            <div className="lg:col-span-2">
              <TransactionList txns={txns} loading={loadingTxns} />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 page-content">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-navy">Payments</h1>
          <p className="text-gray-400 mt-1">Pay rent, view history, download receipts.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Payment Form */}
          <div className="lg:col-span-1 space-y-5">
            <div className="card">
              <h2 className="font-bold text-navy text-lg mb-5">Pay Rent</h2>

              {/* Due alert */}
              {leaseRent > 0 && (
                <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100 mb-5">
                  <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-yellow-800">Rent Due</p>
                    <p className="text-xs text-yellow-600">{propertyTitle}</p>
                  </div>
                </div>
              )}

              {/* Failed banner */}
              {payState === "failed" && errorMsg && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-xl mb-4">
                  <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600">{errorMsg}</p>
                </div>
              )}

              {/* Amount */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-1.5">Amount (KES)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="input-field text-xl font-bold"
                  min="1"
                  placeholder="0"
                />
              </div>

              {/* Description */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-navy mb-1.5">Description</label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field text-sm"
                />
              </div>

              {/* Payment Method */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-navy mb-2">Payment Method</label>
                <div className="space-y-2">
                  {PAYMENT_METHODS.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setActiveMethod(m.id)}
                      className={clsx(
                        "w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all",
                        activeMethod === m.id
                          ? "border-primary bg-primary/5"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      <div className={`w-9 h-9 rounded-lg ${m.color} flex items-center justify-center border`}>
                        <m.icon className="w-4 h-4" />
                      </div>
                      <span className="font-medium text-sm text-navy">{m.label}</span>
                      {activeMethod === m.id && (
                        <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* M-Pesa phone */}
              {activeMethod === "mpesa" && (
                <div className="mb-5">
                  <label className="block text-sm font-medium text-navy mb-1.5">M-Pesa Number</label>
                  <div className="relative">
                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0712345678 or 254712345678"
                      className="input-field pl-11"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5">
                    An M-Pesa STK push will be sent to this number.
                  </p>
                </div>
              )}

              <button
                onClick={handlePay}
                disabled={payState === "initiating" || !amount || Number(amount) <= 0}
                className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {payState === "initiating" ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    {activeMethod === "mpesa" ? "Sending STK Push…" : "Processing…"}
                  </>
                ) : (
                  `Pay KES ${Number(amount || 0).toLocaleString()}`
                )}
              </button>

              <p className="text-xs text-center text-gray-400 mt-3">
                Payments secured by 256-bit SSL encryption
              </p>
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
            <TransactionList txns={txns} loading={loadingTxns} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Transaction list sub-component ────────────────────────────────────────────

function TransactionList({ txns, loading }: { txns: Payment[]; loading: boolean }) {
  return (
    <div className="card">
      <div className="flex items-center justify-between mb-5">
        <h2 className="font-bold text-navy text-lg">Transaction History</h2>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy border border-gray-200 px-3 py-2 rounded-xl hover:border-gray-300 transition-colors">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-navy border border-gray-200 px-3 py-2 rounded-xl hover:border-gray-300 transition-colors">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-gray-300 animate-spin" />
        </div>
      ) : txns.length === 0 ? (
        <div className="text-center py-12">
          <Receipt className="w-8 h-8 text-gray-200 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">No transactions yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {txns.map((txn) => (
            <div
              key={txn.id}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 bg-gray-100 text-gray-600">
                <Receipt className="w-5 h-5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5">
                  <p className="text-sm font-medium text-navy truncate">{txn.description}</p>
                  {txn.mpesaReceiptNo && (
                    <span className="text-xs text-gray-300 hidden sm:inline font-mono">
                      {txn.mpesaReceiptNo}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">
                    {new Date(txn.createdAt).toLocaleDateString("en-KE", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                  <span
                    className={clsx(
                      "text-xs px-2 py-0.5 rounded-full font-medium",
                      methodColor(txn.method)
                    )}
                  >
                    {methodLabel(txn.method)}
                  </span>
                </div>
              </div>

              <div className="text-right shrink-0">
                <p className="font-bold text-navy">
                  – KES {txn.amount.toLocaleString()}
                </p>
                <span
                  className={clsx(
                    "text-xs px-2 py-0.5 rounded-full font-medium",
                    statusColor(txn.status)
                  )}
                >
                  {txn.status.charAt(0) + txn.status.slice(1).toLowerCase()}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
