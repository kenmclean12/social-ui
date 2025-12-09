import type { LikeResponseDto } from "../like";
import type { ReactionResponseDto } from "../reaction";
import type { UserResponseDto } from "../user";

export interface CommentResponseDto {
  id: number;
  createdAt: Date;
  content: string;
  user: UserResponseDto;
  postId: number;
  parentCommentId?: number;
  likes?: LikeResponseDto[];
  reactions?: ReactionResponseDto[];
  replies?: CommentResponseDto[];
}
