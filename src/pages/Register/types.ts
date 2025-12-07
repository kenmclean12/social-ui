export enum Step {
  One = 1,
  Two = 2,
  Three = 3,
}

export interface FormErrors {
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  password?: string;
  age?: string;
}
