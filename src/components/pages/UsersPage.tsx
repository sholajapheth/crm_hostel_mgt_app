import { useMemo, useState } from "react";
import { Search, Download } from "lucide-react";
import { Card, CardContent } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import { useApplicants, useDownloadApplicantsCsv } from "@/lib/api/adminUsers";
import type { ApplicantFilters } from "@/lib/api/adminUsers";
import { useZones } from "@/lib/api/zones";

const genderOptions = [
  { value: "all", label: "All Genders" },
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const nigerianStates = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

export function RequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState<string>("all");
  const [zoneId, setZoneId] = useState<number | undefined>(undefined);
  const [state, setState] = useState<string>("");

  const { data: zones = [] } = useZones();

  const filters: ApplicantFilters = useMemo(() => {
    const filter: ApplicantFilters = {};
    if (searchTerm.trim()) {
      filter.searchTerm = searchTerm.trim();
    }
    if (genderFilter !== "all") {
      filter.gender = genderFilter as "male" | "female";
    }
    if (zoneId !== undefined) {
      filter.zoneId = zoneId;
    }
    if (state.trim()) {
      filter.state = state.trim();
    }
    return filter;
  }, [searchTerm, genderFilter, zoneId, state]);

  const { data: applicants = [], isFetching, error } = useApplicants(filters);

  const downloadCsvMutation = useDownloadApplicantsCsv();

  const handleDownloadCSV = async () => {
    try {
      const blob = await downloadCsvMutation.mutateAsync();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "applicants.csv";
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error: any) {
      console.error("Failed to download CSV:", error);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Requests Management</h1>
          <p className="text-gray-600">
            View and manage members requesting hostel allocations
          </p>
        </div>
        <Button
          onClick={handleDownloadCSV}
          className="gap-2 bg-blue-900 hover:bg-blue-800"
          disabled={downloadCsvMutation.isPending}
        >
          <Download className="w-4 h-4" />
          {downloadCsvMutation.isPending ? "Downloading..." : "Download CSV"}
        </Button>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                {genderOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Zone Filter */}
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

            {/* State Filter */}
            <Select
              value={state || "all"}
              onValueChange={(value: string) =>
                setState(value === "all" ? "" : value)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by state" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All States</SelectItem>
                {nigerianStates.map((stateName) => (
                  <SelectItem key={stateName} value={stateName}>
                    {stateName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center text-sm text-gray-600">
              Showing {applicants.length} request
              {applicants.length !== 1 ? "s" : ""}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Applicants Table */}
      <Card>
        <CardContent className="pt-6">
          {error ? (
            <p className="text-sm text-red-600">
              Unable to load requests: {error.message}
            </p>
          ) : isFetching && applicants.length === 0 ? (
            <div className="space-y-2">
              {[...Array(5)].map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Zone</TableHead>
                  <TableHead>Fellowship</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead>Hostel Assignment</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicants.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell className="text-gray-900 font-medium">
                      {applicant.name}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className="bg-blue-50 text-blue-800 hover:bg-blue-50"
                      >
                        {applicant.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-600">
                      {applicant.email}
                    </TableCell>
                    <TableCell>{applicant.zone || "—"}</TableCell>
                    <TableCell>{applicant.fellowship || "—"}</TableCell>
                    <TableCell>{applicant.state || "—"}</TableCell>
                    <TableCell>
                      {applicant.hostelAssigned ? (
                        <Badge className="bg-green-50 text-green-800 hover:bg-green-50">
                          {applicant.hostelName || "Assigned"}
                        </Badge>
                      ) : (
                        <Badge
                          variant="secondary"
                          className="bg-gray-50 text-gray-600 hover:bg-gray-50"
                        >
                          Unassigned
                        </Badge>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {applicants.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={7}
                      className="text-center py-8 text-gray-500"
                    >
                      No requests found for the selected filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
