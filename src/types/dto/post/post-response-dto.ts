import type { CommentResponseDto } from "../comment";
import type { LikeResponseDto } from "../like";
import type { ReactionResponseDto } from "../reaction";
import type { UserResponseDto } from "../user";

export interface PostResponseDto {
  id: number;
  textContent?: string;
  contentUrl?: string;
  createdAt: Date;
  creator: UserResponseDto;
  comments?: CommentResponseDto[];
  likes?: LikeResponseDto[];
  reactions?: ReactionResponseDto[];
}
