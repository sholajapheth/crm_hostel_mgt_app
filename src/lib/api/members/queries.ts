import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { Member } from "./interface";

export const memberKeys = {
  all: ["members"] as const,
  lists: () => [...memberKeys.all, "list"] as const,
  details: () => [...memberKeys.all, "detail"] as const,
  detail: (id: string) => [...memberKeys.details(), id] as const,
};

export const useMembers = () => {
  return useQuery<Member[], Error>({
    queryKey: memberKeys.lists(),
    queryFn: async () => {
      const response = await httpClient.get<Member[]>(
        "/api/v2/crm/admin/members/"
      );
      return response.data;
    },
  });
};

export const useMember = (id: string, enabled = true) => {
  return useQuery<Member, Error>({
    queryKey: memberKeys.detail(id),
    enabled: enabled && Boolean(id),
    queryFn: async () => {
      const response = await httpClient.get<Member>(
        `/api/v2/crm/admin/members/${id}`
      );
      return response.data;
    },
  });
};
