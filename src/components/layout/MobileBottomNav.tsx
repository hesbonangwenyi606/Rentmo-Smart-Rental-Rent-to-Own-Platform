import { Link, useLocation } from "react-router-dom";
import { Home, Building2, DollarSign, TrendingUp, Grid2X2 } from "lucide-react";

const navItems = [
  { label: "Home",     icon: Home,        to: "/" },
  { label: "Rentals",  icon: Building2,   to: "/dashboard" },
  { label: "Pay",      icon: DollarSign,  to: "/payments" },
  { label: "Loans",    icon: TrendingUp,  to: "/loans" },
  { label: "Explore",  icon: Grid2X2,     to: "/properties" },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]"
         style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
      <div className="flex items-stretch">
        {navItems.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-colors relative"
            >
              {/* Active pill indicator */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary" />
              )}
              <item.icon
                className={`w-5 h-5 transition-all duration-200 ${
                  active ? "text-primary stroke-[2.5]" : "text-gray-400"
                }`}
              />
              <span
                className={`text-[10px] font-medium transition-colors ${
                  active ? "text-primary" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
