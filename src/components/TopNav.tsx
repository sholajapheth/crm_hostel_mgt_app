import { LogOut, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback } from "./ui/avatar";

interface TopNavProps {
  onLogout: () => void;
}

export function TopNav({ onLogout }: TopNavProps) {
  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900 text-lg">Admin Dashboard</h2>
          <p className="text-sm text-gray-500">Manage your hostel system efficiently</p>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <button className="relative p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Admin Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="text-right">
              <p className="text-sm text-gray-900">Admin User</p>
              <p className="text-xs text-gray-500">admin@hostel.com</p>
            </div>
            <Avatar>
              <AvatarFallback className="bg-blue-900 text-white">AU</AvatarFallback>
            </Avatar>
          </div>

          {/* Logout */}
          <Button
            variant="outline"
            size="sm"
            onClick={onLogout}
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
