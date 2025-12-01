import { useState } from "react";
import { Stack, Input, Button, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import type { LoginDto } from "../types";
import { useAuthLogin } from "../hooks/auth";

export function LoginPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<LoginDto>>({});
  const [form, setForm] = useState<LoginDto>({ email: "", password: "" });
  const { mutateAsync: login } = useAuthLogin();

  const handleLogin = async () => {
    const newErrors: typeof errors = {};
    if (!form.email) newErrors.email = "Please enter your email";
    if (!form.password) newErrors.password = "Please enter your password";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await login(form);
      navigate("/", { replace: true });
    } catch {
      setErrors({ password: "Login failed" });
    }
  };

  const inputStyles = {
    height: 40,
    padding: "0 12px",
    fontSize: 14,
    lineHeight: "40px",
    borderRadius: 2,
    "&::placeholder": { opacity: 0.7 },
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      sx={{ 
        backgroundColor: "rgba(205, 223, 255, 0.8)" 
      }}
    >
      <Stack
        minHeight="300px"
        width="100%"
        maxWidth="400px"
        minWidth="400px"
        spacing={4}
        padding={4}
        color="white"
        borderRadius="16px"
        sx={{ backgroundColor: "black" }}
      >
        <Typography align="center" fontSize={22}>
          Login
        </Typography>
        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              sx={{
                ...inputStyles,
                border: errors.email ? "1px solid red" : "1px solid #ccc",
                color: "white",
              }}
            />
            <Typography fontSize={11} color="red" visibility={errors.email ? "visible" : "hidden"}>
              {errors.email}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Input
              disableUnderline
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              sx={{
                ...inputStyles,
                border: errors.password ? "1px solid red" : "1px solid #ccc",
                color: "white",
              }}
            />
            <Typography fontSize={11} color="red" visibility={errors.password ? "visible" : "hidden"}>
              {errors.password}
            </Typography>
          </Stack>
        </Stack>
        <Stack alignSelf="center" width="100%" spacing={4} mt={1}>
          <Button variant="contained" onClick={handleLogin}>
            Login
          </Button>
          <Typography align="center" fontSize={12}>
            Don't have an account? <Link to="/register" style={{ color: '#1976D2' }}>Register</Link>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
