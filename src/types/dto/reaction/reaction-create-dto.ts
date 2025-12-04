export interface ReactionCreateDto {
  userId: number;
  reaction: string;
  messageId?: number;
  postId?: number;
  commentId?: number;
}
