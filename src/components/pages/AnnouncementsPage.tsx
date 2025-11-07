import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Calendar, RotateCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import { Skeleton } from "../ui/skeleton";
import {
  useAnnouncements,
  useCreateAnnouncement,
  useUpdateAnnouncement,
  useDeleteAnnouncement,
} from "@/lib/api/annoucements";
import type { Announcement, CreateAnnouncementRequest } from "@/lib/api/annoucements";
import { toast } from "sonner";

export function AnnouncementsPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formState, setFormState] = useState<CreateAnnouncementRequest>({
    title: "",
    message: "",
  });

  const {
    data: announcements = [],
    isFetching,
    error,
  } = useAnnouncements();

  const createMutation = useCreateAnnouncement();
  const updateMutation = useUpdateAnnouncement();
  const deleteMutation = useDeleteAnnouncement();

  useEffect(() => {
    if (editingAnnouncement) {
      setFormState({
        title: editingAnnouncement.title,
        message: editingAnnouncement.message,
      });
    } else {
      setFormState({ title: "", message: "" });
    }
  }, [editingAnnouncement]);

  const handleSubmit = async () => {
    if (!formState.title.trim() || !formState.message.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      if (editingAnnouncement) {
        await updateMutation.mutateAsync({
          id: editingAnnouncement.id,
          data: formState,
        });
        toast.success("Announcement updated successfully");
      } else {
        await createMutation.mutateAsync(formState);
        toast.success("Announcement created successfully");
      }
      setFormState({ title: "", message: "" });
      setEditingAnnouncement(null);
      setIsCreateDialogOpen(false);
    } catch (mutationError: any) {
      toast.error(mutationError.message || "Unable to save announcement");
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setIsCreateDialogOpen(true);
  };

  const handleDelete = async (announcement: Announcement) => {
    if (!confirm(`Delete "${announcement.title}"?`)) {
      return;
    }

    try {
      await deleteMutation.mutateAsync(announcement.id);
      toast.success("Announcement deleted successfully");
    } catch (mutationError: any) {
      toast.error(mutationError.message || "Unable to delete announcement");
    }
  };

  const handleDialogClose = (open: boolean) => {
    setIsCreateDialogOpen(open);
    if (!open) {
      setEditingAnnouncement(null);
      setFormState({ title: "", message: "" });
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl text-gray-900 mb-2">Announcements</h1>
          <p className="text-gray-600">Create and manage announcements for participants</p>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={handleDialogClose}>
          <DialogTrigger asChild>
            <Button className="gap-2 bg-blue-900 hover:bg-blue-800">
              <Plus className="w-4 h-4" />
              Create Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>
                {editingAnnouncement ? "Edit Announcement" : "Create New Announcement"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  placeholder="Enter announcement title"
                  value={formState.title}
                  onChange={(e) => setFormState((prev) => ({ ...prev, title: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  placeholder="Enter announcement message"
                  value={formState.message}
                  onChange={(e) => setFormState((prev) => ({ ...prev, message: e.target.value }))}
                  rows={6}
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <Button
                variant="outline"
                onClick={() => handleDialogClose(false)}
              >
                Cancel
              </Button>
              {editingAnnouncement && (
                <Button
                  variant="outline"
                  onClick={() => {
                    setEditingAnnouncement(null);
                    setFormState({ title: "", message: "" });
                  }}
                  className="gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              )}
              <Button
                onClick={handleSubmit}
                className="bg-blue-900 hover:bg-blue-800"
                disabled={createMutation.isPending || updateMutation.isPending}
              >
                {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Announcements List */}
      {error ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-sm text-red-600">
              Unable to load announcements: {error.message}
            </p>
          </CardContent>
        </Card>
      ) : isFetching && announcements.length === 0 ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, index) => (
            <Card key={index}>
              <CardHeader>
                <Skeleton className="h-6 w-48 mb-2" />
                <Skeleton className="h-4 w-32" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : announcements.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-500 mb-4">No announcements yet</p>
            <Button
              onClick={() => setIsCreateDialogOpen(true)}
              variant="outline"
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              Create Your First Announcement
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{announcement.title}</CardTitle>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {new Date(announcement.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                      <div>By {announcement.createdBy}</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(announcement)}
                      disabled={deleteMutation.isPending}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(announcement)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 whitespace-pre-wrap">{announcement.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
