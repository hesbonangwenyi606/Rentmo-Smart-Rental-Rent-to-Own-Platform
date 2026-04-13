"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Search,
  MapPin,
  TrendingUp,
  Shield,
  CreditCard,
  Home,
  ArrowRight,
  Star,
  CheckCircle2,
  Building2,
  Calculator,
  ChevronRight,
  Banknote,
} from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { properties, testimonials, stats } from "@/lib/data";

const neighborhoods = ["All Areas", "Kilimani", "Karen", "Westlands", "Lavington", "Kileleshwa", "Parklands"];
const propertyTypes = ["All Types", "For Rent", "Rent-to-Own"];

const howItWorks = [
  {
    step: "01",
    title: "Browse & Find",
    desc: "Explore thousands of verified properties in Nairobi. Filter by location, price, bedrooms, and type.",
    icon: Search,
    color: "bg-blue-50 text-blue-600",
  },
  {
    step: "02",
    title: "Apply & Move In",
    desc: "Apply instantly, get credit-checked, sign your digital lease, and move into your new home.",
    icon: Home,
    color: "bg-green-50 text-green-600",
  },
  {
    step: "03",
    title: "Pay & Build Credit",
    desc: "Pay rent via M-Pesa, card or bank. Every payment builds your credit score and equity.",
    icon: TrendingUp,
    color: "bg-primary/10 text-primary",
  },
  {
    step: "04",
    title: "Own Your Home",
    desc: "Reach 100% equity and transfer ownership. Your rent becomes your mortgage payment.",
    icon: Building2,
    color: "bg-purple-50 text-purple-600",
  },
];

const features = [
  {
    title: "Credit Score Tracking",
    desc: "Every rent payment builds your Rentmo credit score (300–850), unlocking better rates and loan access.",
    icon: CreditCard,
    color: "from-blue-500 to-cyan-400",
  },
  {
    title: "Rent-to-Own Program",
    desc: "A portion of every monthly payment goes toward owning your home. No huge deposit needed.",
    icon: Building2,
    color: "from-primary to-orange-400",
  },
  {
    title: "Instant Rent Loans",
    desc: "Struggling this month? Get a short-term rent loan disbursed directly to your landlord in hours.",
    icon: Banknote,
    color: "from-green-500 to-emerald-400",
  },
  {
    title: "Rentmo Cover",
    desc: "Insurance that protects tenants from eviction during income disruptions. Basic & Premium plans.",
    icon: Shield,
    color: "from-purple-500 to-indigo-400",
  },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [selectedArea, setSelectedArea] = useState("All Areas");

  const featuredProperties = properties.slice(0, 3);

  return (
    <div className="overflow-x-hidden">
      {/* ── HERO ────────────────────────────────────── */}
      <section className="gradient-hero min-h-[92vh] flex items-center relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "40px 40px",
            }}
          />
        </div>
        {/* Gradient orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                2,400+ Verified Properties in Nairobi
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                Find Your Home.
                <br />
                <span className="text-primary">Rent Smart.</span>
                <br />
                <span className="text-white/80">Then Own It.</span>
              </h1>
              <p className="text-gray-300 text-lg mt-6 leading-relaxed max-w-lg">
                Rentmo simplifies renting in Nairobi while helping you build
                credit, access rent loans, and transition into homeownership
                through our innovative rent-to-own model.
              </p>

              {/* Search box */}
              <div className="mt-8 bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by location, property name..."
                    className="w-full py-2.5 text-navy placeholder-gray-400 outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <div className="flex gap-2 items-center px-2 sm:border-l border-gray-100">
                  <select
                    className="text-sm text-gray-600 outline-none bg-transparent py-2 pr-2"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {propertyTypes.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <Link
                  href={`/properties?q=${searchQuery}&type=${selectedType}&area=${selectedArea}`}
                  className="btn-primary !rounded-xl whitespace-nowrap flex items-center gap-2"
                >
                  <Search className="w-4 h-4" />
                  Search
                </Link>
              </div>

              {/* Quick tags */}
              <div className="flex flex-wrap gap-2 mt-4">
                {["Kilimani", "Karen", "Westlands", "Lavington"].map((area) => (
                  <button
                    key={area}
                    className="text-xs text-gray-300 border border-white/20 rounded-full px-3 py-1 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => setSelectedArea(area)}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            {/* Right – floating stats card */}
            <div className="hidden lg:block relative animate-slide-up">
              <div className="relative">
                <Image
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                  alt="Modern Nairobi apartment"
                  width={600}
                  height={480}
                  className="rounded-3xl object-cover w-full shadow-2xl"
                  priority
                />
                {/* Credit score card */}
                <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl shadow-xl p-4 w-52">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Credit Score</p>
                      <p className="text-lg font-bold text-navy">720 / 850</p>
                    </div>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: "85%" }} />
                  </div>
                  <p className="text-xs text-green-600 font-medium mt-1">+24 pts this month</p>
                </div>
                {/* Equity card */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 w-48">
                  <p className="text-xs text-gray-500 mb-1">Rent-to-Own Progress</p>
                  <div className="flex items-end gap-1 mb-2">
                    <span className="text-2xl font-bold text-primary">34%</span>
                    <span className="text-sm text-gray-400 mb-0.5">equity built</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "34%" }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────── */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="text-3xl font-bold text-navy">{stat.value}</div>
                <div className="text-sm text-gray-500 mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Simple Process
            </span>
            <h2 className="section-heading mt-2">How Rentmo Works</h2>
            <p className="section-sub max-w-xl mx-auto">
              From browsing to owning — your entire rental journey in one platform.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px border-t-2 border-dashed border-gray-200 z-0" />
                )}
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-5 shadow-sm`}
                  >
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-5xl font-black text-gray-100 absolute -top-2 right-0 leading-none select-none">
                    {item.step}
                  </div>
                  <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ──────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Hand-Picked
              </span>
              <h2 className="section-heading mt-2">Featured Properties</h2>
              <p className="section-sub">
                Top-rated homes available now in Nairobi.
              </p>
            </div>
            <Link
              href="/properties"
              className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all"
            >
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredProperties.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>

          <div className="text-center mt-10 md:hidden">
            <Link href="/properties" className="btn-outline">
              View All Properties
            </Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Why Rentmo
            </span>
            <h2 className="section-heading mt-2">
              More than just a rental platform
            </h2>
            <p className="section-sub max-w-xl mx-auto">
              We've built a complete financial ecosystem around renting to help
              you thrive.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card-hover group cursor-pointer"
              >
                <div
                  className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}
                >
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RENT-TO-OWN EXPLAINER ────────────────────── */}
      <section className="py-24 bg-navy overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <div
            className="w-full h-full"
            style={{
              backgroundImage:
                "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">
                Rent-to-Own
              </span>
              <h2 className="text-4xl font-bold text-white mt-2 leading-tight">
                Your rent is your
                <br />
                <span className="text-primary">mortgage payment</span>
              </h2>
              <p className="text-gray-300 mt-5 leading-relaxed text-lg">
                With Rentmo's rent-to-own program, a portion of every monthly
                payment builds equity toward owning your home. No huge deposit,
                no bank gatekeeping.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  "No large upfront down payment required",
                  "Build equity from day one of renting",
                  "Transparent ownership progress dashboard",
                  "Transfer title once 100% equity is reached",
                  "Credit score determines your equity rate",
                ].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{point}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-4 mt-10">
                <Link href="/rent-to-own" className="btn-primary">
                  Learn More
                </Link>
                <Link href="/calculator" className="btn-outline !border-white/30 !text-white hover:!bg-white/10">
                  <Calculator className="w-4 h-4 mr-2 inline" />
                  Try Calculator
                </Link>
              </div>
            </div>

            {/* Visual breakdown */}
            <div className="bg-navy-light rounded-3xl p-8 border border-white/10">
              <h3 className="text-white font-semibold mb-6 text-lg">
                Monthly Payment Breakdown
              </h3>
              {/* Example property: KES 85,000/mo */}
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Monthly payment</span>
                  <span className="text-white font-semibold">KES 85,000</span>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">Rent portion (65%)</span>
                    <span className="text-gray-300">KES 55,250</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div className="bg-blue-400 h-3 rounded-full" style={{ width: "65%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1.5">
                    <span className="text-gray-400">Equity portion (35%)</span>
                    <span className="text-green-400 font-medium">KES 29,750</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-3">
                    <div className="bg-green-400 h-3 rounded-full" style={{ width: "35%" }} />
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 mt-6 pt-6">
                <p className="text-gray-400 text-sm mb-4">
                  After 36 months of on-time payments:
                </p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-white">34%</div>
                    <div className="text-xs text-gray-400 mt-1">Equity Built</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-green-400">KES 1.07M</div>
                    <div className="text-xs text-gray-400 mt-1">Total Equity</div>
                  </div>
                  <div className="bg-white/5 rounded-xl p-3 text-center">
                    <div className="text-xl font-bold text-primary">6.3yr</div>
                    <div className="text-xs text-gray-400 mt-1">To Own</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">
              Stories
            </span>
            <h2 className="section-heading mt-2">What our users say</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="card-hover">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="font-semibold text-navy text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ───────────────────────────────── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-heading">
            Ready to start your
            <span className="text-primary"> homeownership journey?</span>
          </h2>
          <p className="section-sub max-w-xl mx-auto">
            Join 8,500+ Kenyans who are renting smarter and building toward
            owning their homes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link href="/register" className="btn-primary !px-8 !py-4 text-base">
              Create Free Account
              <ChevronRight className="w-5 h-5 inline ml-2" />
            </Link>
            <Link href="/properties" className="btn-secondary !px-8 !py-4 text-base">
              Browse Properties
            </Link>
          </div>
          <p className="text-sm text-gray-400 mt-5">
            No credit card required. Free forever for tenants.
          </p>
        </div>
      </section>
    </div>
  );
}
