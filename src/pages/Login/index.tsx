import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stack, Input, Button, Typography } from "@mui/material";
import { Login, NightsStay } from "@mui/icons-material";
import type { LoginDto } from "../../types";
import { useAuthLogin } from "../../hooks";
import { useSnackbar } from "notistack";

const inputStyles = {
  height: 40,
  padding: "0 12px",
  fontSize: 14,
  lineHeight: "40px",
  borderRadius: 2,
  "&::placeholder": { opacity: 0.7 },
};

export function LoginPage() {
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [errors, setErrors] = useState<Partial<LoginDto>>({});
  const [form, setForm] = useState<LoginDto>({ email: "", password: "" });
  const { mutateAsync: loginUser } = useAuthLogin();

  const handleLogin = async () => {
    const newErrors: typeof errors = {};
    if (!form.email) {
      newErrors.email = "Please enter your email";
      enqueueSnackbar("Email is required", { variant: "warning" });
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      enqueueSnackbar("Please enter a valid email address", { variant: "warning" });
    }

    if (!form.password) {
      newErrors.password = "Please enter your password";
      enqueueSnackbar("Password is required", { variant: "warning" });
    }
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    await loginUser(form);
    navigate("/", { replace: true });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleLogin();
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      sx={{
        backgroundColor: "black",
      }}
    >
      <Stack
        width="50%"
        height="45%"
        minHeight="300px"
        minWidth="400px"
        maxWidth="500px"
        padding={4}
        color="white"
        border="2px solid lightblue"
        borderRadius="16px"
        sx={{
          backgroundColor: "black",
          opacity: 0.9,
        }}
      >
        <Stack
          direction="row"
          alignSelf="center"
          alignItems="center"
          justifyContent="center"
          spacing={1}
          width="100%"
          height="15%"
        >
          <Typography fontSize={24}>Login</Typography>
          <NightsStay sx={{ color: "lightblue" }} />
        </Stack>
        <Stack alignItems="center" justifyContent="center" height="55%" pt={3}>
          <Stack spacing={0.25} pt={0.5} width="100%">
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  email: e.target.value,
                }))
              }
              onKeyDown={handleKeyDown}
              sx={{
                ...inputStyles,
                border: errors.email ? "2px solid lightblue" : "1px solid #ccc",
                color: "white",
              }}
              disableUnderline
              fullWidth
            />
            <Typography
              fontSize={11}
              color="lightblue"
              visibility={errors.email ? "visible" : "hidden"}
            >
              {errors.email}*
            </Typography>
          </Stack>
          <Stack width="100%" spacing={0.25} pt={1}>
            <Input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) =>
                setForm((prev) => ({ ...prev, password: e.target.value }))
              }
              onKeyDown={handleKeyDown}
              sx={{
                ...inputStyles,
                border: errors.password
                  ? "2px solid lightblue"
                  : "1px solid #ccc",
                color: "white",
              }}
              disableUnderline
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
        <Stack
          alignSelf="center"
          height="30%"
          width="100%"
          p={3}
          paddingInline={0}
          spacing={1.5}
        >
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: "black",
              color: "lightblue",
              border: "1.5px solid lightblue",
              borderRadius: 2,
            }}
          >
            Login
            <Login style={{ marginLeft: "2px", height: 16 }} />
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
