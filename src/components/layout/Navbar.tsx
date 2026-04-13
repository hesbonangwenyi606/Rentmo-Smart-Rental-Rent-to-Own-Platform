"use client";

import { useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);
  const [dashOpen, setDashOpen] = useState(false);
  const { pathname } = useLocation();

  const isActive = (href: string) => pathname === href;

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
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
                  "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                  isActive(link.href)
                    ? "text-primary bg-primary/5"
                    : "text-gray-600 hover:text-navy hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}

            {/* Dashboards dropdown */}
            <div className="relative">
              <button
                onClick={() => setDashOpen(!dashOpen)}
                className="flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-navy hover:bg-gray-50 transition-colors"
              >
                Dashboards
                <ChevronDown
                  className={clsx(
                    "w-4 h-4 transition-transform",
                    dashOpen && "rotate-180"
                  )}
                />
              </button>
              {dashOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={() => setDashOpen(false)}
                      className={clsx(
                        "block px-4 py-2.5 text-sm transition-colors",
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
          <div className="hidden md:flex items-center gap-3">
            <Link to="/register" className="btn-primary !py-2 !px-5 text-sm">
              Sign Up
            </Link>
            <Link
              to="/login"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-600 hover:text-navy transition-colors"
            >
              <LogIn className="w-4 h-4" />
              Sign In
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-50"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 pb-4 pt-2 space-y-1 animate-fade-in">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              onClick={() => setIsOpen(false)}
              className={clsx(
                "block px-4 py-3 rounded-xl text-sm font-medium transition-colors",
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
                className="block px-4 py-2.5 rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="pt-2 flex flex-col gap-2 border-t border-gray-100 mt-2">
            <Link
              to="/register"
              className="btn-primary w-full text-center !py-2.5"
              onClick={() => setIsOpen(false)}
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="btn-secondary w-full text-center !py-2.5"
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
