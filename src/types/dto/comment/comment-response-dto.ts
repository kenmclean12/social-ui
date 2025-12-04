import type { UserResponseDto } from "../user";

export interface CommentResponseDto {
  id: number;
  createdAt: Date;
  content: string;
  user: UserResponseDto;
  postId: number;
  parentCommentId?: number;
  replies?: CommentResponseDto[];
}
