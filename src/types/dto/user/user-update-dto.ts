export interface UserUpdateDto {
  firstName?: string;
  lastName?: string;
  userName?: string;
  age?: number;
  phoneNumber?: string;
  email?: string;
  description?: string;
  avatarUrl?: string;
  hashedRefreshToken?: string | null;
}
