"use client";

import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import {
  MapPin, Bed, Bath, Maximize2, Star, Heart, Share2,
  ChevronRight, ChevronLeft, CheckCircle2, TrendingUp,
  Calendar, Phone, MessageCircle, Plus,
} from "lucide-react";
import { properties } from "@/lib/data";
import PropertyCard from "@/components/properties/PropertyCard";

type Tab = "details" | "amenities" | "rent-loan";

export default function PropertyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const property = properties.find((p) => p.id === id) ?? properties[0];
  const related = properties.filter((p) => p.id !== property.id).slice(0, 3);

  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("details");

  const equityPerMonth =
    property.type === "rent-to-own" && property.propertyValue
      ? Math.round(property.price * 0.35)
      : 0;
  const monthsToOwn =
    property.type === "rent-to-own" && property.propertyValue
      ? Math.ceil(property.propertyValue / equityPerMonth)
      : 0;

  const description =
    property.description ??
    `${property.title} is a premium ${property.type === "rent-to-own" ? "rent-to-own" : "rental"} property in ${property.location}. This ${property.bedrooms}-bedroom, ${property.bathrooms}-bathroom home offers ${property.size.toLocaleString()} sq ft of modern living space with top-tier amenities.`;

  const tabs: { key: Tab; label: string }[] = [
    { key: "details", label: "Details" },
    { key: "amenities", label: "Amenities" },
    { key: "rent-loan", label: "Rent Loan" },
  ];

  return (
    <div className="min-h-screen bg-white pb-24 lg:pb-0">
      {/* Mobile top bar */}
      <div className="lg:hidden sticky top-0 z-20 bg-white/95 backdrop-blur border-b border-gray-100 px-4 py-3 flex items-center gap-2">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center shrink-0"
        >
          <ChevronLeft className="w-5 h-5 text-navy" />
        </button>
        <span className="font-semibold text-navy flex-1 truncate text-sm">{property.title}</span>
        <button
          onClick={() => setSaved(!saved)}
          className={`w-9 h-9 rounded-xl border flex items-center justify-center transition-colors ${
            saved ? "border-primary bg-primary/10" : "border-gray-200"
          }`}
        >
          <Heart className={`w-4 h-4 ${saved ? "text-primary fill-primary" : "text-gray-500"}`} />
        </button>
        <button className="w-9 h-9 rounded-xl border border-gray-200 flex items-center justify-center">
          <Share2 className="w-4 h-4 text-gray-500" />
        </button>
      </div>

      {/* Desktop breadcrumb */}
      <div className="hidden lg:block bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link to="/properties" className="hover:text-primary transition-colors">Properties</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto lg:px-4 lg:py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">

          {/* ── Left / Main ─────────────────────────────── */}
          <div className="lg:col-span-2">

            {/* Thumbnail strip (mobile) */}
            {property.images.length > 1 && (
              <div className="flex gap-2 px-4 py-3 overflow-x-auto bg-gray-50 border-b border-gray-100 lg:hidden">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`shrink-0 w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${
                      activeImg === i ? "border-primary" : "border-transparent"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Main image */}
            <div className="relative h-64 lg:h-[420px] lg:rounded-2xl overflow-hidden">
              <img
                src={property.images[activeImg] ?? property.image}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent" />

              {/* Badges */}
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                    property.type === "rent-to-own"
                      ? "bg-primary text-white"
                      : "bg-navy text-white"
                  }`}
                >
                  {property.type === "rent-to-own" ? "Rent-to-Own" : "For Rent"}
                </span>
                {property.available && (
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-green-500 text-white">
                    Available
                  </span>
                )}
              </div>

              {/* Desktop arrows */}
              {property.images.length > 1 && (
                <>
                  <button
                    onClick={() =>
                      setActiveImg((i) => (i === 0 ? property.images.length - 1 : i - 1))
                    }
                    className="hidden lg:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-xl items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-navy" />
                  </button>
                  <button
                    onClick={() =>
                      setActiveImg((i) => (i === property.images.length - 1 ? 0 : i + 1))
                    }
                    className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-xl items-center justify-center shadow hover:bg-white transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-navy" />
                  </button>
                </>
              )}
            </div>

            {/* Desktop thumbnail strip */}
            {property.images.length > 1 && (
              <div className="hidden lg:flex gap-2 mt-3">
                {property.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    className={`w-20 h-14 rounded-xl overflow-hidden border-2 transition-colors ${
                      activeImg === i ? "border-primary" : "border-gray-200"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* ── Property info ── */}
            <div className="px-4 pt-4 lg:px-0 lg:pt-6">
              <div className="lg:card">
                <div className="flex items-start justify-between gap-3 mb-1">
                  <h1 className="text-xl font-bold text-navy leading-tight">{property.title}</h1>
                  <div className="flex items-center gap-1 shrink-0">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-semibold text-navy">{property.rating}</span>
                    <span className="text-xs text-gray-400">({property.reviews})</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-gray-500 text-sm mb-3">
                  <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>{property.location}</span>
                </div>

                <div className="flex items-baseline gap-1 mb-2">
                  <span className="text-2xl font-bold text-navy">
                    KES {property.price.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-sm">/mo</span>
                </div>

                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Bed className="w-3.5 h-3.5 text-primary" />
                    {property.bedrooms} Beds
                  </span>
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-primary" />
                    {property.bathrooms} Baths
                  </span>
                  <span className="flex items-center gap-1">
                    <Maximize2 className="w-3.5 h-3.5 text-primary" />
                    {property.size.toLocaleString()} sq ft
                  </span>
                </div>
              </div>

              {/* ── Action buttons (mobile) ── */}
              <div className="mt-4 space-y-2.5 lg:hidden">
                <div className="grid grid-cols-2 gap-2.5">
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors">
                    <Calendar className="w-4 h-4" />
                    Schedule Viewing
                  </button>
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold border-2 transition-colors ${
                      saved
                        ? "bg-primary text-white border-primary"
                        : "border-primary text-primary hover:bg-primary/5"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${saved ? "fill-white" : ""}`} />
                    {saved ? "Saved" : "Save/Apply"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <a
                    href="tel:+254700000000"
                    className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-navy text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Agent
                  </a>
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-navy text-sm font-medium hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Request Callback
                  </button>
                </div>
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add to My Rentals
                </Link>
              </div>

              {/* ── Tabs ── */}
              <div className="mt-5 border-b border-gray-200">
                <div className="flex">
                  {tabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                        activeTab === tab.key
                          ? "border-primary text-primary"
                          : "border-transparent text-gray-500 hover:text-navy"
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* ── Tab content ── */}
              <div className="mt-4 pb-6">
                {/* DETAILS */}
                {activeTab === "details" && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-semibold text-navy mb-2">About This Property</h3>
                      <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
                    </div>

                    <div>
                      <h3 className="font-semibold text-navy mb-3">Landlord</h3>
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                        <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                          GW
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-navy text-sm">Grace Wanjiku</p>
                          <p className="text-xs text-gray-400">Property Owner · Member since 2021</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <a
                            href="tel:+254700000000"
                            className="w-9 h-9 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center hover:bg-teal-100 transition-colors"
                          >
                            <Phone className="w-4 h-4" />
                          </a>
                          <button className="w-9 h-9 bg-primary/10 text-primary rounded-xl flex items-center justify-center hover:bg-primary/20 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                        {[["3", "Properties"], ["4.8★", "Rating"], ["98%", "Response Rate"]].map(
                          ([v, l]) => (
                            <div key={l} className="bg-gray-50 rounded-xl p-2.5 border border-gray-100">
                              <p className="font-bold text-navy text-sm">{v}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{l}</p>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* AMENITIES */}
                {activeTab === "amenities" && (
                  <div className="space-y-4">
                    <h3 className="font-semibold text-navy">Amenities & Features</h3>
                    <div className="grid grid-cols-2 gap-2">
                      {property.features.map((f) => (
                        <div
                          key={f}
                          className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100 text-sm text-gray-600"
                        >
                          <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                          {f}
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-green-50 rounded-xl border border-green-100">
                      <div className="flex items-center gap-2 text-green-700 text-sm font-medium">
                        <CheckCircle2 className="w-4 h-4" />
                        You qualify for this property
                      </div>
                      <p className="text-xs text-green-600 mt-1">
                        Min. credit score: 580 · Income: 3× rent · Deposit: 2 months
                      </p>
                    </div>
                  </div>
                )}

                {/* RENT LOAN */}
                {activeTab === "rent-loan" && (
                  <div className="space-y-4">
                    {property.type === "rent-to-own" && property.propertyValue ? (
                      <div className="bg-navy text-white rounded-2xl p-5">
                        <h3 className="font-bold mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Rent-to-Own Breakdown
                        </h3>
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          {[
                            ["Property Value", `KES ${(property.propertyValue / 1000000).toFixed(1)}M`, "text-white"],
                            ["Monthly Equity", `KES ${equityPerMonth.toLocaleString()}`, "text-green-400"],
                            ["Months to Own", String(monthsToOwn), "text-primary"],
                          ].map(([label, val, color]) => (
                            <div key={label} className="bg-white/10 rounded-xl p-3 text-center">
                              <p className="text-gray-400 text-xs mb-1">{label}</p>
                              <p className={`font-bold text-sm ${color}`}>{val}</p>
                            </div>
                          ))}
                        </div>
                        {[
                          { label: "Rent (65%)", pct: 65, color: "bg-blue-400" },
                          { label: "Equity (35%)", pct: 35, color: "bg-green-400" },
                        ].map((item) => (
                          <div key={item.label} className="mb-3">
                            <div className="flex justify-between text-xs mb-1.5">
                              <span className="text-gray-400">{item.label}</span>
                              <span className="text-white">
                                KES {Math.round((property.price * item.pct) / 100).toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full bg-white/10 rounded-full h-1.5">
                              <div
                                className={`${item.color} h-1.5 rounded-full`}
                                style={{ width: `${item.pct}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="bg-primary/5 rounded-2xl p-5 border border-primary/20">
                        <h3 className="font-bold text-navy mb-2 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-primary" />
                          Rent Loan Available
                        </h3>
                        <p className="text-sm text-gray-500 mb-4">
                          Need help with rent? Apply for a short-term rent loan and move in now.
                        </p>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                          {[
                            ["Up to KES 150K", "Loan amount"],
                            ["7–14 days", "Approval time"],
                            ["12% p.a.", "Interest rate"],
                            ["3–12 months", "Repayment"],
                          ].map(([v, l]) => (
                            <div key={l} className="bg-white rounded-xl p-3 text-center border border-gray-100">
                              <p className="font-bold text-navy text-sm">{v}</p>
                              <p className="text-xs text-gray-400 mt-0.5">{l}</p>
                            </div>
                          ))}
                        </div>
                        <Link
                          to="/loans"
                          className="block text-center py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors"
                        >
                          Apply for Rent Loan
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Related properties */}
              <div className="mt-2 lg:mt-8">
                <h2 className="font-bold text-navy text-lg mb-4">Similar Properties</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                  {related.map((p) => (
                    <PropertyCard key={p.id} property={p} />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── Desktop Sidebar ───────────────────────── */}
          <div className="hidden lg:block space-y-5 sticky top-24 self-start">
            <div className="card border-2 border-primary/20">
              <h2 className="font-bold text-navy text-lg mb-1">Interested?</h2>
              <p className="text-sm text-gray-400 mb-5">Apply now or schedule a viewing.</p>
              <div className="space-y-3">
                <Link to="/register" className="btn-primary w-full text-center block">
                  Apply Now
                </Link>
                <div className="grid grid-cols-2 gap-2">
                  <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-500 text-white text-sm font-medium hover:bg-teal-600 transition-colors">
                    <Calendar className="w-4 h-4" />
                    Schedule
                  </button>
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`flex items-center justify-center gap-1.5 py-2.5 rounded-xl border-2 text-sm font-medium transition-colors ${
                      saved
                        ? "border-primary bg-primary/10 text-primary"
                        : "border-gray-200 text-navy hover:bg-gray-50"
                    }`}
                  >
                    <Heart className={`w-4 h-4 ${saved ? "fill-primary" : ""}`} />
                    {saved ? "Saved" : "Save"}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <a
                    href="tel:+254700000000"
                    className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-navy text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    Call Agent
                  </a>
                  <button className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-gray-200 text-navy text-sm font-medium hover:bg-gray-50 transition-colors">
                    <MessageCircle className="w-4 h-4" />
                    Callback
                  </button>
                </div>
                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white text-sm font-bold hover:bg-red-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add to My Rentals
                </Link>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-navy mb-3">Eligibility</h3>
              <div className="space-y-3 text-sm">
                {[
                  ["Min. Credit Score", "580"],
                  ["Income Ratio", "3× monthly rent"],
                  ["Deposit", "2 months rent"],
                ].map(([l, v]) => (
                  <div key={l} className="flex items-center justify-between">
                    <span className="text-gray-500">{l}</span>
                    <span className="font-semibold text-navy">{v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  You qualify for this property
                </div>
              </div>
            </div>

            <div className="card">
              <h3 className="font-semibold text-navy mb-3">Payment Methods</h3>
              <div className="space-y-2">
                {["M-Pesa STK Push", "Visa / Mastercard", "Bank Transfer", "Rent Loan Available"].map(
                  (m) => (
                    <div key={m} className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      {m}
                    </div>
                  )
                )}
              </div>
            </div>

            <div className="card bg-gray-50">
              <h3 className="font-semibold text-navy mb-3">Landlord</h3>
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold text-sm shrink-0">
                  GW
                </div>
                <div>
                  <p className="font-semibold text-navy text-sm">Grace Wanjiku</p>
                  <p className="text-xs text-gray-400">Member since 2021</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
