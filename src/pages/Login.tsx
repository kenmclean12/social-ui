import { useState } from "react";
import { api } from "../lib/api";
import { Link } from "react-router-dom";
import type { LoginDto, TokenResponseDto } from "../types";
import { useAuth } from "../context";

export function LoginPage() {
  const { login } = useAuth();
  const [form, setForm] = useState<LoginDto>({
    email: "",
    password: "",
  })

async function submit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();

    const { email, password } = form;
    const res = await api("/auth/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
    });

    if (res?.ok) {
        const tokens: TokenResponseDto = await res?.json();
        login(tokens.access_token, tokens.refresh_token, tokens.user);
        window.location.href = "/";
    } else {
        alert("Login failed");
    }
}

  return (
    <div>
      <h1>Login</h1>
      <form onSubmit={submit}>
        <input
          type="text"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
        />
        <button>Login</button>
      </form>
      <p>
        Not a user?{" "}
        <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
