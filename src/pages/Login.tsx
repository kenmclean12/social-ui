import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import type { LoginDto } from "../types";
import { useAuthLogin } from "../hooks/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState<LoginDto>({
    email: "",
    password: "",
  });

  const { mutateAsync: login } = useAuthLogin();

  async function submit(e: React.FormEvent<HTMLFormElement>): Promise<void> {
    e.preventDefault();
    try {
      await login(form);
      navigate("/", { replace: true });
    } catch {
      console.log("Error, Login Failed", e);
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
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, password: e.target.value }))
          }
        />
        <button>Login</button>
      </form>
      <p>
        Not a user? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}
