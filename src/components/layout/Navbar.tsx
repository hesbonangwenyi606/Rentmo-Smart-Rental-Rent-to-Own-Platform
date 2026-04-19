import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Home, Menu, X, LogIn, LogOut, LayoutDashboard, ChevronDown, User } from "lucide-react";
import { clsx } from "clsx";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Properties", href: "/properties" },
  { label: "Rent-to-Own", href: "/rent-to-own" },
  { label: "Calculator", href: "/calculator" },
];

function getDashboardLink(role?: string) {
  if (role === "ADMIN") return { label: "Admin Dashboard", href: "/dashboard/admin" };
  if (role === "LANDLORD") return { label: "Landlord Dashboard", href: "/dashboard/landlord" };
  return { label: "My Dashboard", href: "/dashboard" };
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const userMenuRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    setUserMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = (e: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenuOpen]);

  const dashLink = getDashboardLink(user?.role);

  const handleLogout = () => {
    logout();
    setUserMenuOpen(false);
    navigate("/");
  };

  return (
    <header
      className={clsx(
        "sticky top-0 z-50 transition-all duration-300",
        scrolled
          ? "bg-white shadow-md border-b border-gray-100"
          : "bg-white/95 backdrop-blur-sm border-b border-gray-100"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group shrink-0">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Home className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-bold text-navy">
              Rent<span className="text-primary">mo</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={clsx(
                  "relative px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-navy hover:bg-gray-50"
                )}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-primary" />
                )}
              </Link>
            ))}

            {isAuthenticated && (
              <Link
                to={dashLink.href}
                className={clsx(
                  "flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(dashLink.href)
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-navy hover:bg-gray-50"
                )}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                {dashLink.label}
              </Link>
            )}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-3.5 h-3.5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-navy max-w-[120px] truncate">
                    {user?.name?.split(" ")[0]}
                  </span>
                  <ChevronDown className={clsx("w-3.5 h-3.5 text-gray-400 transition-transform", userMenuOpen && "rotate-180")} />
                </button>

                {userMenuOpen && (
                  <div className="absolute top-full right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-100 mb-1">
                      <p className="text-sm font-semibold text-navy truncate">{user?.name}</p>
                      <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                      <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary capitalize">
                        {user?.role?.toLowerCase()}
                      </span>
                    </div>
                    <Link
                      to={dashLink.href}
                      className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors mx-1 rounded-xl"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {dashLink.label}
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors mx-1 rounded-xl mt-1"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy transition-colors rounded-lg hover:bg-gray-50"
                >
                  <LogIn className="w-4 h-4" />
                  Sign In
                </Link>
                <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">
                  Sign Up Free
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-xl text-gray-500 hover:bg-gray-100 transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-5 pt-3 space-y-1 animate-fade-in shadow-lg">
          {isAuthenticated && (
            <div className="flex items-center gap-3 px-4 py-3 mb-2 bg-gray-50 rounded-xl">
              <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <User className="w-4 h-4 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-navy truncate">{user?.name}</p>
                <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>
          )}

          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive(link.href) ? "text-primary bg-primary/5" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {link.label}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              <Link
                to={dashLink.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive(dashLink.href) ? "text-primary bg-primary/5" : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <LayoutDashboard className="w-4 h-4" />
                {dashLink.label}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-1"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </>
          ) : (
            <div className="pt-2 flex flex-col gap-2 border-t border-gray-100 mt-2">
              <Link
                to="/register"
                className="btn-primary w-full text-center !py-3"
                onClick={() => setIsOpen(false)}
              >
                Sign Up Free
              </Link>
              <Link
                to="/login"
                className="btn-secondary w-full text-center !py-3"
                onClick={() => setIsOpen(false)}
              >
                Sign In
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
