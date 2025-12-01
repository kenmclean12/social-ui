export interface UserCreateDto {
  firstName: string;
  lastName: string;
  userName: string;
  age: number;
  email: string;
  password: string;

  phoneNumber?: string;
  description?: string;
  avatarUrl?: string;
}
