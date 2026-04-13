import { Link } from "react-router-dom";
import { Home, Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

const footerLinks = {
  Platform: [
    { label: "Browse Properties", href: "/properties" },
    { label: "Rent-to-Own", href: "/rent-to-own" },
    { label: "Calculator", href: "/calculator" },
    { label: "Rentmo Cover", href: "/insurance" },
    { label: "Rent Loans", href: "/loans" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "How It Works", href: "#" },
    { label: "Blog", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Press", href: "#" },
  ],
  Support: [
    { label: "Help Center", href: "#" },
    { label: "Contact Us", href: "#" },
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-navy text-gray-300">
      {/* CTA Banner */}
      <div className="bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-bold text-white">
              Start your homeownership journey today
            </h3>
            <p className="text-white/80 mt-1">
              Join thousands of Kenyans renting smart with Rentmo.
            </p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link
              to="/register"
              className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              to="/properties"
              className="border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors"
            >
              Browse Homes
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Col 1 — Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-primary rounded-lg flex items-center justify-center">
                <Home className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-bold text-white">
                Rent<span className="text-primary">mo</span>
              </span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              Rentmo simplifies renting and helps Kenyans transition into
              homeownership through our innovative rent-to-own model. Build
              credit, access loans, and own your home.
            </p>
          </div>

          {/* Cols 2–4 — Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((link) =>
                  link.href === "#" ? (
                    <li key={link.label}>
                      <span className="text-sm text-gray-400 cursor-default">
                        {link.label}
                      </span>
                    </li>
                  ) : (
                    <li key={link.label}>
                      <Link
                        to={link.href}
                        className="text-sm text-gray-400 hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                )}
              </ul>
            </div>
          ))}

          {/* Col 5 — Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <div className="flex items-start gap-2 text-gray-400">
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Jahazi Building, 154 James Gichuru Road.<br />Nairobi, Kenya.</span>
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                +254 757 551 875
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                +254 713 898 155
              </div>
              <div className="flex items-center gap-2 text-gray-400">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                info@rentmo.online
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © 2026 Rentmo Technologies Ltd. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-primary rounded-lg flex items-center justify-center transition-colors"
              >
                <Icon className="w-4 h-4 text-white" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
