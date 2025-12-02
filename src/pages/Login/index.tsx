import { useState } from "react";
import { Stack, Input, Button, Typography } from "@mui/material";
import { useNavigate, Link, Navigate } from "react-router-dom";
import type { LoginDto } from "../../types";
import { Login, NightsStay } from "@mui/icons-material";
import { useAuthLogin } from "../../hooks";
import { useAuth } from "../../context";

export function LoginPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [errors, setErrors] = useState<Partial<LoginDto>>({});
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

    await login(form);
    navigate("/", { replace: true });
  };

  const inputStyles = {
    height: 40,
    padding: "0 12px",
    fontSize: 14,
    lineHeight: "40px",
    borderRadius: 2,
    "&::placeholder": { opacity: 0.7 },
  };

  if (user) {
    return <Navigate to="/" replace />;
  }

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      sx={{
        backgroundColor: "lightblue",
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
        sx={{ 
          backgroundColor: "black",
          opacity: 0.9, 
        }}
      >
        <Stack direction="row" alignSelf="center" alignItems="center" spacing={1}>
          <Typography align="center" fontSize={22}>
            Login
          </Typography>
          <NightsStay sx={{ color: "lightblue" }} />
        </Stack>
        <Stack spacing={.75} mt={4.5}>
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
                border: errors.email ? "2px solid lightblue" : "1px solid #ccc",
                color: "white",
                width: "100%",
                boxSizing: "border-box",
              }}
            />
            <Typography
              fontSize={11}
              color="lightblue"
              visibility={errors.email ? "visible" : "hidden"}
            >
              {errors.email}*
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
                border: errors.password ? "2px solid lightblue" : "1px solid #ccc",
                color: "white",
              }}
            />
            <Typography
              fontSize={11}
              color="lightblue"
              visibility={errors.password ? "visible" : "hidden"}
            >
              {errors.password}*
            </Typography>
          </Stack>
        </Stack>
        <Stack alignSelf="center" width="100%" spacing={3} mt={3}>
          <Button
            variant="contained"
            onClick={handleLogin}
            endIcon={<Login style={{ marginLeft: "-5px", height: 16 }} />}
            sx={{
              backgroundColor: "black",
              color: "lightblue",
              border: "1.5px solid lightblue",
              borderRadius: 2,
            }}
          >
            Login
          </Button>
          <Typography align="center" fontSize={12}>
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "lightblue" }}>
              Register
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
