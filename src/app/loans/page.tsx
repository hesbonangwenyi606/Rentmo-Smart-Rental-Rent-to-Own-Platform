"use client";

import { useState } from "react";
import {
  Banknote,
  Clock,
  CheckCircle2,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Calendar,
  DollarSign,
} from "lucide-react";
import { clsx } from "clsx";

const loanHistory = [
  { id: "LOAN-0022", amount: 50000, purpose: "September Rent", status: "paid", disbursed: "Sep 28, 2025", due: "Oct 31, 2025", interest: 1500, repaid: "Oct 15, 2025" },
];

const loanProducts = [
  { name: "Quick Rent Loan", amount: "Up to KES 100K", duration: "30–60 days", rate: "3% flat fee", minScore: 580, icon: Banknote, color: "bg-primary/10 text-primary" },
  { name: "Emergency Cover", amount: "Up to KES 50K", duration: "30 days", rate: "1.5% flat fee", minScore: 550, icon: AlertCircle, color: "bg-yellow-50 text-yellow-600" },
  { name: "Multi-Month Loan", amount: "Up to KES 250K", duration: "3–6 months", rate: "5% flat fee", minScore: 620, icon: TrendingUp, color: "bg-green-50 text-green-600" },
];

export default function LoansPage() {
  const [step, setStep] = useState<"browse" | "apply" | "review" | "done">("browse");
  const [selectedProduct, setSelectedProduct] = useState(loanProducts[0]);
  const [form, setForm] = useState({ amount: "", purpose: "Rent payment", duration: "30" });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const handleApply = () => {
    setStep("review");
  };

  const handleConfirm = () => {
    setStep("done");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-navy">Rent Loans</h1>
          <p className="text-gray-400 mt-1">Fast, affordable loans to keep your tenancy on track.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Eligibility bar */}
        <div className="card bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="font-bold text-green-800">You&apos;re Eligible for a Loan</p>
              <p className="text-sm text-green-600">Credit score 720 · 6 months payment history</p>
            </div>
          </div>
          <div className="flex items-center gap-6 text-sm">
            <div className="text-center">
              <p className="font-bold text-green-800 text-lg">KES 100K</p>
              <p className="text-green-600 text-xs">Max Limit</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-green-800 text-lg">3%</p>
              <p className="text-green-600 text-xs">Lowest Rate</p>
            </div>
            <div className="text-center">
              <p className="font-bold text-green-800 text-lg">2hrs</p>
              <p className="text-green-600 text-xs">Disbursement</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Loan Application */}
          <div className="lg:col-span-2 space-y-6">
            {step === "browse" && (
              <div>
                <h2 className="font-bold text-navy text-lg mb-4">Choose a Loan Product</h2>
                <div className="grid sm:grid-cols-3 gap-4">
                  {loanProducts.map((product) => (
                    <button
                      key={product.name}
                      onClick={() => { setSelectedProduct(product); setStep("apply"); }}
                      className={clsx(
                        "card-hover text-left transition-all",
                        selectedProduct.name === product.name && "border-2 border-primary"
                      )}
                    >
                      <div className={`w-10 h-10 rounded-xl ${product.color} flex items-center justify-center mb-4`}>
                        <product.icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-navy text-sm mb-1">{product.name}</h3>
                      <p className="text-primary font-bold text-sm">{product.amount}</p>
                      <div className="mt-3 space-y-1.5 text-xs text-gray-500">
                        <p>Duration: {product.duration}</p>
                        <p>Fee: {product.rate}</p>
                        <p>Min Score: {product.minScore}</p>
                      </div>
                      <div className="flex items-center gap-1 mt-4 text-xs text-primary font-medium">
                        Apply Now <ChevronRight className="w-3 h-3" />
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === "apply" && (
              <div className="card">
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setStep("browse")} className="text-gray-400 hover:text-navy transition-colors text-sm flex items-center gap-1">
                    ← Back
                  </button>
                  <h2 className="font-bold text-navy text-lg">Apply for {selectedProduct.name}</h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">Loan Amount (KES)</label>
                    <input
                      type="number"
                      value={form.amount}
                      onChange={(e) => update("amount", e.target.value)}
                      placeholder="e.g. 85000"
                      className="input-field text-xl font-semibold"
                    />
                    <p className="text-xs text-gray-400 mt-1">Maximum: KES 100,000</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">Purpose</label>
                    <select value={form.purpose} onChange={(e) => update("purpose", e.target.value)} className="input-field">
                      <option>Rent payment</option>
                      <option>Deposit payment</option>
                      <option>Utility bills</option>
                      <option>Emergency</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-navy mb-1.5">Repayment Period</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["30", "45", "60"].map((d) => (
                        <button
                          key={d}
                          onClick={() => update("duration", d)}
                          className={clsx(
                            "p-3 rounded-xl border-2 text-center text-sm font-medium transition-all",
                            form.duration === d
                              ? "border-primary bg-primary/5 text-primary"
                              : "border-gray-200 text-gray-600 hover:border-gray-300"
                          )}
                        >
                          {d} Days
                        </button>
                      ))}
                    </div>
                  </div>

                  {form.amount && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                      <h3 className="font-semibold text-navy text-sm mb-3">Loan Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Loan Amount</span>
                          <span className="font-medium">KES {Number(form.amount).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Flat Fee (3%)</span>
                          <span className="font-medium">KES {(Number(form.amount) * 0.03).toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between font-bold border-t border-gray-200 pt-2 mt-2">
                          <span className="text-navy">Total Repayment</span>
                          <span className="text-primary">KES {(Number(form.amount) * 1.03).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleApply}
                    disabled={!form.amount}
                    className="btn-primary w-full !py-3.5 disabled:opacity-50"
                  >
                    Review Application
                  </button>
                </div>
              </div>
            )}

            {step === "review" && (
              <div className="card">
                <h2 className="font-bold text-navy text-lg mb-5">Review & Confirm</h2>
                <div className="space-y-3 text-sm mb-6">
                  {[
                    ["Product", selectedProduct.name],
                    ["Amount", `KES ${Number(form.amount).toLocaleString()}`],
                    ["Purpose", form.purpose],
                    ["Repayment", `${form.duration} days`],
                    ["Fee", `KES ${(Number(form.amount) * 0.03).toLocaleString()} (3% flat)`],
                    ["Total Repayment", `KES ${(Number(form.amount) * 1.03).toLocaleString()}`],
                    ["Disbursement", "Within 2 hours via M-Pesa"],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-500">{label}</span>
                      <span className="font-medium text-navy">{value}</span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setStep("apply")} className="btn-secondary flex-1">Back</button>
                  <button onClick={handleConfirm} className="btn-primary flex-1">Confirm & Submit</button>
                </div>
              </div>
            )}

            {step === "done" && (
              <div className="card text-center py-10">
                <div className="w-20 h-20 bg-green-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-navy">Application Submitted!</h2>
                <p className="text-gray-400 mt-2 mb-1">Your loan application is under review.</p>
                <p className="text-sm text-gray-400">Disbursement within <strong className="text-navy">2 hours</strong> if approved.</p>
                <div className="mt-6 flex gap-3 justify-center">
                  <button onClick={() => setStep("browse")} className="btn-outline">Apply Again</button>
                </div>
              </div>
            )}

            {/* Loan History */}
            {loanHistory.length > 0 && (
              <div className="card">
                <h2 className="font-bold text-navy text-lg mb-4">Loan History</h2>
                {loanHistory.map((loan) => (
                  <div key={loan.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy">{loan.purpose}</p>
                      <p className="text-xs text-gray-400">{loan.id} · Disbursed {loan.disbursed}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-navy">KES {loan.amount.toLocaleString()}</p>
                      <span className="badge-green">Fully Paid</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">
            <div className="card">
              <h3 className="font-bold text-navy mb-4">How It Works</h3>
              <div className="space-y-4">
                {[
                  { step: "1", title: "Apply Online", desc: "Fill the form in under 2 minutes", icon: DollarSign },
                  { step: "2", title: "Auto Review", desc: "AI reviews your credit profile instantly", icon: TrendingUp },
                  { step: "3", title: "Get Funds", desc: "Money sent to your M-Pesa within 2 hours", icon: Banknote },
                  { step: "4", title: "Repay Easily", desc: "Repay via M-Pesa or auto-deduction", icon: Calendar },
                ].map((item) => (
                  <div key={item.step} className="flex gap-3">
                    <div className="w-8 h-8 bg-primary/10 text-primary rounded-lg flex items-center justify-center text-xs font-bold shrink-0">
                      {item.step}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">{item.title}</p>
                      <p className="text-xs text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-5 h-5 text-primary" />
                <h3 className="font-bold text-navy">Fast Approval</h3>
              </div>
              <p className="text-sm text-gray-600">94% of eligible applications are approved within 15 minutes.</p>
              <p className="text-xs text-gray-400 mt-2">Available Mon–Sun, 6am–10pm</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
