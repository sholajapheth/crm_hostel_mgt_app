import { useMutation, useQueryClient } from "@tanstack/react-query";
import { httpClient } from "./httpClient";
import type {
  CreateProgramRequest,
  UpdateProgramRequest,
  Program,
} from "./interface";
import { programKeys } from "./queries";

// Create program mutation
export const useCreateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation<Program, Error, CreateProgramRequest>({
    mutationFn: async (data: CreateProgramRequest) => {
      const response = await httpClient.post<Program>(
        "/api/v2/programs/admin/crm",
        data
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch programs list
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
    },
  });
};

// Update program mutation
export const useUpdateProgram = () => {
  const queryClient = useQueryClient();

  return useMutation<
    Program,
    Error,
    { id: string; data: UpdateProgramRequest }
  >({
    mutationFn: async ({ id, data }) => {
      const response = await httpClient.put<Program>(
        `/api/v2/programs/admin/${id}`,
        data
      );
      return response.data;
    },
    onSuccess: (_, variables) => {
      // Invalidate and refetch programs list
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      // Invalidate and refetch the specific program
      queryClient.invalidateQueries({
        queryKey: programKeys.detail(variables.id),
      });
    },
  });
};

// Delete program mutation
export const useDeleteProgram = () => {
  const queryClient = useQueryClient();

  return useMutation<void, Error, number>({
    mutationFn: async (id: string) => {
      await httpClient.delete(`/api/v2/programs/admin/${id}`);
    },
    onSuccess: (_, id) => {
      // Invalidate and refetch programs list
      queryClient.invalidateQueries({ queryKey: programKeys.lists() });
      // Remove the specific program from cache
      queryClient.removeQueries({
        queryKey: programKeys.detail(id),
      });
    },
  });
};
