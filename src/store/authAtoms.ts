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

const cookieStorage = {
  getItem: (key: string) => {
    return Cookies.get(key) ?? null;
  },
  setItem: (key: string, value: string | null) => {
    if (value === null) {
      Cookies.remove(key, { path: "/dashboard" });
    } else {
      Cookies.set(key, value, {
        expires: 1,
        secure: true,
        sameSite: "Strict",
        path: "/dashboard",
      });
    }
  },
  removeItem: (key: string) => {
    Cookies.remove(key, { path: "/dashboard" });
  },
};

// 2) Persist both userId and accessToken in cookies:
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
  const { access: accessToken } = await apiClient.post<{ access: string }>(
    "/token",
    { user_id: userId, password }
  );
  set(accessTokenAtom, accessToken);
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
      if (!token || !userId) return null;
      try {
        const user = await apiClient.get<User>(`/users/${userId}`);
        return user;
      } catch {
        console.error("Failed to fetch user");
        return null;
      }
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
  // invalidate the “user” query so it refetches with fresh data:
  onSuccess: () => {
    const token = get(accessTokenAtom);
    const userId = get(userIdAtom);
    get(queryClientAtom).invalidateQueries({
      queryKey: ["user", userId, token],
    });
  },
}));

export const isLoggedInAtom = atom<boolean>((get) =>
  Boolean(get(accessTokenAtom))
);
