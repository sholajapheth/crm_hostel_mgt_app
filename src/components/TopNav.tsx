// src/components/TopNav.tsx
import React from "react";
import { LogOut, Bell, Menu } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { useAuth } from "@/lib/hooks/useAuth";

export function TopNav() {
  const { logout, user } = useAuth();
  const emitToggle = () => {
    // dispatch a custom event the sidebar listens to
    try {
      const ev = new CustomEvent("toggle-sidebar");
      window.dispatchEvent(ev);
    } catch (err) {
      // defensive: if window unavailable or CustomEvent blocked, ignore
      // console.warn("Unable to dispatch toggle-sidebar event", err);
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={emitToggle}
            className="p-2 rounded-md inline-flex items-center justify-center border border-gray-200 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="bg-blue-900 p-2 rounded-lg md:hidden">
              <svg
                className="w-6 h-6 text-white"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden
              >
                <path
                  d="M4 21V7a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 21V12h6v9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 7h8"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>

            <div className="hidden md:block">
              <h2 className="text-gray-900 text-lg">Admin Dashboard</h2>
              <p className="text-sm text-gray-500">
                Manage your hostel system efficiently
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200 hidden sm:flex">
            <div className="text-right">
              <p className="text-sm text-gray-900">
                {user?.name || "Admin User"}
              </p>
              <p className="text-xs text-gray-500">
                {user?.email || "admin@hostel.com"}
              </p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-blue-900 text-white">
                {user?.name
                  ?.split(" ")
                  ?.map((n) => n[0])
                  .join("")
                  .toUpperCase() || "AU"}
              </AvatarFallback>
            </Avatar>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={logout}
            className="gap-2"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </Button>
        </div>
      </div>
    </header>
  );
}
