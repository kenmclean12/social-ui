import type { UserResponseDto } from "../user";

export interface ReactionResponseDto {
  id: number;
  user: UserResponseDto;
  reaction: string;
  messageId?: string;
  postId?: string;
  commentId?: string;
  createdAt: Date;
}
