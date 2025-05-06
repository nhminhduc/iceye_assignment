import apiClient from "@/api/apiClient";
import type { Acquisition } from "@/types/api";
import { atomWithQuery } from "jotai-tanstack-query";
import { accessTokenAtom } from "./authAtoms";

export const acquisitionsAtom = atomWithQuery<Acquisition[]>((get) => {
  const token = get(accessTokenAtom);
  return {
    queryKey: ["acquisitions", token],
    enabled: Boolean(token),
    queryFn: async () => {
      if (!token) return [];
      return await apiClient.get<Acquisition[]>("/acquisitions", {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
  };
});
