import type { UserResponseDto } from "../user";

export interface TokenResponseDto {
  access_token: string;
  refresh_token: string;
  user: UserResponseDto;
}
