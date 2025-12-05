import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { Program } from "./interface";

export const programKeys = {
  all: ["programs"] as const,
  lists: () => [...programKeys.all, "list"] as const,
  list: (filters: Record<string, any>) =>
    [...programKeys.lists(), filters] as const,
  details: () => [...programKeys.all, "detail"] as const,
  detail: (id: string) => [...programKeys.details(), id] as const,
};

// Get all CRM programs with pagination
export const usePrograms = (params?: {
  name?: string;
  limit?: number;
  offset?: number;
  mine?: boolean;
}) => {
  return useQuery<{ data: Program[]; pagination: any }, Error>({
    queryKey: programKeys.list(params || {}),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.name) searchParams.append("name", params.name);
      if (params?.limit) searchParams.append("limit", params.limit.toString());
      if (params?.offset)
        searchParams.append("offset", params.offset.toString());
      if (params?.mine) searchParams.append("mine", "true");

      const response = await httpClient.get<{
        data: Program[];
        pagination: any;
      }>(`/api/v2/programs/admin/crm?${searchParams.toString()}`);
      return response.data;
    },
  });
};

// Get single program by ID
export const useProgram = (id: string, enabled = true) => {
  return useQuery<Program, Error>({
    queryKey: programKeys.detail(id),
    enabled: enabled && Boolean(id),
    queryFn: async () => {
      const response = await httpClient.get<Program>(
        `/api/v2/programs/admin/${id}`
      );
      return response.data;
    },
  });
};
