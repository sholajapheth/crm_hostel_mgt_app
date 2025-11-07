import { useQuery } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type { AdminUser, Applicant, ApplicantFilters } from "./interface";

export const adminUsersKeys = {
  applicants: (filters?: ApplicantFilters) =>
    ["admin", "applicants", filters ?? {}] as const,
  adminUsers: () => ["admin", "users", "list"] as const,
  adminUser: (id: number) => ["admin", "users", "detail", id] as const,
};

export const useApplicants = (filters?: ApplicantFilters) => {
  return useQuery<Applicant[], Error>({
    queryKey: adminUsersKeys.applicants(filters),
    queryFn: async () => {
      const response = await httpClient.get<Applicant[]>(
        "/api/v3/admin/users/",
        {
          params: filters,
        }
      );
      return response.data;
    },
  });
};

export const useAdminUsers = () => {
  return useQuery<AdminUser[], Error>({
    queryKey: adminUsersKeys.adminUsers(),
    queryFn: async () => {
      const response = await httpClient.get<AdminUser[]>(
        "/api/v3/admin/users/users/"
      );
      return response.data;
    },
  });
};

export const useAdminUser = (id: number, enabled = true) => {
  return useQuery<AdminUser, Error>({
    queryKey: adminUsersKeys.adminUser(id),
    enabled: enabled && Boolean(id),
    queryFn: async () => {
      const response = await httpClient.get<AdminUser>(
        `/api/v3/admin/users/users/${id}`
      );
      return response.data;
    },
  });
};

export const fetchApplicantsCsv = async (): Promise<Blob> => {
  const response = await httpClient.get<Blob>("/api/v3/admin/users/csv", {
    responseType: "blob",
  });
  return response.data;
};
