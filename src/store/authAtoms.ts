import Cookies from "js-cookie";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import type { Getter } from "jotai";
import type { User } from "@/types/common";
import {
  atomWithMutation,
  atomWithQuery,
  queryClientAtom,
} from "jotai-tanstack-query";
import apiClient from "@/api/apiClient";

/**
 * A simple cookie-based storage implementing the Storage interface.
 * Uses root path and current domain to ensure consistency across routes.
 */
const cookieStorage = {
  getItem: (key: string): string | null => {
    return Cookies.get(key) ?? null;
  },
  setItem: (key: string, value: string | null): void => {
    if (value === null) {
      Cookies.remove(key, { path: "/" });
      try {
        localStorage.removeItem(key);
      } catch {}
    } else {
      Cookies.set(key, value, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
        path: "/",
      });
    }
  },
  removeItem: (key: string): void => {
    Cookies.remove(key, { path: "/" });
  },
};

export const userIdAtom = atomWithStorage<string | null>(
  "userId",
  null,
  cookieStorage
);
export const accessTokenAtom = atomWithStorage<string | null>(
  "accessToken",
  null,
  cookieStorage
);

export const loginAtom = atom<
  null,
  [{ userId: string; password: string }],
  Promise<void>
>(null, async (_get, set, { userId, password }) => {
  const response = await apiClient.post<{ access: string }>("/token", {
    user_id: userId,
    password,
  });
  set(accessTokenAtom, response.access);
  set(userIdAtom, userId);
});

export const logoutAtom = atom(null, (_get, set) => {
  set(accessTokenAtom, null);
  set(userIdAtom, null);
});

export const userAtom = atomWithQuery<User | null>((get: Getter) => {
  const token = get(accessTokenAtom);
  const userId = get(userIdAtom);
  return {
    queryKey: ["user", userId, token],
    enabled: Boolean(token && userId),
    queryFn: async () => {
      const response = await apiClient.get<User>(`/users/${userId}`);
      return response;
    },
    onError: (error: unknown) => {
      console.error("userAtom fetch error:", error);
    },
  };
});

export const updateProfileAtom = atomWithMutation<
  User,
  { name: string; password: string }
>((get: Getter) => ({
  mutationFn: async ({ name, password }) => {
    const token = get(accessTokenAtom);
    const userId = get(userIdAtom);
    if (!token || !userId) {
      throw new Error("Not authenticated");
    }
    return await apiClient.post<User>(
      `/users/${userId}`,
      { name, password },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  },
  onSuccess: () => {
    const token = get(accessTokenAtom);
    const userId = get(userIdAtom);
    get(queryClientAtom).invalidateQueries({
      queryKey: ["user", userId, token],
    });
  },
}));

export const isLoggedInAtom = atom<boolean>((get) => {
  return Boolean(get(accessTokenAtom));
});
