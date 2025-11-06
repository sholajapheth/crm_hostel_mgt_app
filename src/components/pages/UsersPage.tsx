import { useState } from "react";
import { Search, Download } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Badge } from "../ui/badge";
import { mockUsers, zones, states } from "../../lib/mockData";

export function UsersPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [zoneFilter, setZoneFilter] = useState<string>("all");
  const [stateFilter, setStateFilter] = useState<string>("all");

  const filteredUsers = mockUsers.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = genderFilter === "all" || user.gender === genderFilter;
    const matchesZone = zoneFilter === "all" || user.zone === zoneFilter;
    const matchesState = stateFilter === "all" || user.state === stateFilter;
    
    return matchesSearch && matchesGender && matchesZone && matchesState;
  });

  const handleDownloadCSV = () => {
    const headers = ["Name", "Gender", "State", "Zone", "Fellowship", "Email", "Hostel Assigned", "Hostel Name"];
    const csvContent = [
      headers.join(","),
      ...filteredUsers.map((user) =>
        [
          user.name,
          user.gender,
          user.state,
          user.zone,
          user.fellowship,
          user.email,
          user.hostelAssigned ? "Yes" : "No",
          user.hostelName || "N/A",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Users Management</h1>
          <p className="text-gray-600">Manage all participants in the leadership program</p>
        </div>
        <Button onClick={handleDownloadCSV} className="gap-2 bg-blue-900 hover:bg-blue-800">
          <Download className="w-4 h-4" />
          Download CSV
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Gender Filter */}
            <Select value={genderFilter} onValueChange={setGenderFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Genders</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Female">Female</SelectItem>
              </SelectContent>
            </Select>

            {/* Zone Filter */}
            <Select value={zoneFilter} onValueChange={setZoneFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map((zone) => (
                  <SelectItem key={zone} value={zone}>
                    {zone}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* State Filter */}
            <Select value={stateFilter} onValueChange={setStateFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {states.map((state) => (
                  <SelectItem key={state} value={state}>
                    {state}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardContent className="pt-6">
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredUsers.length} of {mockUsers.length} users
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Gender</TableHead>
                <TableHead>State</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Fellowship</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Hostel Assigned</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="text-gray-900">{user.name}</TableCell>
                  <TableCell>{user.gender}</TableCell>
                  <TableCell>{user.state}</TableCell>
                  <TableCell>{user.zone}</TableCell>
                  <TableCell className="text-sm">{user.fellowship}</TableCell>
                  <TableCell className="text-gray-600">{user.email}</TableCell>
                  <TableCell>
                    {user.hostelAssigned ? (
                      <div>
                        <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100 mb-1">
                          Yes
                        </Badge>
                        <p className="text-xs text-gray-600">{user.hostelName}</p>
                      </div>
                    ) : (
                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                        No
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
