import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { Zone } from "./interface";

export const zoneKeys = {
  all: ["zones"] as const,
  lists: () => [...zoneKeys.all, "list"] as const,
  details: () => [...zoneKeys.all, "detail"] as const,
  detail: (id: number) => [...zoneKeys.details(), id] as const,
};

export const useZones = () => {
  return useQuery<Zone[], Error>({
    queryKey: zoneKeys.lists(),
    queryFn: async () => {
      const response = await httpClient.get<Zone[]>("/api/v3/admin/zones/");
      return response.data;
    },
  });
};

export const useZone = (id: number, enabled = true) => {
  return useQuery<Zone, Error>({
    queryKey: zoneKeys.detail(id),
    enabled: enabled && Boolean(id),
    queryFn: async () => {
      const response = await httpClient.get<Zone>(`/api/v3/admin/zones/${id}`);
      return response.data;
    },
  });
};
