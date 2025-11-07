import { useMemo, useState } from "react";
import { UserCheck, Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Checkbox } from "../ui/checkbox";
import { Progress } from "../ui/progress";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useApplicants } from "@/lib/api/adminUsers";
import { useHostels, useManualAssignHostel } from "@/lib/api/hostels";
import { useZones } from "@/lib/api/zones";
import type { ApplicantFilters } from "@/lib/api/adminUsers";
import { toast } from "sonner";

export function HostelAllocationPage() {
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [zoneId, setZoneId] = useState<number | undefined>(undefined);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [selectedHostel, setSelectedHostel] = useState<number | undefined>(undefined);

  const { data: zones = [] } = useZones();
  const { data: hostels = [], isFetching: hostelsFetching } = useHostels();

  // Filter for unassigned users
  const userFilters: ApplicantFilters = useMemo(() => {
    const filter: ApplicantFilters = {};
    if (genderFilter !== "all") {
      filter.gender = genderFilter as "male" | "female";
    }
    if (zoneId !== undefined) {
      filter.zoneId = zoneId;
    }
    return filter;
  }, [genderFilter, zoneId]);

  const {
    data: allApplicants = [],
    isFetching: applicantsFetching,
  } = useApplicants(userFilters);

  const manualAssignMutation = useManualAssignHostel();

  // Filter for unassigned users (client-side since API doesn't filter by hostelAssigned)
  const unassignedUsers = useMemo(() => {
    return allApplicants.filter((user) => !user.hostelAssigned);
  }, [allApplicants]);

  // Filter hostels by gender and zone
  const filteredHostels = useMemo(() => {
    return hostels.filter((hostel) => {
      const matchesGender =
        genderFilter === "all" ||
        hostel.gender.toLowerCase() === genderFilter.toLowerCase() ||
        hostel.gender === "all";
      // Note: Hostels don't have zone info in the API, so we skip zone filtering for hostels
      return matchesGender;
    });
  }, [hostels, genderFilter]);

  const handleUserToggle = (userId: number) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  const handleAssignHostel = async () => {
    if (selectedUsers.length === 0) {
      toast.error("Please select at least one user");
      return;
    }
    if (!selectedHostel) {
      toast.error("Please select a hostel");
      return;
    }

    const hostel = hostels.find((h) => h.id === selectedHostel);
    if (hostel) {
      const availableSpace = hostel.remainingCapacity;
      if (selectedUsers.length > availableSpace) {
        toast.error(`Not enough space. Only ${availableSpace} spots available.`);
        return;
      }
    }

    try {
      await manualAssignMutation.mutateAsync({
        memberIds: selectedUsers,
        hostelId: selectedHostel,
      });
      toast.success(
        `Successfully assigned ${selectedUsers.length} user(s) to ${hostel?.name}`
      );
      setSelectedUsers([]);
      setSelectedHostel(undefined);
    } catch (error: any) {
      toast.error(error.message || "Failed to assign users to hostel");
    }
  };

  // Calculate zone capacity from applicants data
  const getZoneCapacity = (zoneName: string) => {
    const zoneUsers = allApplicants.filter((u) => u.zone === zoneName).length;
    return { used: zoneUsers, max: 500 };
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl text-gray-900 mb-2">Hostel Allocation</h1>
        <p className="text-gray-600">Assign participants to available hostels</p>
      </div>

      {/* Zone Capacity Overview */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Zone Capacity Overview</CardTitle>
        </CardHeader>
        <CardContent>
          {applicantsFetching ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[...Array(3)].map((_, idx) => (
                <Skeleton key={idx} className="h-20 w-full" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {zones.map((zone) => {
                const capacity = getZoneCapacity(zone.name);
                const percentage = (capacity.used / capacity.max) * 100;
                return (
                  <div key={zone.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-900">{zone.name}</span>
                      <span className="text-xs text-gray-600">
                        {capacity.used}/{capacity.max}
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                    <p className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}% filled</p>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

            <Select
              value={zoneId?.toString() || "all"}
              onValueChange={(value: string) =>
                setZoneId(value === "all" ? undefined : parseInt(value, 10))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by zone" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Zones</SelectItem>
                {zones.map((zone) => (
                  <SelectItem key={zone.id} value={zone.id.toString()}>
                    {zone.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Unassigned Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="w-5 h-5" />
              Unassigned Users ({unassignedUsers.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {applicantsFetching ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, idx) => (
                  <Skeleton key={idx} className="h-16 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {unassignedUsers.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No unassigned users matching filters
                  </p>
                ) : (
                  unassignedUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <Checkbox
                        checked={selectedUsers.includes(user.id)}
                        onCheckedChange={() => handleUserToggle(user.id)}
                      />
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-600">
                          {user.gender} • {user.zone || "—"} • {user.state || "—"}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
            {selectedUsers.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-900">
                  {selectedUsers.length} user(s) selected
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Available Hostels */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Available Hostels ({filteredHostels.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {hostelsFetching ? (
              <div className="space-y-3 mb-4">
                {[...Array(3)].map((_, idx) => (
                  <Skeleton key={idx} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto mb-4">
                {filteredHostels.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No hostels matching filters
                  </p>
                ) : (
                  filteredHostels.map((hostel) => {
                    const available = hostel.remainingCapacity;
                    const occupied = hostel.capacity - hostel.remainingCapacity;
                    const percentage = hostel.capacity > 0 ? (occupied / hostel.capacity) * 100 : 0;
                    return (
                      <div
                        key={hostel.id}
                        onClick={() => setSelectedHostel(hostel.id)}
                        className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          selectedHostel === hostel.id
                            ? "border-blue-900 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-gray-900">{hostel.name}</h4>
                          <Badge variant="outline">
                            {available} spots left
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {hostel.gender} • {hostel.location}
                        </p>
                        <Progress value={percentage} className="h-2 mb-1" />
                        <p className="text-xs text-gray-500">
                          {occupied}/{hostel.capacity} occupied ({percentage.toFixed(0)}%)
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            )}
            <Button
              onClick={handleAssignHostel}
              className="w-full bg-blue-900 hover:bg-blue-800"
              disabled={
                selectedUsers.length === 0 ||
                !selectedHostel ||
                manualAssignMutation.isPending
              }
            >
              {manualAssignMutation.isPending
                ? "Assigning..."
                : "Assign Selected Users to Hostel"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
