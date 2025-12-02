export interface UserCreateDto {
  firstName: string;
  lastName: string;
  userName: string;
  age: number;
  phoneNumber?: string;
  email: string;
  password: string;

  description?: string;
  avatarUrl?: string;
}
