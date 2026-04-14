import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import MobileBottomNav from "@/components/layout/MobileBottomNav";
import ScrollToTop from "@/components/ScrollToTop";
import LandingPage from "@/app/page";
import LoginPage from "@/app/login/page";
import RegisterPage from "@/app/register/page";
import TenantDashboard from "@/app/dashboard/page";
import LandlordDashboard from "@/app/dashboard/landlord/page";
import AdminDashboard from "@/app/dashboard/admin/page";
import PropertiesPage from "@/app/properties/page";
import PropertyDetailPage from "@/app/properties/[id]/page";
import PaymentsPage from "@/app/payments/page";
import RentToOwnPage from "@/app/rent-to-own/page";
import CalculatorPage from "@/app/calculator/page";
import LoansPage from "@/app/loans/page";
import CreditScorePage from "@/app/credit-score/page";
import InsurancePage from "@/app/insurance/page";

const AUTH_ROUTES = ["/login", "/register"];

function AppContent() {
  const { pathname } = useLocation();
  const isAuth = AUTH_ROUTES.includes(pathname);

  return (
    <div className="min-h-screen flex flex-col">
      {!isAuth && <Navbar />}
      <main key={pathname} className="flex-1 page-enter">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<TenantDashboard />} />
          <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/rent-to-own" element={<RentToOwnPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/loans" element={<LoansPage />} />
          <Route path="/credit-score" element={<CreditScorePage />} />
          <Route path="/insurance" element={<InsurancePage />} />
        </Routes>
      </main>
      {!isAuth && <Footer />}
      {!isAuth && <MobileBottomNav />}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
