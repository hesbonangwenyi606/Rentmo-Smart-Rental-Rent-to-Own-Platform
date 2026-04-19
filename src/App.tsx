import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
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

function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: ReactNode;
  allowedRoles?: Array<"TENANT" | "LANDLORD" | "ADMIN">;
}) {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    if (user.role === "ADMIN") return <Navigate to="/dashboard/admin" replace />;
    if (user.role === "LANDLORD") return <Navigate to="/dashboard/landlord" replace />;
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

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
          <Route path="/properties" element={<PropertiesPage />} />
          <Route path="/properties/:id" element={<PropertyDetailPage />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/rent-to-own" element={<RentToOwnPage />} />
          <Route
            path="/dashboard"
            element={<ProtectedRoute><TenantDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/landlord"
            element={<ProtectedRoute allowedRoles={["LANDLORD", "ADMIN"]}><LandlordDashboard /></ProtectedRoute>}
          />
          <Route
            path="/dashboard/admin"
            element={<ProtectedRoute allowedRoles={["ADMIN"]}><AdminDashboard /></ProtectedRoute>}
          />
          <Route
            path="/payments"
            element={<ProtectedRoute><PaymentsPage /></ProtectedRoute>}
          />
          <Route
            path="/loans"
            element={<ProtectedRoute><LoansPage /></ProtectedRoute>}
          />
          <Route
            path="/credit-score"
            element={<ProtectedRoute><CreditScorePage /></ProtectedRoute>}
          />
          <Route
            path="/insurance"
            element={<ProtectedRoute><InsurancePage /></ProtectedRoute>}
          />
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
