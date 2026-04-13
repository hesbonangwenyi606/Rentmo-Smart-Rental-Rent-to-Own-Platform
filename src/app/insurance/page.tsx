"use client";

import { useState } from "react";
import {
  Shield,
  CheckCircle2,
  X,
  AlertCircle,
  Clock,
  FileText,
  ChevronRight,
} from "lucide-react";
import { clsx } from "clsx";

const plans = [
  {
    id: "basic",
    name: "Basic Cover",
    price: 1500,
    desc: "Essential protection for tenants",
    color: "border-gray-200",
    activeColor: "border-primary",
    badge: null,
    features: [
      { label: "Rent coverage up to KES 50K", included: true },
      { label: "1 claim per 12 months", included: true },
      { label: "14-day processing", included: true },
      { label: "Income disruption cover", included: true },
      { label: "Legal eviction protection", included: false },
      { label: "Medical emergency rental aid", included: false },
      { label: "Priority claim handling", included: false },
      { label: "Dedicated support agent", included: false },
    ],
  },
  {
    id: "premium",
    name: "Premium Cover",
    price: 3500,
    desc: "Full protection & priority service",
    color: "border-primary",
    activeColor: "border-primary",
    badge: "Most Popular",
    features: [
      { label: "Rent coverage up to KES 150K", included: true },
      { label: "3 claims per 12 months", included: true },
      { label: "48-hour processing", included: true },
      { label: "Income disruption cover", included: true },
      { label: "Legal eviction protection", included: true },
      { label: "Medical emergency rental aid", included: true },
      { label: "Priority claim handling", included: true },
      { label: "Dedicated support agent", included: true },
    ],
  },
];

const claimHistory = [
  { id: "CLM-0021", date: "Jan 15, 2026", amount: 85000, reason: "Income disruption", status: "approved", payout: "Jan 20, 2026" },
];

export default function InsurancePage() {
  const [selectedPlan, setSelectedPlan] = useState("premium");
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimSubmitted, setClaimSubmitted] = useState(false);
  const [claimForm, setClaimForm] = useState({ reason: "income_disruption", amount: "", description: "" });

  const activePlan = plans.find((p) => p.id === "basic");

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-2xl font-bold text-navy">Rentmo Cover</h1>
          <p className="text-gray-400 mt-1">Insurance that protects your tenancy when life gets hard.</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {/* Active Plan Banner */}
        <div className="card bg-gradient-to-r from-navy to-navy-light text-white flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <p className="text-gray-300 text-sm">Active Plan</p>
              <h2 className="text-xl font-bold">Basic Cover</h2>
              <p className="text-gray-300 text-sm mt-0.5">Renews Jun 1, 2026 · KES 1,500/mo</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowClaimForm(true)}
              className="bg-white/10 border border-white/30 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-white/20 transition-colors flex items-center gap-2"
            >
              <FileText className="w-4 h-4" />
              File a Claim
            </button>
            <button className="bg-primary text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-primary-dark transition-colors flex items-center gap-2">
              Upgrade Plan
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Claim form */}
        {showClaimForm && !claimSubmitted && (
          <div className="card border-2 border-primary/20 max-w-2xl">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-navy text-lg">File an Insurance Claim</h2>
              <button onClick={() => setShowClaimForm(false)} className="text-gray-400 hover:text-navy">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Reason for Claim</label>
                <select
                  value={claimForm.reason}
                  onChange={(e) => setClaimForm((p) => ({ ...p, reason: e.target.value }))}
                  className="input-field"
                >
                  <option value="income_disruption">Income Disruption / Job Loss</option>
                  <option value="medical">Medical Emergency</option>
                  <option value="eviction">Threatened Eviction</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Claim Amount (KES)</label>
                <input
                  type="number"
                  value={claimForm.amount}
                  onChange={(e) => setClaimForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="e.g. 85000"
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-navy mb-1.5">Description</label>
                <textarea
                  value={claimForm.description}
                  onChange={(e) => setClaimForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Briefly describe your situation..."
                  rows={4}
                  className="input-field resize-none"
                />
              </div>
              <div className="flex gap-3">
                <button onClick={() => setShowClaimForm(false)} className="btn-secondary flex-1">Cancel</button>
                <button
                  onClick={() => setClaimSubmitted(true)}
                  disabled={!claimForm.amount}
                  className="btn-primary flex-1 disabled:opacity-50"
                >
                  Submit Claim
                </button>
              </div>
            </div>
          </div>
        )}

        {claimSubmitted && (
          <div className="card text-center py-8 max-w-xl border-2 border-green-200">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-bold text-navy text-lg">Claim Submitted!</h3>
            <p className="text-gray-400 text-sm mt-1">Reference: CLM-0022</p>
            <p className="text-sm text-gray-500 mt-3">Our team will review within <strong>14 business days</strong>. You&apos;ll receive an SMS update.</p>
            <button onClick={() => { setClaimSubmitted(false); setShowClaimForm(false); }} className="btn-outline mt-4 text-sm">Done</button>
          </div>
        )}

        {/* Plan Comparison */}
        <div>
          <h2 className="font-bold text-navy text-2xl mb-2">Choose Your Plan</h2>
          <p className="text-gray-400 mb-6">Upgrade or change plan at any time.</p>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl">
            {plans.map((plan) => (
              <div
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={clsx(
                  "card cursor-pointer transition-all relative",
                  selectedPlan === plan.id
                    ? "border-2 border-primary shadow-lg"
                    : "border border-gray-100 hover:border-gray-200"
                )}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                    {plan.badge}
                  </div>
                )}
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-navy text-lg">{plan.name}</h3>
                    <p className="text-sm text-gray-400">{plan.desc}</p>
                  </div>
                  {plan.id === activePlan?.id && (
                    <span className="badge-green">Active</span>
                  )}
                </div>
                <div className="mb-5">
                  <span className="text-3xl font-black text-navy">
                    KES {plan.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400">/mo</span>
                </div>
                <div className="space-y-2.5">
                  {plan.features.map((f) => (
                    <div key={f.label} className="flex items-center gap-2.5 text-sm">
                      {f.included ? (
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-gray-300 shrink-0" />
                      )}
                      <span className={f.included ? "text-gray-700" : "text-gray-300"}>{f.label}</span>
                    </div>
                  ))}
                </div>
                <button className={clsx(
                  "w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-colors",
                  plan.id === activePlan?.id
                    ? "bg-gray-100 text-gray-400 cursor-default"
                    : selectedPlan === plan.id
                    ? "bg-primary text-white hover:bg-primary-dark"
                    : "border border-gray-200 text-gray-600 hover:border-primary hover:text-primary"
                )}>
                  {plan.id === activePlan?.id ? "Current Plan" : `Select ${plan.name}`}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Claim History */}
        <div className="card">
          <h2 className="font-bold text-navy text-lg mb-5">Claim History</h2>
          {claimHistory.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <Shield className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No claims filed yet. You&apos;re in good shape!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {claimHistory.map((claim) => (
                <div key={claim.id} className="flex items-center gap-4 p-4 rounded-xl bg-gray-50">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${claim.status === "approved" ? "bg-green-50" : "bg-yellow-50"}`}>
                    {claim.status === "approved" ? (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    ) : (
                      <Clock className="w-5 h-5 text-yellow-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy">{claim.reason}</p>
                    <p className="text-xs text-gray-400">{claim.id} · Filed {claim.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-navy">KES {claim.amount.toLocaleString()}</p>
                    <span className={claim.status === "approved" ? "badge-green" : "badge-yellow"}>
                      {claim.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* FAQ */}
        <div className="card">
          <h2 className="font-bold text-navy text-lg mb-5">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "When can I file a claim?", a: "You can file a claim after 3 months of active subscription and if you face income disruption, medical emergencies, or threatened eviction." },
              { q: "How long does claim processing take?", a: "Basic plan: up to 14 business days. Premium plan: 48 hours for urgent cases." },
              { q: "What documents do I need?", a: "Proof of income disruption (e.g. termination letter), medical certificate if applicable, and your current lease agreement." },
              { q: "Can I cancel anytime?", a: "Yes. You can cancel your plan at any time. Coverage continues until the end of the paid period." },
            ].map((faq) => (
              <div key={faq.q} className="border-b border-gray-100 pb-4">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-navy text-sm">{faq.q}</p>
                    <p className="text-sm text-gray-500 mt-1">{faq.a}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
