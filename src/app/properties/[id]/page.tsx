"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Star,
  Heart,
  Share2,
  ChevronLeft,
  CheckCircle2,
  TrendingUp,
  CreditCard,
  Calendar,
  Phone,
  Mail,
  ChevronRight,
  ChevronLeft as PrevIcon,
} from "lucide-react";
import { properties } from "@/lib/data";
import PropertyCard from "@/components/properties/PropertyCard";

export default function PropertyDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const property = properties.find((p) => p.id === id) ?? properties[0];
  const related = properties.filter((p) => p.id !== id).slice(0, 3);

  const [activeImg, setActiveImg] = useState(0);
  const [saved, setSaved] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const equityPerMonth = property.type === "rent-to-own" && property.propertyValue
    ? Math.round((property.price * 0.35))
    : 0;
  const monthsToOwn = property.type === "rent-to-own" && property.propertyValue
    ? Math.ceil(property.propertyValue / equityPerMonth)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/properties" className="hover:text-primary transition-colors">Properties</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-navy font-medium">{property.title}</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Gallery */}
            <div className="relative rounded-2xl overflow-hidden bg-gray-100">
              <div className="relative h-80 md:h-[420px]">
                <Image
                  src={property.images[activeImg] ?? property.image}
                  alt={property.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />

                {/* Navigation arrows */}
                {property.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setActiveImg((i) => (i === 0 ? property.images.length - 1 : i - 1))}
                      className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow hover:bg-white transition-colors"
                    >
                      <PrevIcon className="w-5 h-5 text-navy" />
                    </button>
                    <button
                      onClick={() => setActiveImg((i) => (i === property.images.length - 1 ? 0 : i + 1))}
                      className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center shadow hover:bg-white transition-colors"
                    >
                      <ChevronRight className="w-5 h-5 text-navy" />
                    </button>
                  </>
                )}

                {/* Badges */}
                <div className="absolute top-4 left-4 flex gap-2">
                  <span className={`px-3 py-1.5 rounded-full text-xs font-semibold ${property.type === "rent-to-own" ? "bg-primary text-white" : "bg-navy text-white"}`}>
                    {property.type === "rent-to-own" ? "Rent-to-Own" : "For Rent"}
                  </span>
                  {property.available && (
                    <span className="px-3 py-1.5 rounded-full text-xs font-semibold bg-green-500 text-white">Available</span>
                  )}
                </div>

                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={() => setSaved(!saved)}
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow ${saved ? "bg-primary text-white" : "bg-white/90 text-gray-600 hover:bg-white"}`}
                  >
                    <Heart className={`w-5 h-5 ${saved ? "fill-white" : ""}`} />
                  </button>
                  <button className="w-10 h-10 bg-white/90 rounded-xl flex items-center justify-center text-gray-600 hover:bg-white shadow transition-colors">
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Thumbnails */}
              {property.images.length > 1 && (
                <div className="flex gap-2 p-3 bg-white">
                  {property.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`relative w-16 h-12 rounded-lg overflow-hidden border-2 transition-colors ${activeImg === i ? "border-primary" : "border-transparent"}`}
                    >
                      <Image src={img} alt="" fill className="object-cover" sizes="64px" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Title & basics */}
            <div className="card">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-navy">{property.title}</h1>
                  <div className="flex items-center gap-2 text-gray-500 mt-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{property.location}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-navy">
                    KES {property.price.toLocaleString()}
                    <span className="text-base font-normal text-gray-400">/mo</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1 justify-end">
                    <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                    <span className="font-medium text-navy">{property.rating}</span>
                    <span className="text-gray-400 text-sm">({property.reviews} reviews)</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-6 py-4 border-t border-gray-100">
                <div className="flex items-center gap-2 text-gray-600">
                  <Bed className="w-5 h-5 text-primary" />
                  <span className="font-medium">{property.bedrooms} Bedrooms</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Bath className="w-5 h-5 text-primary" />
                  <span className="font-medium">{property.bathrooms} Bathrooms</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Maximize2 className="w-5 h-5 text-primary" />
                  <span className="font-medium">{property.size.toLocaleString()} sq ft</span>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4">
                <h3 className="font-semibold text-navy mb-3">Amenities & Features</h3>
                <div className="flex flex-wrap gap-2">
                  {property.features.map((f) => (
                    <span key={f} className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-lg text-sm text-gray-600 border border-gray-100">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      {f}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Rent-to-Own breakdown */}
            {property.type === "rent-to-own" && property.propertyValue && (
              <div className="card bg-navy text-white">
                <h2 className="font-bold text-lg mb-5 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-primary" />
                  Rent-to-Own Breakdown
                </h2>
                <div className="grid sm:grid-cols-3 gap-5 mb-6">
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Property Value</p>
                    <p className="text-xl font-bold">KES {(property.propertyValue / 1000000).toFixed(1)}M</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Monthly Equity</p>
                    <p className="text-xl font-bold text-green-400">KES {equityPerMonth.toLocaleString()}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4">
                    <p className="text-gray-400 text-xs mb-1">Est. Months to Own</p>
                    <p className="text-xl font-bold text-primary">{monthsToOwn}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {[
                    { label: "Rent portion (65%)", pct: 65, color: "bg-blue-400" },
                    { label: `Equity portion (35%)`, pct: 35, color: "bg-green-400" },
                  ].map((item) => (
                    <div key={item.label}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-300">{item.label}</span>
                        <span className="text-white font-medium">
                          KES {Math.round((property.price * item.pct) / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="w-full bg-white/10 rounded-full h-2">
                        <div className={`${item.color} h-2 rounded-full`} style={{ width: `${item.pct}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Similar Properties */}
            <div>
              <h2 className="font-bold text-navy text-xl mb-4">Similar Properties</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {related.map((p) => (
                  <PropertyCard key={p.id} property={p} />
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-5 lg:sticky lg:top-24 lg:self-start">
            {/* CTA Card */}
            <div className="card border-2 border-primary/20">
              <h2 className="font-bold text-navy text-lg mb-1">
                Interested in this property?
              </h2>
              <p className="text-sm text-gray-400 mb-5">
                Apply now or schedule a viewing.
              </p>
              <div className="space-y-3">
                <Link href="/register" className="btn-primary w-full text-center block">
                  Apply Now
                </Link>
                <button
                  onClick={() => setShowContact(!showContact)}
                  className="btn-secondary w-full flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Schedule Viewing
                </button>
              </div>

              {showContact && (
                <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                  <p className="text-sm font-semibold text-navy">Landlord Contact</p>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-bold">
                      GW
                    </div>
                    <div>
                      <p className="text-sm font-medium text-navy">Grace Wanjiku</p>
                      <p className="text-xs text-gray-400">Property Owner</p>
                    </div>
                  </div>
                  <a href="tel:+254700000000" className="flex items-center gap-2 text-sm text-navy hover:text-primary transition-colors">
                    <Phone className="w-4 h-4 text-primary" />
                    +254 700 000 000
                  </a>
                  <a href="mailto:grace@rentmo.co.ke" className="flex items-center gap-2 text-sm text-navy hover:text-primary transition-colors">
                    <Mail className="w-4 h-4 text-primary" />
                    grace@rentmo.co.ke
                  </a>
                </div>
              )}
            </div>

            {/* Credit score requirement */}
            <div className="card">
              <h3 className="font-semibold text-navy mb-3">Eligibility</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Min. Credit Score</span>
                  <span className="font-semibold text-navy">580</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Income Ratio</span>
                  <span className="font-semibold text-navy">3× monthly rent</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Deposit</span>
                  <span className="font-semibold text-navy">2 months rent</span>
                </div>
              </div>
              <div className="mt-4 p-3 bg-green-50 rounded-xl border border-green-100">
                <div className="flex items-center gap-2 text-green-700 text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  You qualify for this property
                </div>
              </div>
            </div>

            {/* Payment options */}
            <div className="card">
              <h3 className="font-semibold text-navy mb-3">Payment Methods</h3>
              <div className="space-y-2">
                {["M-Pesa STK Push", "Visa / Mastercard", "Bank Transfer", "Rent Loan Available"].map((method) => (
                  <div key={method} className="flex items-center gap-2 text-sm text-gray-600">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    {method}
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
