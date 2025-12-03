export interface PostResponseDto {
  id: number;
  title?: string;
  textContent?: string;
  createdAt: Date;
  creatorId: number;
  commentCount: number;
  likeCount: number;
  reactionCount: number;
}
