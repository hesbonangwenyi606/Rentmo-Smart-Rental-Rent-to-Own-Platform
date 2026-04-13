import Link from "next/link";
import Image from "next/image";
import { Bed, Bath, Maximize2, MapPin, Star, TrendingUp } from "lucide-react";
import { clsx } from "clsx";
import type { Property } from "@/lib/data";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export default function PropertyCard({ property, className }: PropertyCardProps) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className={clsx(
        "group bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 block",
        className
      )}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span
            className={clsx(
              "px-2.5 py-1 rounded-full text-xs font-semibold",
              property.type === "rent-to-own"
                ? "bg-primary text-white"
                : "bg-navy text-white"
            )}
          >
            {property.type === "rent-to-own" ? "Rent-to-Own" : "For Rent"}
          </span>
          {!property.available && (
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-800/80 text-white">
              Taken
            </span>
          )}
        </div>
        {property.type === "rent-to-own" && (
          <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-sm rounded-lg px-2.5 py-1.5 flex items-center gap-1.5 shadow">
            <TrendingUp className="w-3.5 h-3.5 text-green-500" />
            <span className="text-xs font-semibold text-green-600">
              {property.equityRate}% equity
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-navy text-base group-hover:text-primary transition-colors line-clamp-1">
            {property.title}
          </h3>
          <div className="flex items-center gap-1 shrink-0">
            <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
            <span className="text-xs font-medium text-gray-600">
              {property.rating}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 text-sm text-gray-500 mb-4">
          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
          {property.location}
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-1.5">
            <Bed className="w-4 h-4" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Bath className="w-4 h-4" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Maximize2 className="w-4 h-4" />
            <span>{property.size.toLocaleString()} sqft</span>
          </div>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between border-t border-gray-100 pt-4">
          <div>
            <div className="text-xl font-bold text-navy">
              KES {property.price.toLocaleString()}
              <span className="text-sm font-normal text-gray-400">/mo</span>
            </div>
            {property.type === "rent-to-own" && property.propertyValue && (
              <div className="text-xs text-gray-400 mt-0.5">
                Property Value: KES {(property.propertyValue / 1000000).toFixed(1)}M
              </div>
            )}
          </div>
          <span
            className={clsx(
              "text-xs px-2.5 py-1 rounded-full font-medium",
              property.available
                ? "bg-green-50 text-green-600"
                : "bg-gray-100 text-gray-400"
            )}
          >
            {property.available ? "Available" : "Occupied"}
          </span>
        </div>
      </div>
    </Link>
  );
}
