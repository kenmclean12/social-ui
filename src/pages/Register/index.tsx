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
import { useSnackbar } from "notistack";
import { buttonStyles, inputStyles } from "./styles";
import { stepFields } from "./config";
import { type FormErrors, Step } from "./types";
import { nextStep, previousStep, update, validateStep } from "./utils";

export function RegisterPage() {
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const [step, setStep] = useState<Step>(Step.One);
  const [form, setForm] = useState<Omit<UserCreateDto, "age">>({
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    password: "",
    phoneNumber: "",
    description: "",
  });
  const [ageInput, setAgeInput] = useState<string>("");
  const [errors, setErrors] = useState<FormErrors>({});
  const { mutateAsync: registerUser } = useAuthRegister();

  const handleNext = () => {
    const validationErrors = validateStep(step, form, ageInput);
    if (validationErrors) {
      const firstKey = Object.keys(validationErrors)[0];
      const firstMessage = validationErrors[firstKey];
      setErrors({ [firstKey]: firstMessage });
      enqueueSnackbar(firstMessage, { variant: "warning" });
      return;
    }

    setErrors({});
    setStep((s) => nextStep(s));
  };

  const handleRegister = async () => {
    if (Object.keys(errors).length > 0) return;

    const age = Number(ageInput);
    const payload: UserCreateDto = { ...form, age };
    Object.keys(payload).forEach((key) => {
      const k = key as keyof UserCreateDto;
      if (payload[k] === "" || payload[k] === 0) delete payload[k];
    });

    await registerUser(payload);
    navigate("/", { replace: true });
  };

  const renderField = (field: {
    key: keyof UserCreateDto | "age";
    placeholder: string;
    type?: string;
  }) => {
    const value =
      field.key === "age"
        ? ageInput
        : form[field.key as keyof Omit<UserCreateDto, "age">];
    const setValue =
      field.key === "age"
        ? setAgeInput
        : (val: string) =>
            update(field.key as keyof Omit<UserCreateDto, "age">, val, setForm);
    const hasError = errors[field.key as keyof FormErrors];

    const handleChange = (raw: string) => {
      let formatted = raw;
      if (field.key === "phoneNumber") formatted = formatPhoneNumber(raw);
      setValue(formatted);
    };

    return (
      <Input
        key={field.key}
        placeholder={field.placeholder}
        value={value}
        type={field.type}
        onChange={(e) => handleChange(e.target.value)}
        sx={{
          ...inputStyles,
          border: hasError ? "2px solid lightblue" : "1px solid #ccc",
        }}
        fullWidth
        disableUnderline
      />
    );
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
        alignItems="center"
        width="50%"
        height="50%"
        minHeight="300px"
        minWidth="400px"
        maxHeight="400px"
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
          alignItems="center"
          justifyContent="center"
          height="10%"
          width="100%"
          spacing={1}
        >
          <Typography fontSize={24}>Register</Typography>
          <NightsStay sx={{ color: "lightblue" }} />
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="center"
          height="60%"
          width="100%"
          pt={2}
        >
          <Stack width="100%" spacing={2} pt={2}>
            {stepFields[step].map(renderField)}
          </Stack>
        </Stack>
        <Stack
          height="30%"
          width="100%"
          spacing={1.5}
          p={4.5}
          paddingInline={0}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={1.5}
            pt={step !== Step.One ? 0.5 : 0}
          >
            {step !== Step.One && (
              <Button
                className="back-btn"
                variant="contained"
                onClick={() => setStep(previousStep)}
                sx={{ ...buttonStyles }}
                fullWidth
              >
                <ArrowBackIos style={{ height: 16 }} />
                Back
              </Button>
            )}
            {step < Step.Three && (
              <Button
                variant="contained"
                onClick={handleNext}
                sx={{ ...buttonStyles }}
                fullWidth
              >
                Next
                <ArrowForwardIos style={{ height: 16 }} />
              </Button>
            )}
            {step === Step.Three && (
              <Button
                variant="contained"
                onClick={handleRegister}
                fullWidth
                sx={{ ...buttonStyles }}
              >
                Register
                <Check style={{ height: 16 }} />
              </Button>
            )}
          </Stack>
          {step === Step.One && (
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
