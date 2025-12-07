import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stack, Input, Button, Typography } from "@mui/material";
import { Login, NightsStay } from "@mui/icons-material";
import type { LoginDto } from "../../types";
import { useAuthLogin } from "../../hooks";
import { useSnackbar } from "notistack";
import type { Errors } from "./types";
import { validateLogin } from "./utils";
import {
  authButtonStyles,
  authInnerContainerStyles,
  authInputStyles,
} from "../styles";

export function LoginPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [form, setForm] = useState<LoginDto>({ email: "", password: "" });
  const [errors, setErrors] = useState<Errors>({
    email: false,
    password: false,
  });
  const { mutateAsync: loginUser } = useAuthLogin();

  const handleLogin = async () => {
    const error = validateLogin(form);
    if (error) {
      setErrors({
        email: error.field === "email",
        password: error.field === "password",
      });
      enqueueSnackbar(error.message, { variant: "warning" });
      return;
    }

    setErrors({ email: false, password: false });
    await loginUser(form);
    navigate("/", { replace: true });
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      sx={{ backgroundColor: "black" }}
    >
      <Stack
        width="50%"
        height="45%"
        minHeight="400px"
        minWidth="400px"
        maxHeight="400px"
        maxWidth="500px"
        padding={4}
        color="white"
        border="2px solid lightblue"
        borderRadius="16px"
        sx={authInnerContainerStyles}
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
        <Stack
          alignItems="center"
          justifyContent="center"
          height="55%"
          spacing={3}
          pt={2}
        >
          <Input
            placeholder="Email"
            value={form.email}
            onChange={(e) =>
              setForm((prev) => ({
                ...prev,
                email: e.target.value,
              }))
            }
            sx={{
              ...authInputStyles,
              border: errors.email ? "2px solid lightblue" : "1px solid #ccc",
            }}
            disableUnderline
            fullWidth
          />
          <Input
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            sx={{
              ...authInputStyles,
              border: errors.password
                ? "2px solid lightblue"
                : "1px solid #ccc",
            }}
            fullWidth
            disableUnderline
          />
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
            sx={authButtonStyles}
          >
            Login
            <Login style={{ height: 16 }} />
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
