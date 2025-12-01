import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/api";
import type { UserCreateDto, LoginDto, TokenResponseDto } from "../types";
import { useAuth } from "../context";

export function useAuthRegister() {
  const { login } = useAuth();

  const mutationFn = async (payload: UserCreateDto) => {
    const res = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res?.ok) throw new Error("Registration failed");
    return res.json() as Promise<TokenResponseDto>;
  };

  return useMutation<TokenResponseDto, Error, UserCreateDto>({
    mutationFn,
    onSuccess: (data) => {
      login(data.access_token, data.refresh_token, data.user);
    },
  });
}

export function useAuthLogin() {
  const { login } = useAuth();

  const mutationFn = async (payload: LoginDto) => {
    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (!res?.ok) throw new Error("Login failed");
    return res.json() as Promise<TokenResponseDto>;
  };

  return useMutation<TokenResponseDto, Error, LoginDto>({
    mutationFn,
    onSuccess: (data) => {
      login(data.access_token, data.refresh_token, data.user);
    },
  });
}
