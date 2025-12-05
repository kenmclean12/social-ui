import type { UserResponseDto } from "../user";

export interface MessageReadResponseDto {
  id: number;
  messageId: number;
  user: UserResponseDto;
  readAt: Date;
}
