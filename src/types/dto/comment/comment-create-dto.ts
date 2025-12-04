export interface CommentCreateDto {
  userId: number;
  postId: number;
  parentCommentId?: number;
  content: string;
}
