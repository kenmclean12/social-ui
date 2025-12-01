import { createContext, useContext } from "react";
import type { SafeUserDto } from "../types";

export interface AuthContextType {
  isAuthenticated: boolean;
  user: SafeUserDto | null;
  login: (access_token: string, refresh_token: string, user: SafeUserDto) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>(null!);

export const useAuth = () => useContext(AuthContext);
