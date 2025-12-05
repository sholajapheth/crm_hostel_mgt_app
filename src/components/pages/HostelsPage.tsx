import { useEffect, useMemo, useState } from "react";
import { Home, RotateCcw, Trash2, CheckCircle2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";
import { Skeleton } from "../ui/skeleton";
import {
  useHostels,
  useCreateHostel,
  useUpdateHostel,
  useDeleteHostel,
  useAssignAllHostels,
} from "@/lib/api/hostels";
import type { Hostel, CreateHostelRequest } from "@/lib/api/hostels";
import { toast } from "sonner";

const genderOptions = [
  { label: "Male", value: "MALE" },
  { label: "Female", value: "FEMALE" },
];

const defaultForm: CreateHostelRequest = {
  name: "",
  location: "",
  capacity: 0,
  remainingCapacity: 0,
  gender: "MALE",
};

export function HostelsPage() {
  const [formState, setFormState] = useState<CreateHostelRequest>(defaultForm);
  const [editingHostel, setEditingHostel] = useState<Hostel | null>(null);

  const { data: hostels = [], isFetching, error } = useHostels();

  const createMutation = useCreateHostel();
  const updateMutation = useUpdateHostel();
  const deleteMutation = useDeleteHostel();
  const assignAllMutation = useAssignAllHostels();

  useEffect(() => {
    if (editingHostel) {
      setFormState({
        name: editingHostel.name,
        location: editingHostel.location,
        capacity: editingHostel.capacity,
        remainingCapacity: editingHostel.remainingCapacity,
        gender: editingHostel.gender,
      });
    } else {
      setFormState(defaultForm);
    }
  }, [editingHostel]);

  const occupiedCount = useMemo(() => {
    return hostels.reduce(
      (acc, hostel) =>
        acc + (Number(hostel.capacity) - Number(hostel.remainingCapacity)),
      0
    );
  }, [hostels]);

  const totalCapacity = useMemo(() => {
    return hostels.reduce((acc, hostel) => acc + Number(hostel.capacity), 0);
  }, [hostels]);

  const occupancyRate =
    totalCapacity > 0 ? Math.round((occupiedCount / totalCapacity) * 100) : 0;

  const handleInputChange = (
    field: keyof CreateHostelRequest,
    value: string
  ) => {
    if (field === "capacity" || field === "remainingCapacity") {
      const numericValue = Number(value);
      setFormState((prev) => ({
        ...prev,
        [field]: Number.isNaN(numericValue) ? 0 : numericValue,
      }));
    } else {
      setFormState((prev) => ({ ...prev, [field]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formState.name.trim()) {
      toast.error("Hostel name is required");
      return;
    }

    if (!formState.location.trim()) {
      toast.error("Hostel location is required");
      return;
    }

    if (formState.capacity < 0) {
      toast.error("Capacity must be zero or greater");
      return;
    }

    if (
      formState.remainingCapacity < 0 ||
      formState.remainingCapacity > formState.capacity
    ) {
      toast.error("Remaining capacity must be between 0 and capacity");
      return;
    }

    try {
      if (editingHostel) {
        await updateMutation.mutateAsync({
          id: editingHostel.id,
          data: formState,
        });
        toast.success("Hostel updated successfully");
      } else {
        await createMutation.mutateAsync(formState);
        toast.success("Hostel created successfully");
      }
      setEditingHostel(null);
      setFormState(defaultForm);
    } catch (mutationError: any) {
      toast.error(mutationError.message || "Unable to save hostel");
    }
  };

  const handleEdit = (hostel: Hostel) => {
    setEditingHostel(hostel);
  };

  const handleDelete = async (hostel: Hostel) => {
    if (!confirm(`Delete ${hostel.name}?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(hostel.id);
      toast.success("Hostel deleted successfully");
    } catch (mutationError: any) {
      toast.error(mutationError.message || "Unable to delete hostel");
    }
  };

  const handleAssignAll = async () => {
    try {
      const result = await assignAllMutation.mutateAsync();
      toast.success(
        `${result.assignedCount} members assigned. ${result.unassignedCount} remaining unassigned.`
      );
    } catch (mutationError: any) {
      toast.error(mutationError.message || "Unable to assign members");
    }
  };

  return (
    <div className="p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Hostel Management</h1>
          <p className="text-gray-600">
            Manage the hostels available for allocations and monitor capacity
            usage.
          </p>
        </div>
        <Button
          onClick={handleAssignAll}
          disabled={assignAllMutation.isPending}
          className="bg-blue-900 hover:bg-blue-800 gap-2"
        >
          {assignAllMutation.isPending ? (
            <>
              <RotateCcw className="w-4 h-4 animate-spin" />
              Assigning...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              Assign All Members
            </>
          )}
        </Button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            title: "Total Hostels",
            value: hostels?.length,
            helper: "Active hostels in the system",
          },
          {
            title: "Total Capacity",
            value: totalCapacity,
            helper: "Combined bed spaces across hostels",
          },
          {
            title: "Occupancy Rate",
            value: `${occupancyRate}%`,
            helper: `${occupiedCount} occupants currently assigned`,
          },
        ]?.map((metric) => (
          <Card key={metric.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm text-gray-600">
                {metric.title}
              </CardTitle>
              <Home className="w-5 h-5 text-blue-900" />
            </CardHeader>
            <CardContent>
              {isFetching ? (
                <>
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-3 w-28" />
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

      {/* Hostel Form */}
      <Card>
        <CardHeader>
          <CardTitle>
            {editingHostel ? "Edit Hostel" : "Add New Hostel"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <div className="space-y-2">
              <label className="text-sm text-gray-600" htmlFor="name">
                Hostel Name
              </label>
              <Input
                id="name"
                value={formState.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g. Grace Hostel"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600" htmlFor="location">
                Location
              </label>
              <Input
                id="location"
                value={formState.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                placeholder="e.g. Zone 3"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600" htmlFor="capacity">
                Capacity
              </label>
              <Input
                id="capacity"
                type="number"
                value={formState.capacity}
                onChange={(e) => handleInputChange("capacity", e.target.value)}
                min={0}
              />
            </div>

            <div className="space-y-2">
              <label
                className="text-sm text-gray-600"
                htmlFor="remainingCapacity"
              >
                Remaining Capacity
              </label>
              <Input
                id="remainingCapacity"
                type="number"
                value={formState.remainingCapacity}
                onChange={(e) =>
                  handleInputChange("remainingCapacity", e.target.value)
                }
                min={0}
                max={formState.capacity}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm text-gray-600">Gender</label>
              <Select
                value={formState.gender}
                onValueChange={(value) => handleInputChange("gender", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  {genderOptions?.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-end gap-2">
              <Button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingHostel ? "Update Hostel" : "Create Hostel"}
              </Button>
              {editingHostel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditingHostel(null)}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Hostels Table */}
      <Card>
        <CardHeader>
          <CardTitle>Hostels</CardTitle>
        </CardHeader>
        <CardContent>
          {error ? (
            <p className="text-sm text-red-600">
              Unable to load hostels: {error.message}
            </p>
          ) : isFetching && hostels?.length === 0 ? (
            <div className="space-y-2">
              {[...Array(5)]?.map((_, idx) => (
                <Skeleton key={idx} className="h-10 w-full" />
              ))}
            </div>
          ) : hostels?.length === 0 ? (
            <p className="text-sm text-gray-500">
              No hostels have been created yet.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Remaining</TableHead>
                  <TableHead>Gender</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hostels?.map((hostel) => (
                  <TableRow key={hostel.id}>
                    <TableCell className="text-gray-900 font-medium">
                      {hostel.name}
                    </TableCell>
                    <TableCell>{hostel.location}</TableCell>
                    <TableCell>{hostel.capacity}</TableCell>
                    <TableCell>{hostel.remainingCapacity}</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-50 text-blue-800 hover:bg-blue-50">
                        {hostel.gender}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(hostel)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-red-600"
                        onClick={() => handleDelete(hostel)}
                        disabled={deleteMutation.isPending}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
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
