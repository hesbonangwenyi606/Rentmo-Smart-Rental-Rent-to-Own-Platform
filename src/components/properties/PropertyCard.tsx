import { useState } from "react";
import { Link } from "react-router-dom";
import { Bed, Bath, Maximize2, MapPin, Star, TrendingUp, Heart } from "lucide-react";
import { clsx } from "clsx";
import type { Property } from "@/lib/api";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  const [saved, setSaved] = useState(false);

  return (
    <div className={clsx("group relative", className)}>
      <Link
        to={`/properties/${property.id}`}
        className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 block"
      >
        {/* Image */}
        <div className="relative h-52 overflow-hidden bg-gray-100">
          <img
            src={property.images?.[0] ?? ""}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Gradient overlay for badges readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />

          {/* Top badges */}
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className={clsx(
                "px-2.5 py-1 rounded-full text-xs font-bold shadow-sm",
                property.type === "rent-to-own"
                  ? "bg-primary text-white"
                  : "bg-navy text-white"
              )}
            >
              {property.type === "rent-to-own" ? "Rent-to-Own" : "For Rent"}
            </span>
            {!property.available && (
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-black/60 text-white">
                Occupied
              </span>
            )}
          </div>

          {/* Equity badge */}
          {property.type === "rent-to-own" && (
            <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow-md">
              <TrendingUp className="w-3.5 h-3.5 text-green-500" />
              <span className="text-xs font-bold text-green-600">
                {property.equityRate}% equity
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <h3 className="font-semibold text-navy text-base group-hover:text-primary transition-colors line-clamp-1 flex-1">
              {property.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0 bg-yellow-50 px-2 py-0.5 rounded-full">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-xs font-semibold text-yellow-700">
                {property.rating}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
            <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="line-clamp-1">{property.location}</span>
          </div>

          {/* Specs */}
          <div className="flex items-center gap-3 text-xs text-gray-500 mb-4 bg-gray-50 rounded-xl px-3 py-2">
            <div className="flex items-center gap-1">
              <Bed className="w-3.5 h-3.5" />
              <span>{property.bedrooms} Bed</span>
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1">
              <Bath className="w-3.5 h-3.5" />
              <span>{property.bathrooms} Bath</span>
            </div>
            <div className="w-px h-3 bg-gray-200" />
            <div className="flex items-center gap-1">
              <Maximize2 className="w-3.5 h-3.5" />
              <span>{property.size.toLocaleString()} sqft</span>
            </div>
          </div>

          {/* Price row */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-4">
            <div>
              <div className="text-xl font-bold text-navy">
                KES {property.price.toLocaleString()}
                <span className="text-sm font-normal text-gray-400">/mo</span>
              </div>
              {property.type === "rent-to-own" && property.propertyValue && (
                <div className="text-xs text-gray-400 mt-0.5">
                  Value: KES {(property.propertyValue / 1_000_000).toFixed(1)}M
                </div>
              )}
            </div>
            <span
              className={clsx(
                "text-xs px-2.5 py-1 rounded-full font-semibold",
                property.available
                  ? "bg-green-50 text-green-700"
                  : "bg-gray-100 text-gray-500"
              )}
            >
              {property.available ? "Available" : "Occupied"}
            </span>
          </div>
        </div>
      </Link>

      {/* Wishlist button — outside the Link to avoid nested <a> */}
      <button
        onClick={(e) => { e.preventDefault(); setSaved(!saved); }}
        className={clsx(
          "absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-all duration-200",
          saved
            ? "bg-primary text-white scale-110"
            : "bg-white/90 text-gray-400 hover:text-primary hover:scale-110"
        )}
        aria-label={saved ? "Remove from saved" : "Save property"}
      >
        <Heart className={clsx("w-4 h-4", saved && "fill-current")} />
      </button>
    </div>
  );
}
