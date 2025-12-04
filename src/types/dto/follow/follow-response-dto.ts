import type { UserResponseDto } from "../user";

export interface FollowResponseDto {
  id: number;
  createdAt: string;
  follower: UserResponseDto;
  following: UserResponseDto;
}
