import { useState } from "react";
import { Stack, Input, Button, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import type { LoginDto } from "../../types";
import { useAuthLogin } from "../../hooks/auth";
import { Login } from "@mui/icons-material";

export function LoginPage() {
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<LoginDto>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState<LoginDto>({ email: "", password: "" });
  const { mutateAsync: login } = useAuthLogin();

  const handleLogin = async () => {
    const newErrors: typeof errors = {};
    if (!form.email) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) newErrors.password = "Please enter your password";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    try {
      await login(form);
      navigate("/", { replace: true });
    } catch {
      setSubmitError("Login failed, invalid credentials provided");
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
        backgroundColor: "rgba(0, 20, 57, 0.4)",
      }}
    >
      <Stack
        minHeight="300px"
        width="100%"
        maxWidth="400px"
        minWidth="400px"
        padding={4}
        color="white"
        border="1px solid #ccc"
        borderRadius="16px"
        sx={{ backgroundColor: "black" }}
      >
        <Typography align="center" fontSize={22}>
          Login
        </Typography>
        <Stack spacing={2} mt={4.5}>
          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, email: e.target.value }))
              }
              sx={{
                ...inputStyles,
                border: errors.email ? "1px solid red" : "1px solid #ccc",
                color: "white",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <Typography
              fontSize={11}
              color="red"
              visibility={errors.email ? "visible" : "hidden"}
            >
              {errors.email}
            </Typography>
          </Stack>
          <Stack spacing={0.5}>
            <Input
              disableUnderline
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              sx={{
                ...inputStyles,
                border: errors.password ? "1px solid red" : "1px solid #ccc",
                color: "white",
              }}
            />
            <Typography
              fontSize={11}
              color="red"
              visibility={errors.password ? "visible" : "hidden"}
            >
              {errors.password}
            </Typography>
          </Stack>
        </Stack>
        <Typography
          align="center"
          fontSize={11}
          color="red"
          visibility={submitError ? "visible" : "hidden"}
          mt={2}
        >
          {submitError}*
        </Typography>
        <Stack alignSelf="center" width="100%" spacing={3} mt={2}>
          <Button
            variant="contained"
            onClick={handleLogin}
            endIcon={<Login style={{ height: 16 }} />}
          >
            Login
          </Button>
          <Typography align="center" fontSize={12}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "#1976D2" }}>
              Register
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
