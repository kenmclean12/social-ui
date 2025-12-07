import type { UserCreateDto } from "../../types";
import { validations } from "./config";
import { Step } from "./types";

export const nextStep = (s: Step): Step => Math.min(s + 1, Step.Three);

export const previousStep = (s: Step): Step => Math.max(s - 1, Step.One);

export const update = <K extends keyof UserCreateDto>(
  key: K,
  value: UserCreateDto[K],
  setForm: React.Dispatch<React.SetStateAction<Omit<UserCreateDto, "age">>>
) => {
  setForm((prev) => ({ ...prev, [key]: value }));
};

export function validateStep(
  step: Step,
  form: Omit<UserCreateDto, "age">,
  ageInput: string
) {
  const rules = validations[step];
  const errors: Record<string, string> = {};

  for (const rule of rules) {
    const [field, ...checks] = rule.split("|");
    const value = field === "age" ? ageInput : form[field as keyof typeof form];

    for (const check of checks) {
      if (check === "required" && !value) {
        errors[field] = `${field} is required`;
      }

      if (check === "number") {
        const n = Number(value);
        if (isNaN(n) || n <= 0) {
          errors[field] = `${field} must be a valid number`;
        }
      }

      if (check === "email") {
        const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value ?? "");
        if (!valid) {
          errors[field] = "Please enter a valid email";
        }
      }
    }
  }

  return Object.keys(errors).length > 0 ? errors : null;
}
