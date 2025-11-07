import {
  Building2,
  LayoutDashboard,
  Users,
  Home,
  Megaphone,
  Settings,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
}

export function Sidebar() {
  
  const navItems: NavItem[] = [
    { path: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { path: "/requests", label: "Requests", icon: <Users className="w-5 h-5" /> },
    { path: "/hostels", label: "Hostels", icon: <Home className="w-5 h-5" /> },
    { path: "/hostel-allocation", label: "Hostel Allocation", icon: <Building2 className="w-5 h-5" /> },
    { path: "/announcements", label: "Announcements", icon: <Megaphone className="w-5 h-5" /> },
    { path: "/settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  const [mobileOpen, setMobileOpen] = useState(false);

  const [expanded, setExpanded] = useState(false);
  const toggleExpanded = () => setExpanded((s) => !s);

  useEffect(() => {
    const handler = () => setMobileOpen((v) => !v);

    if (typeof window !== "undefined" && typeof window.addEventListener === "function") {
      window.addEventListener("toggle-sidebar", handler as EventListener);
    }

    return () => {
      if (typeof window !== "undefined" && typeof window.removeEventListener === "function") {
        window.removeEventListener("toggle-sidebar", handler as EventListener);
      }
    };
  }, []);

  const closeMobile = () => setMobileOpen(false);

  return (
    <>
      {mobileOpen && (
        <>
          {/* overlay */}
          <div
            className="fixed inset-0 bg-black/40 z-40 md:hidden"
            onClick={closeMobile}
            aria-hidden="true"
          />

          {/* drawer */}
          <aside
            className="fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 shadow-lg md:hidden transform transition-transform duration-200"
            role="dialog"
            aria-modal="true"
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-blue-900 p-2 rounded-lg">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-sm font-semibold text-gray-900">Hostel Manager</h1>
                  <p className="text-xs text-gray-500">Leadership Program</p>
                </div>
              </div>

              <button
                onClick={closeMobile}
                aria-label="Close menu"
                className="p-2 rounded-md hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer nav */}
            <nav className="flex-1 p-4 overflow-auto">
              <ul className="space-y-1">
                {navItems.map((item) => (
                  <li key={item.path}>
                    <NavLink
                      to={item.path}
                      onClick={closeMobile}
                      className={({ isActive }) =>
                        `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                          isActive ? "bg-blue-50 text-blue-900" : "text-gray-700 hover:bg-gray-100"
                        }`
                      }
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>

            {/* Drawer Footer */}
            <div className="p-4 border-t border-gray-200">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-xs text-gray-600 mb-1">Need assistance?</p>
                <a href="#" className="text-sm text-blue-900 hover:text-blue-700">
                  Contact Support
                </a>
              </div>
            </div>
          </aside>
        </>
      )}

      <aside
        className={`hidden md:flex flex-col h-screen bg-white border-r border-gray-200 transition-all duration-200
          ${expanded ? "w-64" : "w-20"} lg:w-64`}
        aria-hidden={false}
      >
        <div className="p-4 border-b border-gray-200 flex items-center justify-center">
          <div className="bg-blue-900 p-2 rounded-lg">
            <Building2 className="w-6 h-6 text-white" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-auto">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors text-left ${
                      isActive ? "bg-blue-50 text-blue-900" : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  {item.icon}
                  <span className={`${expanded ? "inline" : "hidden"} lg:inline`}>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Collapse toggle — visible only on md, hidden on lg */}
        <div className="px-4">
          <div className="flex flex-col items-center">
            <button
              onClick={toggleExpanded}
              aria-label={expanded ? "Collapse sidebar" : "Expand sidebar"}
              className="mb-3 p-2 rounded-full hover:bg-gray-100 border border-transparent md:flex lg:hidden"
            >
              {expanded ? (
                <ChevronsLeft className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronsRight className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <div className={`p-4 border-t border-gray-200 ${expanded ? "block" : "hidden lg:block"}`}>
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <p className="text-xs text-gray-600 mb-1">Need assistance?</p>
            <a href="#" className="text-sm text-blue-900 hover:text-blue-700">
              Contact Support
            </a>
          </div>
        </div>
      </aside>
    </>
  );
}
