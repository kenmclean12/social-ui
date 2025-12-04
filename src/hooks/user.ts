import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSnackbar } from "notistack";
import {
  type UserCreateDto,
  type UserWithCountsResponseDto,
  type UserUpdateDto,
  type PasswordResetDto,
  type UserResponseDto,
} from "../types";
import { api } from "../lib/api";

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

export function useUserFindAll() {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const res = await api("/user");
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to fetch users");
      }
      return res.json() as Promise<UserResponseDto[]>;
    },
  });
}

export function useUserCreate() {
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async (dto: UserCreateDto) => {
      const res = await api("/user", {
        method: "POST",
        body: JSON.stringify(dto),
      });

      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to create user");
      }

      return res.json() as Promise<UserResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("User created!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
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
  const qc = useQueryClient();
  const { enqueueSnackbar } = useSnackbar();

  return useMutation({
    mutationFn: async () => {
      const res = await api("/user/self", { method: "DELETE" });
      if (!res?.ok) {
        const err = await res?.json();
        throw new Error(err.message || "Failed to delete user");
      }

      return res.json() as Promise<UserResponseDto>;
    },
    onSuccess: () => {
      enqueueSnackbar("User deleted!", { variant: "success" });
      qc.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => enqueueSnackbar(err.message, { variant: "error" }),
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
