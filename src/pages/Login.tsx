import { useState } from "react";
import { api } from "../lib/api";
import { useAuth } from "../context/AuthContext";

export function LoginPage() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(e) {
    e.preventDefault();

    const res = await api("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (res.ok) {
      const tokens = await res.json();
      login(tokens.access_token, tokens.refresh_token);
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
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button>Login</button>
      </form>
    </div>
  );
}
