import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  X,
} from "lucide-react";
import PropertyCard from "@/components/properties/PropertyCard";
import { properties, testimonials, stats } from "@/lib/data";

function PromoPopup({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center px-3 py-4 sm:px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Card */}
      <div className="relative z-10 w-full max-w-3xl rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl animate-fade-in">

        {/* Banner body */}
        <div
          className="relative px-5 sm:px-10 py-8 sm:py-12"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1200&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-navy/75" />

          {/* Rentmo logo top-left */}
          <div className="absolute top-3 left-4 flex items-center gap-1.5 z-10">
            <div className="w-6 h-6 bg-primary rounded-md flex items-center justify-center">
              <Home className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-white font-bold text-sm leading-none">
              rent<span className="text-primary">mo</span>
              <span className="block text-[9px] text-yellow-400 font-medium tracking-widest -mt-0.5">dwell well</span>
            </span>
          </div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-black/60 hover:bg-black/90 text-white rounded-full flex items-center justify-center transition-colors z-20"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Layout: stacked on mobile, row on sm+ */}
          <div className="relative z-10 pt-6 flex flex-col sm:flex-row items-center gap-4 sm:gap-0">
            {/* Left badge */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-yellow-400 flex flex-col items-center justify-center text-center shrink-0 shadow-lg">
              <span className="text-navy font-black text-base sm:text-lg leading-tight">No</span>
              <span className="text-navy font-black text-base sm:text-lg leading-tight">Fixed</span>
              <span className="text-navy font-black text-base sm:text-lg leading-tight">Term</span>
            </div>

            {/* Centre text */}
            <div className="flex-1 text-center px-4 sm:px-6">
              <p className="text-white/90 text-sm sm:text-xl font-semibold mb-1">Blacklisted or No credit score?</p>
              <p
                className="font-black text-3xl sm:text-5xl leading-tight"
                style={{ color: "#f4c430", textShadow: "0 2px 12px rgba(0,0,0,0.5)" }}
              >
                RENT-TO-OWN
              </p>
            </div>

            {/* Right badge */}
            <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-[#1a5e2a] border-4 border-yellow-400 flex flex-col items-center justify-center text-center shrink-0 shadow-lg">
              <span className="text-yellow-400 font-black text-2xl sm:text-3xl leading-none">10%</span>
              <span className="text-white font-bold text-xs sm:text-sm">OFF</span>
            </div>
          </div>
        </div>

        {/* CTA bar */}
        <div className="bg-white px-5 sm:px-8 py-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm sm:text-base font-semibold text-gray-800 text-center sm:text-left">
            Start your rent-to-own journey today — no credit score needed.
          </p>
          <Link
            to="/rent-to-own"
            onClick={onClose}
            className="shrink-0 w-full sm:w-auto text-center bg-primary text-white font-bold px-6 py-2.5 rounded-xl hover:bg-primary-dark transition-colors"
          >
            Learn More
          </Link>
        </div>
      </div>
    </div>
  );
}

// ── Animation helpers ────────────────────────────────────────────────────────

function useInView(threshold = 0.25) {
  const ref = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function useCountUp(target: number, duration: number, started: boolean) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!started) {
      setCount(0);
      return;
    }
    let rafId: number;
    let startTs = 0;
    const step = (ts: number) => {
      if (!startTs) startTs = ts;
      const progress = Math.min((ts - startTs) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setCount(Math.round(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(step);
    };
    rafId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafId);
  }, [target, duration, started]);
  return count;
}

const statsMeta = [
  { numericValue: 2400, prefix: "", suffix: "+", formatted: true },
  { numericValue: 8500, prefix: "", suffix: "+", formatted: true },
  { numericValue: 94,   prefix: "", suffix: "%", formatted: false },
  { numericValue: 127,  prefix: "+", suffix: "pts", formatted: false },
];

function AnimatedStat({
  icon, label, index, numericValue, prefix, suffix, formatted, started,
}: {
  icon: string; label: string; index: number;
  numericValue: number; prefix: string; suffix: string; formatted: boolean;
  started: boolean;
}) {
  const count = useCountUp(numericValue, 2000, started);
  const display = formatted ? count.toLocaleString() : count;

  return (
    <div
      className="text-center"
      style={{
        opacity: started ? 1 : 0,
        transform: started ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${index * 130}ms, transform 0.65s ease ${index * 130}ms`,
      }}
    >
      <div
        className="text-4xl mb-3"
        style={{
          display: "inline-block",
          transform: started ? "scale(1)" : "scale(0.4)",
          transition: `transform 0.55s cubic-bezier(0.34, 1.56, 0.64, 1) ${index * 130 + 80}ms`,
        }}
      >
        {icon}
      </div>
      <div className="text-3xl font-bold text-navy tabular-nums tracking-tight">
        {prefix}{display}{suffix}
      </div>
      <div className="text-sm text-gray-500 mt-1.5">{label}</div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────

const propertyTypes = ["All Types", "For Rent", "Rent-to-Own"];

const howItWorks = [
  { step: "01", title: "Browse & Find", desc: "Explore thousands of verified properties in Nairobi. Filter by location, price, bedrooms, and type.", icon: Search, color: "bg-blue-50 text-blue-600" },
  { step: "02", title: "Apply & Move In", desc: "Apply instantly, get credit-checked, sign your digital lease, and move into your new home.", icon: Home, color: "bg-green-50 text-green-600" },
  { step: "03", title: "Pay & Build Credit", desc: "Pay rent via M-Pesa, card or bank. Every payment builds your credit score and equity.", icon: TrendingUp, color: "bg-primary/10 text-primary" },
  { step: "04", title: "Own Your Home", desc: "Reach 100% equity and transfer ownership. Your rent becomes your mortgage payment.", icon: Building2, color: "bg-purple-50 text-purple-600" },
];

const features = [
  { title: "Credit Score Tracking", desc: "Every rent payment builds your Rentmo credit score (300–850), unlocking better rates and loan access.", icon: CreditCard, color: "from-blue-500 to-cyan-400" },
  { title: "Rent-to-Own Program", desc: "A portion of every monthly payment goes toward owning your home. No huge deposit needed.", icon: Building2, color: "from-primary to-orange-400" },
  { title: "Instant Rent Loans", desc: "Struggling this month? Get a short-term rent loan disbursed directly to your landlord in hours.", icon: Banknote, color: "from-green-500 to-emerald-400" },
  { title: "Rentmo Cover", desc: "Insurance that protects tenants from eviction during income disruptions. Basic & Premium plans.", icon: Shield, color: "from-purple-500 to-indigo-400" },
];

export default function LandingPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState("All Types");
  const [showPromo, setShowPromo] = useState(true);
  const navigate = useNavigate();

  const featuredProperties = properties.slice(0, 3);
  const { ref: statsRef, inView: statsInView } = useInView();
  const closePromo = useCallback(() => setShowPromo(false), []);

  const handleSearch = () => {
    navigate(`/properties?q=${searchQuery}&type=${selectedType}`);
  };

  return (
    <div className="overflow-x-hidden">
      {/* ── PROMO POPUP ── */}
      {showPromo && <PromoPopup onClose={closePromo} />}

      {/* ── HERO ── */}
      <section className="gradient-hero min-h-[88vh] sm:min-h-[92vh] flex items-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "40px 40px" }} />
        </div>
        <div className="absolute top-20 right-20 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-16 sm:pb-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white rounded-full px-4 py-1.5 text-sm font-medium mb-6">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                2,400+ Verified Properties in Nairobi
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Find Your Home.<br />
                <span className="text-primary">Rent Smart.</span><br />
                <span className="text-white/80">Then Own It.</span>
              </h1>
              <p className="text-gray-300 text-base sm:text-lg mt-5 sm:mt-6 leading-relaxed max-w-lg">
                Rentmo simplifies renting in Nairobi while helping you build credit, access rent loans, and transition into homeownership through our innovative rent-to-own model.
              </p>

              <div className="mt-6 sm:mt-8 bg-white rounded-2xl shadow-2xl p-2 flex flex-col sm:flex-row gap-2">
                <div className="flex-1 flex items-center gap-2 px-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by location, property name..."
                    className="w-full py-2.5 text-navy placeholder-gray-400 outline-none text-sm"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  />
                </div>
                <div className="flex gap-2 items-center px-3 sm:px-2 border-t sm:border-t-0 sm:border-l border-gray-100 pt-2 sm:pt-0">
                  <select
                    className="text-sm text-gray-600 outline-none bg-transparent py-2 pr-2 w-full sm:w-auto"
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                  >
                    {propertyTypes.map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <button onClick={handleSearch} className="btn-primary !rounded-xl whitespace-nowrap flex items-center justify-center gap-2">
                  <Search className="w-4 h-4" />
                  Search
                </button>
              </div>

              <div className="flex flex-wrap gap-2 mt-4">
                {["Kilimani", "Karen", "Westlands", "Lavington"].map((area) => (
                  <button
                    key={area}
                    className="text-xs text-gray-300 border border-white/20 rounded-full px-3 py-1 hover:bg-white/10 hover:text-white transition-colors"
                    onClick={() => navigate(`/properties?area=${area}`)}
                  >
                    {area}
                  </button>
                ))}
              </div>
            </div>

            <div className="hidden lg:block relative animate-slide-up">
              <div className="relative">
                <img
                  src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80"
                  alt="Modern Nairobi apartment"
                  className="rounded-3xl object-cover w-full shadow-2xl"
                  loading="eager"
                />
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

      {/* ── STATS ── */}
      <section ref={statsRef as React.RefObject<HTMLElement>} className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, i) => (
              <AnimatedStat
                key={stat.label}
                icon={stat.icon}
                label={stat.label}
                index={i}
                started={statsInView}
                {...statsMeta[i]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section className="bg-white border-b border-gray-100 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center gap-x-8 gap-y-6">
            {/* Label */}
            <div className="flex items-center gap-6 shrink-0">
              <span className="text-2xl font-bold text-[#3a7d44]">Partners.</span>
              <div className="w-px h-12 bg-[#e8a020]" />
            </div>

            {/* Co-op Bank */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-12 h-12 rounded-lg bg-[#1a5e2a] flex items-center justify-center">
                <svg viewBox="0 0 40 40" className="w-8 h-8" fill="white">
                  <rect x="4" y="4" width="14" height="14" rx="2" />
                  <rect x="22" y="4" width="14" height="14" rx="2" />
                  <rect x="4" y="22" width="14" height="14" rx="2" />
                  <rect x="22" y="22" width="14" height="14" rx="2" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-[11px] font-bold text-[#1a5e2a] tracking-widest">CO-OP</div>
                <div className="text-[15px] font-black text-[#1a5e2a] tracking-widest -mt-0.5">BANK</div>
              </div>
            </div>

            {/* buyrentkenya.com */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="w-10 h-10 rounded-full border-2 border-[#c0392b] flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-[#c0392b]">
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
              </div>
              <div className="leading-tight">
                <div className="text-[15px] font-bold text-gray-800">
                  buyrent<span className="text-[#c0392b]">kenya</span>.com
                </div>
                <div className="text-[10px] italic text-gray-500 -mt-0.5">it's that simple</div>
              </div>
            </div>

            {/* PAM GOLDING */}
            <div className="shrink-0 text-center">
              <div className="text-[11px] tracking-[0.2em] text-gray-500 font-medium">PAM GOLDING</div>
              <div className="text-[13px] tracking-[0.3em] text-gray-700 font-semibold border-t border-b border-gray-300 px-2 py-0.5 mt-0.5">
                PROPERTIES
              </div>
            </div>

            {/* PigiAme */}
            <div className="flex items-center shrink-0">
              <span className="text-[22px] font-black text-gray-900 tracking-tight">pigi</span>
              <span className="relative text-[22px] font-black text-[#e63946] tracking-tight">
                a
                {/* wifi-like signal arcs */}
                <span className="absolute -top-1 -right-0.5 flex flex-col items-center gap-px">
                  <span className="w-2.5 h-1 border-t-2 border-r-2 border-[#e63946] rounded-tr-full" />
                  <span className="w-1.5 h-0.5 border-t-2 border-r-2 border-[#e63946] rounded-tr-full opacity-70" />
                </span>
              </span>
              <span className="text-[22px] font-black text-gray-900 tracking-tight ml-2">me</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Simple Process</span>
            <h2 className="section-heading mt-2">How Rentmo Works</h2>
            <p className="section-sub max-w-xl mx-auto">From browsing to owning — your entire rental journey in one platform.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((item, i) => (
              <div key={item.step} className="relative">
                {i < howItWorks.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-full w-full h-px border-t-2 border-dashed border-gray-200 z-0" />
                )}
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${item.color} flex items-center justify-center mb-5 shadow-sm`}>
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div className="text-5xl font-black text-gray-100 absolute -top-2 right-0 leading-none select-none">{item.step}</div>
                  <h3 className="text-lg font-bold text-navy mb-2">{item.title}</h3>
                  <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PROPERTIES ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-12">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Hand-Picked</span>
              <h2 className="section-heading mt-2">Featured Properties</h2>
              <p className="section-sub">Top-rated homes available now in Nairobi.</p>
            </div>
            <Link to="/properties" className="hidden md:flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all">
              View All Properties <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredProperties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
          <div className="text-center mt-10 md:hidden">
            <Link to="/properties" className="btn-outline">View All Properties</Link>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Why Rentmo</span>
            <h2 className="section-heading mt-2">More than just a rental platform</h2>
            <p className="section-sub max-w-xl mx-auto">We've built a complete financial ecosystem around renting to help you thrive.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div key={f.title} className="card-hover group cursor-pointer">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition-transform`}>
                  <f.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-navy mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RENT-TO-OWN EXPLAINER ── */}
      <section className="py-24 bg-navy overflow-hidden relative">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-5">
          <div className="w-full h-full" style={{ backgroundImage: "radial-gradient(circle at 2px 2px, white 1px, transparent 0)", backgroundSize: "32px 32px" }} />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
            <div>
              <span className="text-primary font-semibold text-sm uppercase tracking-wider">Rent-to-Own</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mt-2 leading-tight">
                Your rent is your<br /><span className="text-primary">mortgage payment</span>
              </h2>
              <p className="text-gray-300 mt-5 leading-relaxed text-lg">
                With Rentmo's rent-to-own program, a portion of every monthly payment builds equity toward owning your home. No huge deposit, no bank gatekeeping.
              </p>
              <ul className="mt-8 space-y-4">
                {["No large upfront down payment required", "Build equity from day one of renting", "Transparent ownership progress dashboard", "Transfer title once 100% equity is reached", "Credit score determines your equity rate"].map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-400 shrink-0 mt-0.5" />
                    <span className="text-gray-300 text-sm">{point}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col sm:flex-row gap-3 mt-8 sm:mt-10">
                <Link to="/rent-to-own" className="btn-primary text-center">Learn More</Link>
                <Link to="/calculator" className="border-2 border-white/30 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors flex items-center justify-center gap-2">
                  <Calculator className="w-4 h-4" /> Try Calculator
                </Link>
              </div>
            </div>

            <div className="bg-navy-light rounded-3xl p-8 border border-white/10">
              <h3 className="text-white font-semibold mb-6 text-lg">Monthly Payment Breakdown</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Monthly payment</span>
                  <span className="text-white font-semibold">KES 85,000</span>
                </div>
                {[{ label: "Rent portion (65%)", pct: "65%", color: "bg-blue-400", amount: "KES 55,250", amtClass: "text-gray-300" }, { label: "Equity portion (35%)", pct: "35%", color: "bg-green-400", amount: "KES 29,750", amtClass: "text-green-400 font-medium" }].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-sm mb-1.5">
                      <span className="text-gray-400">{row.label}</span>
                      <span className={row.amtClass}>{row.amount}</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-3">
                      <div className={`${row.color} h-3 rounded-full`} style={{ width: row.pct }} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 mt-6 pt-6">
                <p className="text-gray-400 text-sm mb-4">After 36 months of on-time payments:</p>
                <div className="grid grid-cols-3 gap-3">
                  {[{ v: "34%", l: "Equity Built" }, { v: "KES 1.07M", l: "Total Equity", cls: "text-green-400" }, { v: "6.3yr", l: "To Own", cls: "text-primary" }].map((s) => (
                    <div key={s.l} className="bg-white/5 rounded-xl p-3 text-center">
                      <div className={`text-xl font-bold text-white ${s.cls || ""}`}>{s.v}</div>
                      <div className="text-xs text-gray-400 mt-1">{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-primary font-semibold text-sm uppercase tracking-wider">Stories</span>
            <h2 className="section-heading mt-2">What our users say</h2>
          </div>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            {testimonials.map((t) => (
              <div key={t.id} className="card-hover">
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3 border-t border-gray-100 pt-4">
                  <div className="w-10 h-10 bg-primary/10 text-primary rounded-full flex items-center justify-center font-bold text-sm">{t.avatar}</div>
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

      {/* ── FINAL CTA ── */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="section-heading">
            Ready to start your <span className="text-primary">homeownership journey?</span>
          </h2>
          <p className="section-sub max-w-xl mx-auto">
            Join 8,500+ Kenyans who are renting smarter and building toward owning their homes.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Link to="/register" className="btn-primary !px-8 !py-4 text-base">
              Create Free Account <ChevronRight className="w-5 h-5 inline ml-2" />
            </Link>
            <Link to="/properties" className="btn-secondary !px-8 !py-4 text-base">Browse Properties</Link>
          </div>
          <p className="text-sm text-gray-400 mt-5">No credit card required. Free forever for tenants.</p>
        </div>
      </section>
    </div>
  );
}
