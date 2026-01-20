import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Clock,
  Loader2,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { usePrograms, useDeleteProgram } from "@/lib/api/programs";
import type { Program } from "@/lib/api/programs";
import { toast } from "sonner";
import { useAuthStore } from "@/lib/stores/authStore";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function ProgramsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMineOnly, setShowMineOnly] = useState(false);
  const itemsPerPage = 9;

  const user = useAuthStore((state) => state.user);
  // If user is NOT admin (e.g. partner), they only see their own anyway,
  // so the toggle is relevant mainly for Admins who want to filter down to their own.
  // Although partners 'implicitly' have mine=true enforced by backend,
  // we can show the toggle as 'checked and disabled' or just hide it.
  // Let's hide it for non-admins as it's implied.
  const canFilterMine = user?.isAdmin;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, showMineOnly]);

  const { data, isFetching, error } = usePrograms({
    name: search || undefined,
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage,
    mine: canFilterMine ? showMineOnly : undefined,
  });

  const deleteMutation = useDeleteProgram();

  const programs = data?.data || [];
  const totalItems = data?.pagination?.total || 0;

  const handleDelete = async (program: Program) => {
    if (!confirm(`Delete "${program.name}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(program.id);
      toast.success("Program deleted successfully");
    } catch (mutationError: any) {
      toast.error(mutationError.message || "Unable to delete program");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">CRM Programs</h1>
          <p className="text-gray-600">Manage CRM leadership programs</p>
        </div>
        <Button
          onClick={() => navigate("/programs/create")}
          className="gap-2 bg-blue-900 hover:bg-blue-800"
        >
          <Plus className="w-4 h-4" />
          Add Program
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search programs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-sm"
        />
        {canFilterMine && (
          <div className="flex items-center space-x-2">
            <Switch
              id="mine-filter"
              checked={showMineOnly}
              onCheckedChange={setShowMineOnly}
            />
            <Label htmlFor="mine-filter">Show My Programs Only</Label>
          </div>
        )}
      </div>

      {error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-red-600">
              Unable to load programs: {error.message}
            </p>
          </CardContent>
        </Card>
      ) : isFetching && programs?.length === 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)]?.map((_, index) => (
            <Card key={index}>
              <Skeleton className="aspect-video w-full" />
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : programs?.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No CRM programs found</p>
            <Button
              onClick={() => navigate("/programs/create")}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Program
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {programs?.map((program) => (
            <Card key={program.id} className="overflow-hidden flex flex-col">
              <div className="aspect-video w-full bg-zinc-100 dark:bg-zinc-800 relative">
                {program.image ? (
                  <img
                    src={program.image}
                    alt={program.name}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-zinc-400">
                    <Calendar className="h-12 w-12" />
                  </div>
                )}
                <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs px-2 py-1 rounded">
                  {program.for}
                </div>
              </div>
              <CardHeader>
                <CardTitle className="flex justify-between items-start">
                  <span className="truncate">{program.name}</span>
                  {program.price && (
                    <span className="text-sm font-normal bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded whitespace-nowrap ml-2">
                      # {program.price}
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400 flex-1">
                {program.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {program.location}
                  </div>
                )}
                {program.duration && (
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {program.duration}
                  </div>
                )}
              </CardContent>
              <CardFooter className="gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate(`/programs/${program.id}/edit`)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="icon"
                      disabled={deleteMutation.isPending}
                    >
                      {deleteMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete the program and remove it from our servers.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(program)}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}

      {!isFetching && programs?.length > 0 && totalItems > itemsPerPage && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems}{" "}
            programs
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
