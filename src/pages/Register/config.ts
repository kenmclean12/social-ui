import type { UserCreateDto } from "../../types";
import { Step } from "./types";

export const stepFields: Record<
  Step,
  Array<{
    key: keyof UserCreateDto | "age";
    placeholder: string;
    type?: string;
  }>
> = {
  [Step.One]: [
    { key: "firstName", placeholder: "First Name" },
    { key: "lastName", placeholder: "Last Name" },
    { key: "age", placeholder: "Age" },
  ],
  [Step.Two]: [
    { key: "userName", placeholder: "Username" },
    { key: "email", placeholder: "Email" },
    { key: "password", placeholder: "Password", type: "password" },
  ],
  [Step.Three]: [
    { key: "phoneNumber", placeholder: "Phone Number (optional)" },
    { key: "description", placeholder: "Description (optional)" },
  ],
};

export const validations: Record<Step, Array<string>> = {
  [Step.One]: [
    "firstName|required",
    "lastName|required",
    "age|required|number",
  ],
  [Step.Two]: [
    "userName|required",
    "email|required|email",
    "password|required",
  ],
  [Step.Three]: [],
};
