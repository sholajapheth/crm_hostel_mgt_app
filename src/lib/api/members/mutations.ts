import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { Member, CreateMemberRequest, UpdateMemberRequest } from "./interface";
import { memberKeys } from "./queries";

export const useCreateMember = () => {
  const queryClient = useQueryClient();

  return useMutation<Member, Error, CreateMemberRequest>({
    mutationFn: async (data) => {
      const response = await httpClient.post<Member>("/api/v3/admin/members/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
    },
  });
};

export const useUpdateMember = () => {
  const queryClient = useQueryClient();

  return useMutation<Member, Error, { id: number; data: UpdateMemberRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await httpClient.put<Member>(`/api/v3/admin/members/${id}`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      queryClient.invalidateQueries({ queryKey: memberKeys.detail(variables.id) });
    },
  });
};

export const useDeleteMember = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await httpClient.delete(`/api/v3/admin/members/${id}`);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: memberKeys.lists() });
      queryClient.removeQueries({ queryKey: memberKeys.detail(id) });
    },
  });
};
