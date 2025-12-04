import type { UserResponseDto } from "../user";

export interface SafeFollowDto {
  id: number;
  createdAt: string;
  follower: UserResponseDto;
  following: UserResponseDto;
}
