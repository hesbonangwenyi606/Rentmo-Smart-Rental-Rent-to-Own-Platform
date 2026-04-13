"use client";

import { useState } from "react";
import {
  CreditCard,
  Smartphone,
  Building,
  CheckCircle2,
  Clock,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  Download,
  Filter,
} from "lucide-react";
import { clsx } from "clsx";

const transactions = [
  { id: "TXN-1091", date: "Mar 18, 2026", amount: 85000, type: "debit", method: "M-Pesa", description: "March 2026 Rent", status: "completed" },
  { id: "TXN-1045", date: "Feb 18, 2026", amount: 85000, type: "debit", method: "M-Pesa", description: "February 2026 Rent", status: "completed" },
  { id: "TXN-0998", date: "Jan 18, 2026", amount: 85000, type: "debit", method: "Card", description: "January 2026 Rent", status: "completed" },
  { id: "TXN-0950", date: "Dec 18, 2025", amount: 85000, type: "debit", method: "M-Pesa", description: "December 2025 Rent", status: "completed" },
  { id: "TXN-0900", date: "Nov 18, 2025", amount: 85000, type: "debit", method: "M-Pesa", description: "November 2025 Rent", status: "completed" },
  { id: "TXN-0854", date: "Oct 18, 2025", amount: 85000, type: "debit", method: "Bank", description: "October 2025 Rent", status: "completed" },
  { id: "LOAN-0022", date: "Sep 28, 2025", amount: 50000, type: "credit", method: "Loan", description: "Rent Loan Disbursement", status: "completed" },
  { id: "TXN-0801", date: "Sep 18, 2025", amount: 85000, type: "debit", method: "M-Pesa", description: "September 2025 Rent", status: "completed" },
];

const paymentMethods = [
  { id: "mpesa", label: "M-Pesa", icon: Smartphone, color: "bg-green-50 border-green-200 text-green-700", active: true },
  { id: "card", label: "Visa Card", icon: CreditCard, color: "bg-blue-50 border-blue-200 text-blue-700", active: false },
  { id: "bank", label: "Bank Transfer", icon: Building, color: "bg-gray-50 border-gray-200 text-gray-700", active: false },
];

export default function PaymentsPage() {
  const [activeMethod, setActiveMethod] = useState("mpesa");
  const [amount, setAmount] = useState("85000");
  const [phone, setPhone] = useState("+254 7XX XXX XXX");
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setPaid(true);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
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

              {paid ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 className="w-8 h-8 text-green-500" />
                  </div>
                  <h3 className="font-bold text-navy text-lg">Payment Successful!</h3>
                  <p className="text-gray-400 text-sm mt-2">KES 85,000 paid via M-Pesa</p>
                  <p className="text-xs text-gray-300 mt-1">Receipt: TXN-1092</p>
                  <button
                    onClick={() => setPaid(false)}
                    className="btn-outline w-full mt-6 !py-2.5 text-sm"
                  >
                    Make Another Payment
                  </button>
                </div>
              ) : (
                <>
                  {/* Due alert */}
                  <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-xl border border-yellow-100 mb-5">
                    <Clock className="w-5 h-5 text-yellow-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800">Rent Due</p>
                      <p className="text-xs text-yellow-600">April 18, 2026 (5 days away)</p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-navy mb-1.5">Amount (KES)</label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="input-field text-xl font-bold"
                    />
                  </div>

                  {/* Method */}
                  <div className="mb-5">
                    <label className="block text-sm font-medium text-navy mb-2">Payment Method</label>
                    <div className="space-y-2">
                      {paymentMethods.map((m) => (
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
                    disabled={loading}
                    className="btn-primary w-full !py-3.5 flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        Pay KES {Number(amount).toLocaleString()}
                      </>
                    )}
                  </button>

                  <p className="text-xs text-center text-gray-400 mt-3">
                    🔒 Payments secured by 256-bit SSL encryption
                  </p>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: "Paid This Year", value: "KES 510K", icon: CheckCircle2, color: "text-green-500 bg-green-50" },
                { label: "On-Time Rate", value: "100%", icon: ArrowUpRight, color: "text-primary bg-primary/10" },
              ].map((s) => (
                <div key={s.label} className="card !p-4">
                  <div className={`w-8 h-8 rounded-lg ${s.color} flex items-center justify-center mb-2`}>
                    <s.icon className="w-4 h-4" />
                  </div>
                  <p className="text-lg font-bold text-navy">{s.value}</p>
                  <p className="text-xs text-gray-400">{s.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History */}
          <div className="lg:col-span-2">
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

              <div className="space-y-1">
                {transactions.map((txn) => (
                  <div
                    key={txn.id}
                    className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors"
                  >
                    <div
                      className={clsx(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        txn.type === "credit"
                          ? "bg-green-50 text-green-500"
                          : "bg-gray-100 text-gray-600"
                      )}
                    >
                      {txn.type === "credit" ? (
                        <ArrowDownLeft className="w-5 h-5" />
                      ) : (
                        <Receipt className="w-5 h-5" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-navy truncate">{txn.description}</p>
                        <span className="text-xs text-gray-400 shrink-0">{txn.id}</span>
                      </div>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-xs text-gray-400">{txn.date}</span>
                        <span className={clsx(
                          "text-xs px-2 py-0.5 rounded-full font-medium",
                          txn.method === "M-Pesa" ? "bg-green-50 text-green-600" :
                          txn.method === "Card" ? "bg-blue-50 text-blue-600" :
                          txn.method === "Loan" ? "bg-purple-50 text-purple-600" :
                          "bg-gray-100 text-gray-600"
                        )}>
                          {txn.method}
                        </span>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={clsx(
                        "font-bold",
                        txn.type === "credit" ? "text-green-500" : "text-navy"
                      )}>
                        {txn.type === "credit" ? "+" : "-"} KES {txn.amount.toLocaleString()}
                      </p>
                      <span className="badge-green text-xs">Completed</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
