import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Rentmo – Smart Rental & Rent-to-Own Platform",
  description:
    "Find your perfect home in Nairobi. Rent or own — your journey starts here. Build credit, access rent loans, and transition into homeownership.",
  keywords: "rent, rental, rent-to-own, Nairobi, Kenya, property, apartments",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
