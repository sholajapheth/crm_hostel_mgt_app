import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { LoginPage } from "./components/LoginPage";
import { DashboardLayoutWrapper } from "./components/layouts/DashboardLayoutWrapper";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { DashboardPage } from "./components/pages/DashboardPage";
import { UsersPage } from "./components/pages/UsersPage";
import { HostelAllocationPage } from "./components/pages/HostelAllocationPage";
import { AnnouncementsPage } from "./components/pages/AnnouncementsPage";
import { SettingsPage } from "./components/pages/SettingsPage";
import { Toaster } from "./components/ui/sonner";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function AppRoutes() {
  return (
    <Routes>
      {/* Public route */}
      <Route path="/" element={<LoginPage />} />

      {/* Protected routes */}
      <Route
        element={
          <ProtectedRoute>
            <DashboardLayoutWrapper />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/users" element={<UsersPage />} />
        <Route path="/hostel-allocation" element={<HostelAllocationPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Catch all - redirect to dashboard */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppRoutes />
        <Toaster />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
