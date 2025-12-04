export interface PostResponseDto {
  id: number;
  textContent?: string;
  createdAt: Date;
  creatorId: number;
  commentCount: number;
  likeCount: number;
  reactionCount: number;
}
