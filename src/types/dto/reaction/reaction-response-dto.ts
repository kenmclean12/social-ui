import type { SafeUserDto } from "../user";

export interface ReactionResponseDto {
  id: number;
  user: SafeUserDto;
  reaction: string;
  messageId?: string;
  postId?: string;
  commentId?: string;
  createdAt: Date;
}
