export interface LikeResponseDto {
  id: number;
  userId: number;
  messageId?: number;
  postId?: number;
  commentId?: number;
  createdAt: Date;
}
