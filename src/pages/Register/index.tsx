import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Stack, Input, Button, Typography } from "@mui/material";
import {
  NightsStay,
  ArrowBackIos,
  ArrowForwardIos,
  Check,
} from "@mui/icons-material";
import type { UserCreateDto } from "../../types";
import { useAuthRegister } from "../../hooks";
import { formatPhoneNumber } from "../../utils";

type Step = 1 | 2 | 3;

interface FormErrors {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  password?: string;
  age?: string;
}

const inputStyles = {
  height: 40,
  padding: "0 12px",
  fontSize: 14,
  lineHeight: "40px",
  borderRadius: 2,
  "&::placeholder": { opacity: 0.7 },
};

export function RegisterPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>(1);
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
  const { mutateAsync: registerUser } = useAuthRegister();

  function update<K extends keyof UserCreateDto>(
    key: K,
    value: UserCreateDto[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const handleNext = () => {
    const newErrors: FormErrors = {};

    if (step === 1) {
      const age = Number(ageInput);
      if (!ageInput || isNaN(age) || age <= 0)
        newErrors.age = "A valid age is required";
      if (!form.firstName) newErrors.firstName = "First name is required";
      if (!form.lastName) newErrors.lastName = "Last name is required";
    }

    if (step === 2) {
      if (!form.userName) newErrors.userName = "Username is required";
      if (!form.email) newErrors.email = "Email is required";
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
        newErrors.email = "Please enter a valid email address";
      if (!form.password) newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length === 0) setStep((step + 1) as Step);
  };

  const handleRegister = async () => {
    const newErrors: FormErrors = {};
    const age = Number(ageInput);

    if (!ageInput || isNaN(age) || age <= 0)
      newErrors.age = "A valid age is required";

    if (!form.userName) newErrors.userName = "Username is required";
    if (!form.email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!form.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    const payload: UserCreateDto = { ...form, age };
    Object.keys(payload).forEach((key) => {
      const k = key as keyof UserCreateDto;
      if (payload[k] === "" || payload[k] === 0) delete payload[k];
    });

    await registerUser(payload);
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
        height="50%"
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
          height="10%"
          width="100%"
        >
          <Typography fontSize={24}>Register</Typography>
          <NightsStay sx={{ color: "lightblue" }} />
        </Stack>
        <Stack alignItems="center" justifyContent="center" height="55%" pt={3}>
          <Stack width="100%" spacing={2} pt={2}>
            {step === 1 && (
              <>
                <Input
                  placeholder="First Name"
                  value={form.firstName}
                  onChange={(e) => update("firstName", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.firstName
                      ? "2px solid lightblue"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                  disableUnderline
                />
                <Input
                  placeholder="Last Name"
                  value={form.lastName}
                  onChange={(e) => update("lastName", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.lastName
                      ? "2px solid lightblue"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                  disableUnderline
                />
                <Input
                  placeholder="Age"
                  value={ageInput}
                  onChange={(e) => setAgeInput(e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.age
                      ? "2px solid lightblue"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                  disableUnderline
                />
              </>
            )}
            {step === 2 && (
              <>
                <Input
                  placeholder="Username"
                  value={form.userName}
                  onChange={(e) => update("userName", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.userName
                      ? "2px solid lightblue"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                  disableUnderline
                />
                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => update("email", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.email
                      ? "2px solid lightblue"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                  disableUnderline
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: errors.password
                      ? "2px solid lightblue"
                      : "1px solid #ccc",
                    color: "white",
                  }}
                  disableUnderline
                />
              </>
            )}
            {step === 3 && (
              <Stack spacing={3}>
                <Input
                  placeholder="Phone Number (optional)"
                  value={form.phoneNumber}
                  onChange={(e) =>
                    update("phoneNumber", formatPhoneNumber(e.target.value))
                  }
                  sx={{
                    ...inputStyles,
                    border: "1px solid #ccc",
                    color: "white",
                  }}
                  disableUnderline
                />
                <Input
                  placeholder="Description (optional)"
                  value={form.description}
                  onChange={(e) => update("description", e.target.value)}
                  sx={{
                    ...inputStyles,
                    border: "1px solid #ccc",
                    color: "white",
                  }}
                  disableUnderline
                />
              </Stack>
            )}
          </Stack>
        </Stack>
        <Stack
          alignSelf="center"
          height="30%"
          width="100%"
          p={5.5}
          paddingInline={0}
          spacing={1.5}
        >
          <Stack
            direction="row"
            spacing={1.5}
            justifyContent="space-between"
            pt={step > 1 ? 1 : 0}
          >
            {step > 1 && (
              <Button
                variant="contained"
                onClick={() => setStep((step - 1) as Step)}
                fullWidth
                startIcon={
                  <ArrowBackIos style={{ marginRight: "-5px", height: 16 }} />
                }
                sx={{
                  backgroundColor: "black",
                  color: "lightblue",
                  border: "1.5px solid lightblue",
                  borderRadius: 2,
                }}
              >
                Back
              </Button>
            )}
            {step < 3 && (
              <Button
                variant="contained"
                onClick={handleNext}
                fullWidth
                endIcon={
                  <ArrowForwardIos style={{ marginLeft: "-5px", height: 16 }} />
                }
                sx={{
                  backgroundColor: "black",
                  color: "lightblue",
                  border: "1.5px solid lightblue",
                  borderRadius: 2,
                }}
              >
                Next
              </Button>
            )}
            {step === 3 && (
              <Button
                variant="contained"
                onClick={handleRegister}
                fullWidth
                endIcon={<Check style={{ marginLeft: "-2px", height: 20 }} />}
                sx={{
                  backgroundColor: "black",
                  color: "lightblue",
                  border: "1.5px solid lightblue",
                  borderRadius: 2,
                }}
              >
                Register
              </Button>
            )}
          </Stack>
          {step === 1 && (
            <Typography align="center" fontSize={12}>
              Already have an account?{" "}
              <Link to="/login" style={{ color: "lightblue" }}>
                Login
              </Link>
            </Typography>
          )}
        </Stack>
      </Stack>
    </Stack>
  );
}
