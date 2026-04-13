import { Link } from "react-router-dom";
import {
  CheckCircle2,
  TrendingUp,
  Home,
  Calculator,
  Building2,
  ArrowRight,
  Star,
} from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { properties } from "@/lib/data";

const steps = [
  {
    step: "01",
    title: "Browse Rent-to-Own Homes",
    desc: "Filter properties specifically listed under our rent-to-own program. All listings are verified and legally compliant.",
    icon: Home,
  },
  {
    step: "02",
    title: "Apply & Get Approved",
    desc: "Your Rentmo credit score determines your equity contribution rate. Higher score = more equity per payment.",
    icon: TrendingUp,
  },
  {
    step: "03",
    title: "Move In & Pay Monthly",
    desc: "Move in immediately. Each monthly payment is split: rent portion and equity contribution toward ownership.",
    icon: Building2,
  },
  {
    step: "04",
    title: "Reach 100% & Own",
    desc: "Once you hit 100% equity, ownership is transferred. No bank loan required.",
    icon: CheckCircle2,
  },
];

const rtoProperties = properties.filter((p) => p.type === "rent-to-own");

export default function RentToOwnPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="gradient-hero py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-primary/20 border border-primary/30 text-primary rounded-full px-4 py-1.5 text-sm font-medium mb-6">
            <Star className="w-4 h-4" />
            Rentmo&apos;s Flagship Program
          </div>
          <h1 className="text-5xl font-bold text-white leading-tight">
            Rent today.
            <br />
            <span className="text-primary">Own tomorrow.</span>
          </h1>
          <p className="text-gray-300 text-xl mt-6 max-w-2xl mx-auto">
            Every rent payment you make brings you closer to owning your home.
            No huge deposit. No bank gatekeeping. Just consistent payments.
          </p>
          <div className="flex flex-wrap gap-4 justify-center mt-10">
            <Link to="/properties?type=rent-to-own" className="btn-primary !px-8 !py-4 text-base">
              Browse Homes
              <ArrowRight className="w-5 h-5 inline ml-2" />
            </Link>
            <Link to="/calculator" className="border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors flex items-center gap-2 text-base">
              <Calculator className="w-5 h-5" />
              Calculate Payments
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: "340+", label: "Rent-to-Own Listings" },
              { value: "1,200+", label: "Tenants in Program" },
              { value: "47", label: "Homes Transferred" },
              { value: "6.2yr", label: "Avg. Time to Own" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-black text-primary">{s.value}</div>
                <div className="text-sm text-gray-500 mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-heading">How Rent-to-Own Works</h2>
            <p className="section-sub max-w-xl mx-auto">
              A structured path from renting to owning — built for everyday Kenyans.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s) => (
              <div key={s.step} className="card-hover relative">
                <div className="text-6xl font-black text-gray-100 absolute -top-2 right-4 select-none leading-none">
                  {s.step}
                </div>
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-4">
                  <s.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-navy text-base mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Breakdown visual */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-heading">Your Monthly Payment, Explained</h2>
            <p className="section-sub">
              Every payment you make is split between rent and building equity.
            </p>
          </div>

          <div className="card bg-navy text-white p-8">
            <div className="text-center mb-8">
              <p className="text-gray-400 mb-2">Example: 3BR Kilimani — KES 18.5M property</p>
              <p className="text-4xl font-black">KES 85,000 / month</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-white/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-blue-400 rounded" />
                  <h3 className="font-semibold text-white">Rent Portion (65%)</h3>
                </div>
                <p className="text-3xl font-bold">KES 55,250</p>
                <p className="text-gray-400 text-sm mt-2">
                  Covers landlord cost, building maintenance, and service fees.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-4 h-4 bg-green-400 rounded" />
                  <h3 className="font-semibold text-green-400">Equity Portion (35%)</h3>
                </div>
                <p className="text-3xl font-bold text-green-400">KES 29,750</p>
                <p className="text-gray-400 text-sm mt-2">
                  Goes directly toward owning your property. Locked in an escrow account.
                </p>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="w-full bg-white/10 rounded-full h-4 overflow-hidden">
                <div className="flex h-full">
                  <div className="bg-blue-400 h-full" style={{ width: "65%" }} />
                  <div className="bg-green-400 h-full" style={{ width: "35%" }} />
                </div>
              </div>
              <div className="flex justify-between text-xs mt-2 text-gray-400">
                <span>65% Rent</span>
                <span>35% Equity →</span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 text-center">
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xl font-bold text-white">34%</p>
                <p className="text-xs text-gray-400 mt-1">After 3 years</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xl font-bold text-primary">100%</p>
                <p className="text-xs text-gray-400 mt-1">Ownership goal</p>
              </div>
              <div className="bg-white/5 rounded-xl p-3">
                <p className="text-xl font-bold text-white">~6.3yr</p>
                <p className="text-xs text-gray-400 mt-1">Estimated time</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Properties */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="section-heading">Available Rent-to-Own Homes</h2>
              <p className="section-sub">Start your ownership journey today.</p>
            </div>
            <Link to="/properties?type=rent-to-own" className="hidden md:flex items-center gap-2 text-primary font-medium">
              View All <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {rtoProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-heading text-center mb-10">Common Questions</h2>
          <div className="space-y-4">
            {[
              { q: "What credit score do I need?", a: "A minimum Rentmo credit score of 580 is required. Higher scores unlock better equity rates (up to 40%)." },
              { q: "What if I miss a payment?", a: "One missed payment pauses equity accrual for that month. Two consecutive missed payments may trigger a lease review." },
              { q: "Can I leave before owning the property?", a: "Yes. Any equity you&apos;ve built is refunded minus a 5% administrative fee. You can also transfer your equity to another Rentmo property." },
              { q: "Is the equity legally protected?", a: "Yes. All equity contributions are held in a regulated escrow account and covered by Kenyan property law." },
              { q: "Can I upgrade to a bigger property?", a: "Yes. You can transfer your accumulated equity to a higher-value property in the program at any time." },
            ].map((faq) => (
              <div key={faq.q} className="card">
                <h3 className="font-semibold text-navy mb-2">{faq.q}</h3>
                <p className="text-gray-500 text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-3">
            Your home is waiting for you.
          </h2>
          <p className="text-white/80 text-lg mb-8">
            Join 1,200+ tenants already building equity every month with Rentmo.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/register" className="bg-white text-primary font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors shadow-lg">
              Get Started Free
            </Link>
            <Link to="/calculator" className="border-2 border-white/40 text-white font-semibold px-8 py-4 rounded-xl hover:bg-white/10 transition-colors">
              Use Calculator
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
