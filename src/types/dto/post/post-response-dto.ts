import type { ContentResponseDto } from "../content";

export interface PostResponseDto {
  id: number;
  title: string;
  createdAt: Date;
  contents: ContentResponseDto[];
  creatorId: number;
  commentCount: number;
  likeCount: number;
  reactionCount: number;
}
