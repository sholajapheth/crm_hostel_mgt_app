import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type {
  AdminUser,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
} from "./interface";
import { adminUsersKeys, fetchApplicantsCsv } from "./queries";

export const useCreateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation<AdminUser, Error, CreateAdminUserRequest>({
    mutationFn: async (data) => {
      const response = await httpClient.post<AdminUser>(
        "/api/v2/crm/admin/users/users/",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.adminUsers() });
    },
  });
};

export const useUpdateAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation<
    AdminUser,
    Error,
    { id: number; data: UpdateAdminUserRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await httpClient.put<AdminUser>(
        `/api/v2/crm/admin/users/users/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.adminUsers() });
      queryClient.invalidateQueries({
        queryKey: adminUsersKeys.adminUser(variables.id),
      });
    },
  });
};

export const useDeleteAdminUser = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await httpClient.delete(`/api/v2/crm/admin/users/users/${id}`);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: adminUsersKeys.adminUsers() });
      queryClient.removeQueries({ queryKey: adminUsersKeys.adminUser(id) });
    },
  });
};

export const useDownloadApplicantsCsv = () => {
  return useMutation<Blob, Error, void>({
    mutationFn: async () => {
      return fetchApplicantsCsv();
    },
  });
};
