import type { SafeUserDto } from "../user";

export interface SafeFollowDto {
  id: number;
  createdAt: string;
  follower: SafeUserDto;
  following: SafeUserDto;
}
