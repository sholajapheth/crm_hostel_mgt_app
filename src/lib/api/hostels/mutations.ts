import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import {
  AssignAllHostelsResponse,
  AssignHostelRequest,
  CreateHostelRequest,
  Hostel,
  ManualAssignHostelRequest,
  UpdateHostelRequest,
} from "./interface";
import { hostelKeys } from "./queries";

export const useCreateHostel = () => {
  const queryClient = useQueryClient();

  return useMutation<Hostel, Error, CreateHostelRequest>({
    mutationFn: async (data: CreateHostelRequest) => {
      const response = await httpClient.post<Hostel>("/api/v3/admin/hostels/", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.lists() });
    },
  });
};

export const useUpdateHostel = () => {
  const queryClient = useQueryClient();

  return useMutation<Hostel, Error, { id: number; data: UpdateHostelRequest }>({
    mutationFn: async ({ id, data }) => {
      const response = await httpClient.put<Hostel>(`/api/v3/admin/hostels/${id}`, data);
      return response.data;
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.lists() });
      queryClient.invalidateQueries({ queryKey: hostelKeys.detail(variables.id) });
    },
  });
};

export const useDeleteHostel = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: number) => {
      await httpClient.delete(`/api/v3/admin/hostels/${id}`);
    },
    onSuccess: (_data, id) => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.lists() });
      queryClient.removeQueries({ queryKey: hostelKeys.detail(id) });
    },
  });
};

export const useAssignHostel = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, AssignHostelRequest>({
    mutationFn: async (data: AssignHostelRequest) => {
      await httpClient.post("/api/v3/admin/hostels/assign", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.lists() });
    },
  });
};

export const useAssignAllHostels = () => {
  const queryClient = useQueryClient();

  return useMutation<AssignAllHostelsResponse, Error, void>({
    mutationFn: async () => {
      const response = await httpClient.post<AssignAllHostelsResponse>(
        "/api/v3/admin/hostels/assign-all"
      );
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: hostelKeys.lists() });
    },
  });
};

export const useManualAssignHostel = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, ManualAssignHostelRequest>({
    mutationFn: async (data: ManualAssignHostelRequest) => {
      await httpClient.post("/api/v3/admin/hostels/manual-assign", {
        memberIds: data.memberIds,
        hostelId: data.hostelId,
      });
    },
    onSuccess: () => {
      // Invalidate hostels to refresh capacity
      queryClient.invalidateQueries({ queryKey: hostelKeys.lists() });
      // Invalidate applicants to refresh assignment status
      queryClient.invalidateQueries({ queryKey: ["admin", "applicants"] });
    },
  });
};
