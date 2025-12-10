import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  type UserWithCountsResponseDto,
  type UserUpdateDto,
  type PasswordResetDto,
  type UserResponseDto,
} from "../../types";
import { api } from "../../lib/api";
import { useRef } from "react";

export function useUserFindOne(id: number) {
  return useQuery({
    queryKey: ["users", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await api(`/user/${id}`);
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch user");
      }
      return res.json() as Promise<UserWithCountsResponseDto>;
    },
  });
}

export function useUserSearch(search: string) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return useQuery<UserResponseDto[]>({
    queryKey: ["user-search", search],
    enabled: search.trim().length > 0,
    queryFn: () =>
      new Promise((resolve) => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(async () => {
          const res = await api(`/user/search?q=${encodeURIComponent(search)}`);

          if (!res?.ok) {
            const err = await res?.json();
            throw new Error(err.message || "Failed to search users");
          }

          const json = (await res.json()) as UserResponseDto[];
          resolve(json);
        }, 200);
      }),
  });
}

export function useUserUpdate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: UserUpdateDto) => {
      const res = await api("/user/self", {
        method: "PATCH",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to update user");
      }

      return res.json() as Promise<UserResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("User updated!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}

export function useUserDelete() {
  return useMutation({
    mutationFn: async () => {
      const res = await api("/user/self", { method: "DELETE" });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to delete user");
      }

      return res.json() as Promise<UserResponseDto>;
    },
  });
}

export function useUserResetPassword() {
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: PasswordResetDto) => {
      const res = await api("/user/reset-password", {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to reset password");
      }

      return res.json() as Promise<UserResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("Password reset successful!", { variant: "success" });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
  });
}
