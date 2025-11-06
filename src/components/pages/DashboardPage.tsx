import { Users, Home, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Badge } from "../ui/badge";
import { mockUsers, mockAnnouncements } from "../../lib/mockData";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

export function DashboardPage() {
  const totalUsers = mockUsers.length;
  const assignedUsers = mockUsers.filter((u) => u.hostelAssigned).length;
  const totalHostels = 6;
  const zonesCount = 6;

  const genderData = [
    { name: "Male", value: mockUsers.filter((u) => u.gender === "Male").length },
    { name: "Female", value: mockUsers.filter((u) => u.gender === "Female").length },
  ];

  const COLORS = ["#1e3a8a", "#93c5fd"];

  const recentUsers = mockUsers.slice(0, 5);
  const latestAnnouncements = mockAnnouncements.slice(0, 3);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome back! Here's what's happening with your hostel management system.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Total Users</CardTitle>
            <Users className="w-5 h-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900 mb-1">{totalUsers}</div>
            <p className="text-xs text-gray-500">{assignedUsers} assigned to hostels</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Total Hostels</CardTitle>
            <Home className="w-5 h-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900 mb-1">{totalHostels}</div>
            <p className="text-xs text-gray-500">Across all zones</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Active Zones</CardTitle>
            <MapPin className="w-5 h-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900 mb-1">{zonesCount}</div>
            <p className="text-xs text-gray-500">500 max capacity each</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm text-gray-600">Occupancy Rate</CardTitle>
            <User className="w-5 h-5 text-blue-900" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl text-gray-900 mb-1">
              {Math.round((assignedUsers / totalUsers) * 100)}%
            </div>
            <p className="text-xs text-gray-500">Users with hostel assignments</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gender Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={genderData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {genderData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Latest Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Latest Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {latestAnnouncements.map((announcement) => (
                <div key={announcement.id} className="pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                  <h4 className="text-gray-900 mb-1">{announcement.title}</h4>
                  <p className="text-sm text-gray-600 mb-2">{announcement.message}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString()} by {announcement.createdBy}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Hostel Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-gray-900">{user.name}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.state}</TableCell>
                  <TableCell>{user.zone}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    {user.hostelAssigned ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                        Assigned
                      </Badge>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        Pending
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
