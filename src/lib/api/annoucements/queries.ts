import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { AnnouncementsResponse, AnnouncementResponse } from "./interface";

// Query key factory
export const announcementKeys = {
  all: ["announcements"] as const,
  lists: () => [...announcementKeys.all, "list"] as const,
  list: (filters: string) =>
    [...announcementKeys.lists(), { filters }] as const,
  details: () => [...announcementKeys.all, "detail"] as const,
  detail: (id: number) => [...announcementKeys.details(), id] as const,
};

// Get all announcements
export const useAnnouncements = () => {
  return useQuery<AnnouncementsResponse, Error>({
    queryKey: announcementKeys.lists(),
    queryFn: async () => {
      const response = await httpClient.get<AnnouncementsResponse>(
        "/api/v2/crm/admin/announcements/"
      );
      return response.data;
    },
  });
};

// Get single announcement by ID
export const useAnnouncement = (id: number) => {
  return useQuery<AnnouncementResponse, Error>({
    queryKey: announcementKeys.detail(id),
    queryFn: async () => {
      const response = await httpClient.get<AnnouncementResponse>(
        `/api/v2/crm/admin/announcements/${id}`
      );
      return response.data;
    },
    enabled: !!id, // Only run query if id is provided
  });
};
