import { useState } from "react";
import { Stack, Input, Button, Typography } from "@mui/material";
import { ArrowForwardIos, ArrowBackIos, Check } from "@mui/icons-material";
import { useNavigate, Link } from "react-router-dom";
import type { UserCreateDto } from "../../types";
import { useAuthRegister } from "../../hooks/auth";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  password?: string;
  age?: string;
}

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [ageInput, setAgeInput] = useState<string>("");
  const [form, setForm] = useState<Omit<UserCreateDto, "age">>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    description: "",
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const { mutateAsync: register } = useAuthRegister();

  function update<K extends keyof UserCreateDto>(
    key: K,
    value: UserCreateDto[K]
  ) {
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

  const handleNext = () => {
    const newErrors: FormErrors = {};

    if (step === 0) {
      const age = Number(ageInput);
      if (!ageInput || isNaN(age) || age <= 0)
        newErrors.age = "A valid age is required";
      if (!form.firstName) newErrors.firstName = "First name is required";
      if (!form.lastName) newErrors.lastName = "Last name is required";
    }

    if (step === 1) {
      if (!form.userName) newErrors.userName = "Username is required";
      if (!form.email) newErrors.email = "Email is required";
      if (!form.password) newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep(step + 1);
  };

  const handleRegister = async () => {
    const newErrors: FormErrors = {};
    const age = Number(ageInput);
    if (!ageInput || isNaN(age) || age <= 0)
      newErrors.age = "A valid age is required";
    if (!form.email) {
      newErrors.email = "Please enter your email";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.userName) newErrors.userName = "Username is required";
    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) return;

    const payload: UserCreateDto = { ...form, age };
    Object.keys(payload).forEach((k) => {
      const key = k as keyof UserCreateDto;
      if (payload[key] === "" || payload[key] === 0) delete payload[key];
    });

    try {
      await register(payload);
      navigate("/", { replace: true });
    } catch {
      setSubmitError("Login failed, invalid credentials provided");
    }
  };

  return (
    <Stack
      alignItems="center"
      justifyContent="center"
      height="100vh"
      width="100vw"
      sx={{ backgroundColor: "rgba(0, 20, 57, 0.4)" }}
    >
      <Stack
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
          Register
        </Typography>

        <Stack spacing={2} mt={5}>
          {step === 0 && (
            <>
              <Stack spacing={0.5}>
                <Input
                  disableUnderline
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.firstName
                      ? "1px solid red"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                />
                <Typography
                  fontSize={11}
                  color="red"
                  visibility={errors.firstName ? "visible" : "hidden"}
                >
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
                    border: errors.lastName
                      ? "1px solid red"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                />
                <Typography
                  fontSize={11}
                  color="red"
                  visibility={errors.lastName ? "visible" : "hidden"}
                >
                  {errors.lastName}
                </Typography>
              </Stack>

              <Stack spacing={0.5}>
                <Input
                  disableUnderline
                  placeholder="Age"
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.age ? "1px solid red" : "1px solid #ccc",
                    color: "white",
                  }}
                />
                <Typography
                  fontSize={11}
                  color="red"
                  visibility={errors.age ? "visible" : "hidden"}
                >
                  {errors.age}
                </Typography>
              </Stack>
            </>
          )}

          {step === 1 && (
            <>
              <Stack spacing={0.5}>
                <Input
                  disableUnderline
                  placeholder="Username"
                  value={form.userName}
                  onChange={(e) => update("userName", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.userName
                      ? "1px solid red"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                />
                <Typography
                  fontSize={11}
                  color="red"
                  visibility={errors.userName ? "visible" : "hidden"}
                >
                  {errors.userName}
                </Typography>
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
                  onChange={(e) => update("password", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.password
                      ? "1px solid red"
                      : "1px solid #ccc",
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
            </>
          )}

          {step === 2 && (
            <>
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
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: "1px solid #ccc",
                    color: "white",
                  }}
                />
              </Stack>
            </>
          )}
          <Typography
            align="center"
            fontSize={11}
            color="red"
            visibility={submitError ? "visible" : "hidden"}
            mt={1.5}
          >
            {submitError}*
          </Typography>
        </Stack>

        <Stack alignSelf="center" width="100%" spacing={3} mt={2}>
          <Stack direction="row" spacing={3} justifyContent="space-between">
            {step > 0 && (
              <Button
                variant="contained"
                onClick={() => setStep(step - 1)}
                fullWidth
                startIcon={<ArrowBackIos style={{ height: 16 }} />}
              >
                Back
              </Button>
            )}
            {step < 2 && (
              <Button
                variant="contained"
                onClick={handleNext}
                fullWidth
                endIcon={<ArrowForwardIos style={{ height: 16 }} />}
              >
                Next
              </Button>
            )}
            {step === 2 && (
              <Button
                variant="contained"
                onClick={handleRegister}
                fullWidth
                endIcon={<Check style={{ height: 16 }} />}
              >
                Register
              </Button>
            )}
          </Stack>
          <Typography align="center" fontSize={12}>
            Already a user?{" "}
            <Link to="/login" style={{ color: "#1976D2" }}>
              Login
            </Link>
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
}
