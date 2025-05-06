import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import type { User } from "../types/common";
import apiClient from "../api/apiClient";
import type { UpdateUserPayload, Acquisition } from "@/types/api";

// Update user profile
export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation<User, AxiosError, UpdateUserPayload>({
    mutationFn: async ({ userId, name, password }) =>
      apiClient.post<User>(`/users/${userId}`, {
        name,
        password,
      }),
    onSuccess: (_updatedUser, variables) => {
      // Invalidate and refetch relevant queries
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user", variables.userId] });
    },
  });
}

// Fetch acquisitions data
export function useAcquisitions() {
  return useQuery<Acquisition[]>({
    queryKey: ["acquisitions"],
    queryFn: async () => {
      const response = await apiClient.get<Acquisition[]>("/acquisitions");
      return response;
    },
  });
}
