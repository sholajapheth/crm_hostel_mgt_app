import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { TopNav } from "./TopNav";
import { DashboardPage } from "./pages/DashboardPage";
import { UsersPage } from "./pages/UsersPage";
import { HostelAllocationPage } from "./pages/HostelAllocationPage";
import { AnnouncementsPage } from "./pages/AnnouncementsPage";
import { SettingsPage } from "./pages/SettingsPage";

export type PageType = "dashboard" | "users" | "hostel-allocation" | "announcements" | "settings";

export function DashboardLayout() {
  const [currentPage, setCurrentPage] = useState<PageType>("dashboard");

  const renderPage = () => {
    switch (currentPage) {
      case "dashboard":
        return <DashboardPage />;
      case "users":
        return <UsersPage />;
      case "hostel-allocation":
        return <HostelAllocationPage />;
      case "announcements":
        return <AnnouncementsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav />
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
