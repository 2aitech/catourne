import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "./lib/auth-context";
import { Navbar } from "./components/navbar";
import { Footer } from "./components/footer";
import { LoadingSpinner } from "./components/ui";
import { HomePage } from "./pages/homepage";
import { LoginPage } from "./pages/login";
import { RegisterPage } from "./pages/register";
import { OffersPage } from "./pages/offers";
import { OfferDetailPage } from "./pages/offer-detail";
import { PerformerProfilePage } from "./pages/performer-profile";
import { PerformerApplicationsPage } from "./pages/performer-applications";
import { RecruiterDashboardPage } from "./pages/recruiter-dashboard";
import { RecruiterOfferFormPage } from "./pages/recruiter-offer-form";
import { RecruiterApplicationsPage } from "./pages/recruiter-applications";
import { AdminReportsPage } from "./pages/admin-reports";
import { TalentsPage } from "./pages/talents";
import { RecruteursPage } from "./pages/recruteurs";
import { AboutPage } from "./pages/about";
import { AidePage } from "./pages/aide";
import type { ReactNode } from "react";
import type { Role } from "./lib/types";

function RequireRole({ role, children }: { role: Role; children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== role) {
    return (
      <div className="max-w-md mx-auto mt-24 text-center">
        <h2 className="font-display text-xl font-bold text-cream-100 mb-2">Acces refuse</h2>
        <p className="text-cream-500 text-sm">Cette page est reservee au role <strong className="text-gold-400">{role}</strong>.</p>
      </div>
    );
  }
  return <>{children}</>;
}

function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

export function App() {
  const { loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/offers/:id" element={<OfferDetailPage />} />
          <Route path="/talents" element={<TalentsPage />} />
          <Route path="/recruteurs" element={<RecruteursPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/aide" element={<AidePage />} />

          <Route
            path="/performer/profile"
            element={
              <RequireRole role="performer">
                <PerformerProfilePage />
              </RequireRole>
            }
          />
          <Route
            path="/performer/applications"
            element={
              <RequireRole role="performer">
                <PerformerApplicationsPage />
              </RequireRole>
            }
          />

          <Route
            path="/recruiter/dashboard"
            element={
              <RequireRole role="recruiter">
                <RecruiterDashboardPage />
              </RequireRole>
            }
          />
          <Route
            path="/recruiter/offers/new"
            element={
              <RequireRole role="recruiter">
                <RecruiterOfferFormPage />
              </RequireRole>
            }
          />
          <Route
            path="/recruiter/offers/:offerId/applications"
            element={
              <RequireRole role="recruiter">
                <RecruiterApplicationsPage />
              </RequireRole>
            }
          />

          <Route
            path="/admin/reports"
            element={
              <RequireRole role="admin">
                <AdminReportsPage />
              </RequireRole>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
