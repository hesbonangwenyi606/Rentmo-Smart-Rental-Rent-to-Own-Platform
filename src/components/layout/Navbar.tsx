"use client";

import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  Menu,
  X,
  ChevronDown,
  LogIn,
} from "lucide-react";
import { clsx } from "clsx";

const navLinks = [
  { label: "Properties", href: "/properties" },
  { label: "Rent-to-Own", href: "/rent-to-own" },
  { label: "Calculator", href: "/calculator" },
];

const dashboardLinks = [
  { label: "Tenant Dashboard", href: "/dashboard" },
  { label: "Landlord Dashboard", href: "/dashboard/landlord" },
  { label: "Admin Dashboard", href: "/dashboard/admin" },
];

export default function Navbar() {
  const [isOpen, setIsOpen]     = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { pathname } = useLocation();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isActive = (href: string) => pathname === href;

  // Scroll awareness
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsOpen(false);
    setDashOpen(false);
  }, [pathname]);

  // Close dashboard dropdown on outside click
  useEffect(() => {
    if (!dashOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDashOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [dashOpen]);

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

            {/* Dashboards dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDashOpen(!dashOpen)}
                className={clsx(
                  "flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  dashboardLinks.some((l) => isActive(l.href))
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-navy hover:bg-gray-50"
                )}
              >
                Dashboards
                <ChevronDown
                  className={clsx(
                    "w-3.5 h-3.5 transition-transform duration-200",
                    dashOpen && "rotate-180"
                  )}
                />
              </button>
              {dashOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 animate-scale-in">
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setDashOpen(false)}
                      className={clsx(
                        "flex items-center px-4 py-2.5 text-sm transition-colors mx-1 rounded-xl",
                        isActive(link.href)
                          ? "text-primary bg-primary/5 font-medium"
                          : "text-gray-600 hover:text-navy hover:bg-gray-50"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-2">
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
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                "flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "text-primary bg-primary/5"
                  : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="pt-1 border-t border-gray-100 mt-2">
            <p className="px-4 pt-2 pb-1 text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Dashboards
            </p>
            {dashboardLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className={clsx(
                  "flex items-center px-4 py-2.5 rounded-xl text-sm transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-primary/5 font-medium"
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
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
        </div>
      )}
    </header>
  );
}
