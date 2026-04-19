import { useState, useEffect } from "react";
import { Search, SlidersHorizontal, MapPin, X, Grid3X3, List } from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { properties as propertiesApi, Property } from "@/lib/api";
import { clsx } from "clsx";

const neighborhoods = ["All", "Kilimani", "Karen", "Westlands", "Lavington", "Kileleshwa", "Parklands"];
const types = ["All", "rent", "rent-to-own"];
const bedroomOptions = ["Any", "1", "2", "3", "4+"];

export default function PropertiesPage() {
  const [search, setSearch] = useState("");
  const [selectedArea, setSelectedArea] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [selectedBeds, setSelectedBeds] = useState("Any");
  const [priceMax, setPriceMax] = useState(200000);
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [results, setResults] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(true);
      propertiesApi
        .list({
          search: search || undefined,
          neighborhood: selectedArea !== "All" ? selectedArea : undefined,
          type: selectedType !== "All" ? selectedType : undefined,
          bedrooms: selectedBeds !== "Any" ? selectedBeds : undefined,
          priceMax,
        })
        .then((res) => {
          setResults(res.data);
          setTotal(res.pagination?.total ?? res.data.length);
        })
        .catch(() => {})
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timer);
  }, [search, selectedArea, selectedType, selectedBeds, priceMax]);

  return (
    <div className="min-h-screen bg-gray-50 page-content">
      {/* Page Header */}
      <div className="bg-navy text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1.5">Browse Properties</h1>
          <p className="text-gray-300 text-sm sm:text-base">
            Find your perfect home in Nairobi — rent or own.
          </p>

          <div className="mt-5 sm:mt-6 flex gap-2 sm:gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, location..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl outline-none focus:bg-white/20 focus:border-white/40 transition-colors"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={clsx(
                "flex items-center gap-2 px-5 py-3.5 rounded-xl border font-medium text-sm transition-colors",
                showFilters
                  ? "bg-primary border-primary text-white"
                  : "border-white/30 text-white hover:bg-white/10"
              )}
            >
              <SlidersHorizontal className="w-4 h-4" />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Filters panel */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Neighborhood</label>
                <div className="flex flex-wrap gap-1.5">
                  {neighborhoods.map((area) => (
                    <button
                      key={area}
                      onClick={() => setSelectedArea(area)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        selectedArea === area
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Property Type</label>
                <div className="flex flex-wrap gap-1.5">
                  {types.map((t) => (
                    <button
                      key={t}
                      onClick={() => setSelectedType(t)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors capitalize",
                        selectedType === t
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {t === "rent-to-own" ? "Rent-to-Own" : t === "rent" ? "For Rent" : t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">Bedrooms</label>
                <div className="flex gap-1.5">
                  {bedroomOptions.map((b) => (
                    <button
                      key={b}
                      onClick={() => setSelectedBeds(b)}
                      className={clsx(
                        "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                        selectedBeds === b
                          ? "bg-primary text-white"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      )}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-2">
                  Max Price: KES {priceMax.toLocaleString()}/mo
                </label>
                <input
                  type="range"
                  min={20000}
                  max={200000}
                  step={5000}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>KES 20K</span>
                  <span>KES 200K</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Area quick tabs */}
      <div className="bg-white border-b border-gray-100 overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1 py-3">
            <MapPin className="w-4 h-4 text-primary shrink-0 mr-1" />
            {neighborhoods.map((area) => (
              <button
                key={area}
                onClick={() => setSelectedArea(area)}
                className={clsx(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  selectedArea === area
                    ? "bg-navy text-white"
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                {area}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-bold text-navy text-lg">
              {loading ? "Loading..." : `${total} Properties Found`}
            </h2>
            <p className="text-sm text-gray-400 mt-0.5">
              {selectedArea !== "All" ? `in ${selectedArea}` : "across Nairobi"}
              {selectedType !== "All" ? ` · ${selectedType === "rent-to-own" ? "Rent-to-Own" : "For Rent"}` : ""}
            </p>
          </div>
          <div className="flex items-center gap-2 border border-gray-200 rounded-xl p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={clsx("p-2 rounded-lg transition-colors", viewMode === "grid" ? "bg-navy text-white" : "text-gray-400 hover:text-navy")}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={clsx("p-2 rounded-lg transition-colors", viewMode === "list" ? "bg-navy text-white" : "text-gray-400 hover:text-navy")}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
          </div>
        ) : results.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-6xl mb-4">🏚️</div>
            <h3 className="text-xl font-bold text-navy mb-2">No properties found</h3>
            <p className="text-gray-400 mb-6">Try adjusting your filters or search terms.</p>
            <button
              onClick={() => {
                setSearch("");
                setSelectedArea("All");
                setSelectedType("All");
                setSelectedBeds("Any");
                setPriceMax(200000);
              }}
              className="btn-primary"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div
            className={clsx(
              "grid gap-7",
              viewMode === "grid"
                ? "sm:grid-cols-2 lg:grid-cols-3"
                : "grid-cols-1 max-w-3xl"
            )}
          >
            {results.map((p) => (
              <PropertyCard key={p.id} property={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
