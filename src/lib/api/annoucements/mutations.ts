import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type {
  CreateAnnouncementRequest,
  UpdateAnnouncementRequest,
  AnnouncementResponse,
} from "./interface";
import { announcementKeys } from "./queries";

// Create announcement mutation
export const useCreateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<AnnouncementResponse, Error, CreateAnnouncementRequest>({
    mutationFn: async (data: CreateAnnouncementRequest) => {
      const response = await httpClient.post<AnnouncementResponse>(
        "/api/v2/crm/admin/announcements/",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
    },
  });
};

// Update announcement mutation
export const useUpdateAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AnnouncementResponse,
    Error,
    { id: number; data: UpdateAnnouncementRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await httpClient.put<AnnouncementResponse>(
        `/api/v2/crm/admin/announcements/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      // Invalidate and refetch the specific announcement
      queryClient.invalidateQueries({
        queryKey: announcementKeys.detail(variables.id),
      });
    },
  });
};

// Delete announcement mutation
export const useDeleteAnnouncement = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await httpClient.delete(`/api/v2/crm/admin/announcements/${id}`);
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch announcements list
      queryClient.invalidateQueries({ queryKey: announcementKeys.lists() });
      // Remove the specific announcement from cache
      queryClient.removeQueries({
        queryKey: announcementKeys.detail(id),
      });
    },
  });
};
