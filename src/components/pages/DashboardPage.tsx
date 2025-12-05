import { Users, Home, MapPin, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
  useDashboardSummary,
  useGenderDistribution,
  useRecentUsers,
  useLatestAnnouncements,
} from "@/lib/api/dashboard";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

const COLORS = ["#1e3a8a", "#93c5fd", "#0ea5e9", "#6366f1"];

export function DashboardPage() {
  const {
    data: summary,
    isFetching: summaryFetching,
    error: summaryError,
  } = useDashboardSummary();

  const {
    data: genderData = [],
    isFetching: genderFetching,
    error: genderError,
  } = useGenderDistribution();

  const {
    data: recentUsers = [],
    isFetching: recentUsersFetching,
    error: recentUsersError,
  } = useRecentUsers();

  const {
    data: latestAnnouncements = [],
    isFetching: announcementsFetching,
    error: announcementsError,
  } = useLatestAnnouncements();

  const totalUsers = summary?.totalUsers ?? 0;
  const assignedUsers = summary?.assignedUsers ?? 0;
  const totalHostels = summary?.totalHostels ?? 0;
  const zonesCount = summary?.zonesCount ?? 0;
  const occupancyRate =
    summary && summary.totalUsers > 0
      ? Math.round((summary.assignedUsers / summary.totalUsers) * 100)
      : 0;

  const showGenderEmptyState = !genderFetching && genderData?.length === 0;
  const showRecentUsersEmptyState =
    !recentUsersFetching && recentUsers?.length === 0;
  const showAnnouncementsEmptyState =
    !announcementsFetching && latestAnnouncements?.length === 0;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back! Here's what's happening with your hostel management
          system.
        </p>
      </div>

      {/* Error states */}
      {summaryError && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="pt-6 text-red-600">
            Unable to load summary: {summaryError.message}
          </CardContent>
        </Card>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            title: "Total Users",
            icon: <Users className="w-5 h-5 text-blue-900" />,
            value: totalUsers,
            helper: `${assignedUsers} assigned to hostels`,
          },
          {
            title: "Total Hostels",
            icon: <Home className="w-5 h-5 text-blue-900" />,
            value: totalHostels,
            helper: "Across all zones",
          },
          {
            title: "Active Zones",
            icon: <MapPin className="w-5 h-5 text-blue-900" />,
            value: zonesCount,
            helper: "Active zones in the system",
          },
          {
            title: "Occupancy Rate",
            icon: <User className="w-5 h-5 text-blue-900" />,
            value: `${occupancyRate}%`,
            helper: "Users with hostel assignments",
          },
        ]?.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">
                {metric.title}
              </CardTitle>
              {metric.icon}
            </CardHeader>
            <CardContent>
              {summaryFetching ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-3 w-32" />
                </>
              ) : (
                <>
                  <div className="text-3xl text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <p className="text-xs text-gray-500">{metric.helper}</p>
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Gender Distribution Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            {genderFetching ? (
              <Skeleton className="h-48 w-full" />
            ) : genderError ? (
              <p className="text-sm text-red-600">
                Unable to load gender distribution: {genderError.message}
              </p>
            ) : showGenderEmptyState ? (
              <p className="text-sm text-gray-500">
                No gender data available yet.
              </p>
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={genderData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) =>
                      `${name}: ${(percent * 100).toFixed(0)}%`
                    }
                    outerRadius={70}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {genderData?.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS?.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        {/* Latest Announcements */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Latest Announcements</CardTitle>
          </CardHeader>
          <CardContent>
            {announcementsFetching ? (
              <div className="space-y-4">
                {[...Array(3)]?.map((_, index) => (
                  <div key={index} className="space-y-2">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-32" />
                  </div>
                ))}
              </div>
            ) : announcementsError ? (
              <p className="text-sm text-red-600">
                Unable to load announcements: {announcementsError.message}
              </p>
            ) : showAnnouncementsEmptyState ? (
              <p className="text-sm text-gray-500">
                No announcements have been posted yet.
              </p>
            ) : (
              <div className="space-y-4">
                {latestAnnouncements?.map((announcement) => (
                  <div
                    key={announcement.id}
                    className="pb-4 border-b border-gray-100 last:border-0 last:pb-0"
                  >
                    <h4 className="text-gray-900 mb-1">{announcement.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">
                      {announcement.message}
                    </p>
                    <p className="text-xs text-gray-500">
                      {new Date(announcement.createdAt).toLocaleDateString()} by{" "}
                      {announcement.createdBy}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Users</CardTitle>
        </CardHeader>
        <CardContent>
          {recentUsersFetching ? (
            <div className="space-y-2">
              {[...Array(5)]?.map((_, index) => (
                <Skeleton key={index} className="h-10 w-full" />
              ))}
            </div>
          ) : recentUsersError ? (
            <p className="text-sm text-red-600">
              Unable to load recent users: {recentUsersError.message}
            </p>
          ) : showRecentUsersEmptyState ? (
            <p className="text-sm text-gray-500">
              No users have registered recently.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Fellowship</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Hostel Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentUsers?.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="text-gray-900">{user.name}</TableCell>
                    <TableCell>{user.gender}</TableCell>
                    <TableCell>{user.zone}</TableCell>
                    <TableCell>{user.fellowship}</TableCell>
                    <TableCell className="text-gray-600">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      {user.hostelAssigned ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                          Assigned
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                          Pending
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
