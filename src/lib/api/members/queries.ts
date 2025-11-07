import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { Member } from "./interface";

export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: number) => [...memberKeys.details(), id] as const,
};

export const useMembers = () => {
  return useQuery<Member[], Error>({
    queryKey: memberKeys.lists(),
    queryFn: async () => {
      const response = await httpClient.get<Member[]>("/api/v3/admin/members/");
      return response.data;
    },
  });
};

export const useMember = (id: number, enabled = true) => {
  return useQuery<Member, Error>({
    queryKey: memberKeys.detail(id),
    enabled: enabled && Boolean(id),
    queryFn: async () => {
      const response = await httpClient.get<Member>(`/api/v3/admin/members/${id}`);
      return response.data;
    },
  });
};
