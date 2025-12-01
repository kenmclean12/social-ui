import { useState } from "react";
import { Stack, Input, Button, Typography } from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import type { UserCreateDto } from "../types";
import { useAuthRegister } from "../hooks/auth";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  password?: string;
  age?: string;
};

export function RegisterPage() {
  const navigate = useNavigate();
  const { mutateAsync: register } = useAuthRegister();

  const [age, setAge] = useState<number | undefined>(undefined);
  const [form, setForm] = useState<Omit<UserCreateDto, "age">>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    description: "",
    avatarUrl: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});

  function update<K extends keyof UserCreateDto>(key: K, value: UserCreateDto[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const inputStyles = {
    height: 40,
    padding: "0 12px",
    fontSize: 14,
    lineHeight: "40px",
    borderRadius: 2,
    "&::placeholder": { opacity: 0.7 },
  };

  const handleRegister = async () => {
    const newErrors: typeof errors = {};
    if (!form.firstName) newErrors.firstName = "First name is required";
    if (!form.lastName) newErrors.lastName = "Last name is required";
    if (!form.userName) newErrors.userName = "Username is required";
    if (!form.email) newErrors.email = "Email is required";
    if (!form.password) newErrors.password = "Password is required";
    if (!age) newErrors.age = "Age is required";

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;
    if (!age) return;

    const payload: UserCreateDto = { ...form, age };
    Object.keys(payload).forEach((k) => {
      const key = k as keyof UserCreateDto;
      if (payload[key] === "" || payload[key] === 0) delete payload[key];
    });

    try {
      await register(payload);
      navigate("/", { replace: true });
    } catch {
      setErrors({ password: "Registration failed" });
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      sx={{ backgroundColor: "rgba(205, 223, 255, 0.8)" }}
    >
      <Stack
        minHeight="400px"
        width="100%"
        maxWidth="400px"
        minWidth="400px"
        spacing={3}
        padding={4}
        color="white"
        borderRadius="16px"
        sx={{ backgroundColor: "black" }}
      >
        <Typography align="center" fontSize={22}>
          Register
        </Typography>

        <Stack spacing={2}>
          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="First Name"
              value={form.firstName}
              onChange={(e) => update("firstName", e.target.value)}
              sx={{
                ...inputStyles,
                border: errors.firstName ? "1px solid red" : "1px solid #ccc",
                color: "white",
              }}
            />
            <Typography fontSize={11} color="red" visibility={errors.firstName ? "visible" : "hidden"}>
              {errors.firstName}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="Last Name"
              value={form.lastName}
              onChange={(e) => update("lastName", e.target.value)}
              sx={{
                ...inputStyles,
                border: errors.lastName ? "1px solid red" : "1px solid #ccc",
                color: "white",
              }}
            />
            <Typography fontSize={11} color="red" visibility={errors.lastName ? "visible" : "hidden"}>
              {errors.lastName}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="Username"
              value={form.userName}
              onChange={(e) => update("userName", e.target.value)}
              sx={{
                ...inputStyles,
                border: errors.userName ? "1px solid red" : "1px solid #ccc",
                color: "white",
              }}
            />
            <Typography fontSize={11} color="red" visibility={errors.userName ? "visible" : "hidden"}>
              {errors.userName}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Input
              disableUnderline
              type="number"
              placeholder="Age"
              value={age ?? ""}
              onChange={(e) => setAge(Number(e.target.value))}
              sx={{
                ...inputStyles,
                border: errors.age ? "1px solid red" : "1px solid #ccc",
                color: "white",
              }}
            />
            <Typography fontSize={11} color="red" visibility={errors.age ? "visible" : "hidden"}>
              {errors.age}
            </Typography>
          </Stack>

          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="Phone Number"
              value={form.phoneNumber}
              onChange={(e) => update("phoneNumber", e.target.value)}
              sx={{
                ...inputStyles,
                border: "1px solid #ccc",
                color: "white",
              }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="Email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
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
              onChange={(e) => update("password", e.target.value)}
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

          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="Avatar URL (optional)"
              value={form.avatarUrl}
              onChange={(e) => update("avatarUrl", e.target.value)}
              sx={{ ...inputStyles, border: "1px solid #ccc", color: "white" }}
            />
          </Stack>

          <Stack spacing={0.5}>
            <Input
              disableUnderline
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              sx={{ ...inputStyles, border: "1px solid #ccc", color: "white" }}
            />
          </Stack>
        </Stack>

        <Stack alignSelf="center" width="100%" spacing={3} mt={1}>
          <Button variant="contained" onClick={handleRegister}>
            Register
          </Button>
          <Typography align="center" fontSize={12}>
            Already a user? <Link to="/login" style={{ color: '#1976D2' }}>Login</Link>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
