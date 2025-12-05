import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { Hostel } from "./interface";

export const hostelKeys = {
  all: ["hostels"] as const,
  lists: () => [...hostelKeys.all, "list"] as const,
  list: (params?: Record<string, unknown>) =>
    [...hostelKeys.lists(), params ?? {}] as const,
  details: () => [...hostelKeys.all, "detail"] as const,
  detail: (id: number) => [...hostelKeys.details(), id] as const,
};

export const useHostels = () => {
  return useQuery<Hostel[], Error>({
    queryKey: hostelKeys.lists(),
    queryFn: async () => {
      const response = await httpClient.get<Hostel[]>(
        "/api/v2/crm/admin/hostels/"
      );
      return response.data;
    },
  });
};

export const useHostel = (id: number, enabled = true) => {
  return useQuery<Hostel, Error>({
    queryKey: hostelKeys.detail(id),
    enabled: enabled && Boolean(id),
    queryFn: async () => {
      const response = await httpClient.get<Hostel>(
        `/api/v2/crm/admin/hostels/${id}`
      );
      return response.data;
    },
  });
};
