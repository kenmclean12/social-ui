import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../lib/api";
import type { UserCreateDto } from "../types";
import { useAuth } from "../context";

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<Partial<UserCreateDto>>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    description: "",
    avatarUrl: "",
  });
  const [age, setAge] = useState<number | undefined>(undefined);

  function update<K extends keyof UserCreateDto>(key: K, value: UserCreateDto[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!age) return;

    const payload: Partial<UserCreateDto> = { ...form, age};
    Object.keys(payload).forEach((k) => {
      const key = k as keyof UserCreateDto;
      if (payload[key] === "" || payload[key] === 0) delete payload[key];
    });

    const res = await api("/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (res?.ok) {
      const tokens = await res.json();
      login(tokens.access_token, tokens.refresh_token, tokens.user);
      window.location.href = "/";
    } else {
      alert("Registration failed");
    }
  }

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={submit}>
        <input placeholder="First Name" value={form.firstName} onChange={(e) => update("firstName", e.target.value)} />
        <input placeholder="Last Name" value={form.lastName} onChange={(e) => update("lastName", e.target.value)} />
        <input placeholder="Username" value={form.userName} onChange={(e) => update("userName", e.target.value)} />
        <input placeholder="Age" type="number" value={age} onChange={(e) => setAge(Number(e.target.value))} />
        <input placeholder="Phone Number" value={form.phoneNumber} onChange={(e) => update("phoneNumber", e.target.value)} />
        <input placeholder="Email" value={form.email} onChange={(e) => update("email", e.target.value)} />
        <input placeholder="Password" type="password" value={form.password} onChange={(e) => update("password", e.target.value)} />
        <input placeholder="Avatar URL (optional)" value={form.avatarUrl} onChange={(e) => update("avatarUrl", e.target.value)} />
        <input placeholder="Description (optional)" value={form.description} onChange={(e) => update("description", e.target.value)} />
        <button>Register</button>
      </form>
      <p style={{ marginTop: "1rem" }}>
        Already a user?{" "}
        <button
          type="button"
          onClick={() => navigate("/login")}
          style={{ textDecoration: "underline", background: "none", border: "none", cursor: "pointer", color: "blue" }}
        >
          Login
        </button>
      </p>
    </div>
  );
}
