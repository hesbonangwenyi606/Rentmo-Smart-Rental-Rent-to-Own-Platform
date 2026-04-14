import { Link } from "react-router-dom";
import { Home, Mail, MapPin, Phone, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6 text-center md:text-left">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Start your homeownership journey today
            </h3>
            <p className="text-white/80 mt-1 text-sm sm:text-base">
              Join thousands of Kenyans renting smart with Rentmo.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
            <Link
              to="/register"
              className="bg-white text-primary font-semibold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors shadow-lg text-center"
            >
              Get Started Free
            </Link>
            <Link
              to="/properties"
              className="border-2 border-white/60 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors text-center"
            >
              Browse Homes
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Col 1 — Brand (full width on mobile) */}
          <div className="col-span-2 sm:col-span-3 lg:col-span-1">
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
          <div className="col-span-2 sm:col-span-1">
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <div className="space-y-3 text-sm">
              <a
                href="https://maps.google.com/?q=Jahazi+Building,154+James+Gichuru+Road,Nairobi"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-2 text-gray-400 hover:text-white transition-colors"
              >
                <MapPin className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>Jahazi Building, 154 James Gichuru Road.<br />Nairobi, Kenya.</span>
              </a>
              <a href="tel:+254757551875" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                +254 757 551 875
              </a>
              <a href="https://wa.me/254713898155" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <WhatsAppIcon className="w-4 h-4 text-green-400 shrink-0" />
                +254 713 898 155
              </a>
              <a href="mailto:info@rentmo.online" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                info@rentmo.online
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10 mt-10 sm:mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-500">
              © 2026 Rentmo Technologies Ltd. All rights reserved.
            </p>
            <p className="text-xs text-gray-600 mt-0.5">
              Rent Smart. Build Credit. Own Your Home.
            </p>
          </div>
          <div className="flex items-center gap-2">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 bg-white/10 hover:bg-primary rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
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
