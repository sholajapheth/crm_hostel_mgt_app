import { useState, useEffect } from "react";
import { User, Lock, Shield, LogOut } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { toast } from "sonner";
import { useAuth } from "@/lib/hooks/useAuth";

export function SettingsPage() {
  const { user, logout } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [maxUsersPerZone, setMaxUsersPerZone] = useState("500");

  const handleUpdateProfile = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Please fill in all fields");
      return;
    }
    toast.success("Profile updated successfully");
  };

  const handleUpdatePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }
    if (newPassword?.length < 8) {
      toast.error("Password must be at least 8 characters");
      return;
    }
    toast.success("Password updated successfully");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleUpdateSystemConfig = () => {
    const maxUsers = parseInt(maxUsersPerZone);
    if (isNaN(maxUsers) || maxUsers < 1) {
      toast.error("Please enter a valid number");
      return;
    }
    toast.success("System configuration updated successfully");
  };

  return (
    <div className="p-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Settings</h1>
        <p className="text-gray-600">
          Manage your account and system preferences
        </p>
      </div>

      {/* Admin Profile */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Admin Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleUpdateProfile}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Update Profile
          </Button>
        </CardContent>
      </Card>

      {/* Password Update */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5" />
            Change Password
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="current-password">Current Password</Label>
            <Input
              id="current-password"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password">Confirm New Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          </div>
          <Button
            onClick={handleUpdatePassword}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Update Password
          </Button>
        </CardContent>
      </Card>

      {/* System Configuration */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            System Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="max-users">Maximum Users Per Zone</Label>
            <Input
              id="max-users"
              type="number"
              value={maxUsersPerZone}
              onChange={(e) => setMaxUsersPerZone(e.target.value)}
            />
            <p className="text-sm text-gray-500">
              Set the maximum number of participants allowed per zone
            </p>
          </div>
          <Button
            onClick={handleUpdateSystemConfig}
            className="bg-blue-900 hover:bg-blue-800"
          >
            Save Configuration
          </Button>
        </CardContent>
      </Card>

      <Separator className="my-8" />

      {/* Logout Section */}
      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-900">
            <LogOut className="w-5 h-5" />
            Logout
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            You will be logged out of your admin account. Make sure to save any
            changes before logging out.
          </p>
          <Button onClick={logout} variant="destructive" className="gap-2">
            <LogOut className="w-4 h-4" />
            Logout from Admin Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
