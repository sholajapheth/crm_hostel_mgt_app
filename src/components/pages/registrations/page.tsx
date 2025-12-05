import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, Search, Filter, Trash2 } from "lucide-react";
import { httpClient } from "@/lib/api/programs/httpClient";
import { toast } from "sonner";

interface Registration {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  anonymous: boolean;
  createdAt: string;
  program: {
    id: number;
    name: string;
    location: string;
    for: string;
  };
  hotel: {
    name: string;
    location: string;
  } | null;
}

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("CRM");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, typeFilter]);

  useEffect(() => {
    fetchRegistrations();
  }, [currentPage, search, typeFilter]);

  async function fetchRegistrations() {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.append("limit", itemsPerPage.toString());
      params.append("offset", ((currentPage - 1) * itemsPerPage).toString());

      const response = await httpClient.get<{
        data: Registration[];
        pagination: any;
      }>(
        `/api/v2/programs/admin/registrations/registrations/crm?${params.toString()}`
      );

      if (response.status === 200) {
        let allRegistrations = response.data.data || [];

        // Apply filters
        if (search) {
          allRegistrations = allRegistrations.filter(
            (reg) =>
              reg.name.toLowerCase().includes(search.toLowerCase()) ||
              reg.email.toLowerCase().includes(search.toLowerCase()) ||
              reg.program.name.toLowerCase().includes(search.toLowerCase())
          );
        }

        if (typeFilter && typeFilter !== "ALL") {
          allRegistrations = allRegistrations.filter(
            (reg) => reg.program.for === typeFilter
          );
        }

        setRegistrations(allRegistrations);
        setTotalItems(response.data.pagination?.total || 0);
      }
    } catch (error) {
      console.error("Failed to fetch registrations:", error);
      toast.error("Failed to load registrations");
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete(id: number) {
    setDeletingId(id);
    try {
      await httpClient.delete(
        `/api/v2/programs/admin/registrations/registrations/${id}`
      );
      setRegistrations(registrations.filter((r) => r.id !== id));
      toast.success("Registration deleted successfully");
    } catch (error) {
      console.error("Failed to delete registration:", error);
      toast.error("Failed to delete registration");
    } finally {
      setDeletingId(null);
    }
  }

  if (isLoading && registrations?.length === 0) {
    return (
      <div className="p-8">
        <div className="mb-8">
          <Skeleton className="h-8 w-48 mb-2" />
          <Skeleton className="h-4 w-64" />
        </div>
        <Card className="mb-6">
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-4">
          {[...Array(3)]?.map((_, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-64 mb-4" />
                <div className="grid gap-2 md:grid-cols-2">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Registrations</h1>
          <p className="text-gray-600">Manage all program registrations</p>
        </div>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or program..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>

            {/* <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by program type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Types</SelectItem>
                <SelectItem value="CRM">CRM</SelectItem>
                <SelectItem value="RCCG">RCCG</SelectItem>
                <SelectItem value="BOTH">BOTH</SelectItem>
              </SelectContent>
            </Select> */}
          </div>
        </CardContent>
      </Card>

      {/* Registrations List */}
      <div className="space-y-4">
        {registrations?.length === 0 ? (
          <Card>
            <CardContent className="py-10">
              <p className="text-center text-muted-foreground">
                No registrations found
              </p>
            </CardContent>
          </Card>
        ) : (
          registrations?.map((registration) => (
            <Card key={registration.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="space-y-3 flex-1">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {registration.anonymous
                          ? "Anonymous"
                          : registration.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {registration.email}
                        {registration.phone && ` • ${registration.phone}`}
                      </p>
                    </div>

                    <div className="grid gap-2 md:grid-cols-2">
                      <div>
                        <p className="text-xs text-muted-foreground">Program</p>
                        <p className="text-sm font-medium">
                          {registration.program.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {registration.program.location}
                        </p>
                      </div>

                      {registration.hotel && (
                        <div>
                          <p className="text-xs text-muted-foreground">Hotel</p>
                          <p className="text-sm font-medium">
                            {registration.hotel.name}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {registration.hotel.location}
                          </p>
                        </div>
                      )}

                      <div>
                        <p className="text-xs text-muted-foreground">
                          Registered
                        </p>
                        <p className="text-sm font-medium">
                          {new Date(
                            registration.createdAt
                          ).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2 ml-4">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                        registration.program.for === "CRM"
                          ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                          : registration.program.for === "RCCG"
                          ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                          : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                      }`}
                    >
                      {registration.program.for}
                    </span>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          disabled={deletingId === registration.id}
                        >
                          {deletingId === registration.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <>
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </>
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Delete Registration
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this registration?
                            This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(registration.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {!isLoading && registrations?.length > 0 && totalItems > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            registrations
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage * itemsPerPage >= totalItems}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
