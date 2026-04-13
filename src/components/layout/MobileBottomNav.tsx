import { Link, useLocation } from "react-router-dom";
import { Home, Building2, DollarSign, TrendingUp, MoreHorizontal } from "lucide-react";

const navItems = [
  { label: "Home", icon: Home, to: "/" },
  { label: "My Rentals", icon: Building2, to: "/dashboard" },
  { label: "Payments", icon: DollarSign, to: "/payments" },
  { label: "Rent Loan", icon: TrendingUp, to: "/loans" },
  { label: "More", icon: MoreHorizontal, to: "/properties" },
];

export default function MobileBottomNav() {
  const { pathname } = useLocation();

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200">
      <div className="flex">
        {navItems.map((item) => {
          const active =
            item.to === "/"
              ? pathname === "/"
              : pathname.startsWith(item.to);
          return (
            <Link
              key={item.label}
              to={item.to}
              className={`flex-1 flex flex-col items-center gap-0.5 py-2.5 transition-colors ${
                active ? "text-primary" : "text-gray-400 hover:text-gray-600"
              }`}
            >
              <item.icon className={`w-5 h-5 ${active ? "stroke-[2.5]" : ""}`} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
