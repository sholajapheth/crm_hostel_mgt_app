import { Building2, LayoutDashboard, Users, Home, Megaphone, Settings } from "lucide-react";
import { PageType } from "./DashboardLayout";

interface SidebarProps {
  currentPage: PageType;
  onNavigate: (page: PageType) => void;
}

interface NavItem {
  id: PageType;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar({ currentPage, onNavigate }: SidebarProps) {
  const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { id: "users", label: "Users", icon: <Users className="w-5 h-5" /> },
    { id: "hostel-allocation", label: "Hostel Allocation", icon: <Home className="w-5 h-5" /> },
    { id: "announcements", label: "Announcements", icon: <Megaphone className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="bg-blue-900 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-gray-900">Hostel Manager</h1>
            <p className="text-xs text-gray-500">Leadership Program</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.id}>
              <button
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  currentPage === item.id
                    ? "bg-blue-50 text-blue-900"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 mb-1">Need assistance?</p>
          <a href="#" className="text-sm text-blue-900 hover:text-blue-700">
            Contact Support
          </a>
        </div>
      </div>
    </aside>
  );
}
