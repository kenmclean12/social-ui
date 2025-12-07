import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { UserCreateDto, LoginDto, TokenResponseDto } from "../types";
import { useAuth } from "../context";
import { useSnackbar } from "notistack";

export function useAuthRegister() {
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const mutationFn = async (payload: UserCreateDto) => {
    const res = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res?.ok) {
      let message = "Registration failed";
      const err = await res?.json();
      message = err.message || err.error || message;
      throw new Error(message);
    }

    return res.json() as Promise<TokenResponseDto>;
  };

  return useMutation<TokenResponseDto, Error, UserCreateDto>({
    mutationFn,
    onSuccess: (data) => {
      login(data.access_token, data.refresh_token, data.user);
    },
    onError: (err) => {
      enqueueSnackbar(err.message, { variant: "error" });
    },
  });
}

export function useAuthLogin() {
  const { login } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const mutationFn = async (payload: LoginDto) => {
    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res?.ok) {
      let message = "Login failed";
      const err = await res?.json();
      message = err.message || err.error || message;
      throw new Error(message);
    }

    return res.json() as Promise<TokenResponseDto>;
  };

  return useMutation<TokenResponseDto, Error, LoginDto>({
    mutationFn,
    onSuccess: (data) => {
      login(data.access_token, data.refresh_token, data.user);
    },
    onError: () => {
      enqueueSnackbar("Login failed, invalid credentials provided", {
        variant: "error",
      });
    },
  });
}
