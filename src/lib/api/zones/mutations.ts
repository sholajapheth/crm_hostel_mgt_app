import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { Zone, CreateZoneRequest, UpdateZoneRequest } from "./interface";
import { zoneKeys } from "./queries";

export const useCreateZone = () => {
  const queryClient = useQueryClient();

  return useMutation<Zone, Error, CreateZoneRequest>({
    mutationFn: async (data) => {
      const response = await httpClient.post<Zone>(
        "/api/v2/crm/admin/zones/",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
    },
  });
};

export const useUpdateZone = () => {
  const queryClient = useQueryClient();

  return useMutation<Zone, Error, { id: string; data: UpdateZoneRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await httpClient.put<Zone>(
        `/api/v2/crm/admin/zones/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
      queryClient.invalidateQueries({
        queryKey: zoneKeys.detail(variables.id),
      });
    },
  });
};

export const useDeleteZone = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: string) => {
      await httpClient.delete(`/api/v2/crm/admin/zones/${id}`);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: zoneKeys.lists() });
      queryClient.removeQueries({ queryKey: zoneKeys.detail(id) });
    },
  });
};
