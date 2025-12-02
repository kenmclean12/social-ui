export const NotificationType = {
  FOLLOW: "FOLLOW",
  LIKE: "LIKE",
  REACT: "REACT",
  COMMENT: "COMMENT",
  MESSAGE: "MESSAGE",
} as const;

export type NotificationType = typeof NotificationType[keyof typeof NotificationType];

export interface NotificationCreateDto {
  recipientId: number;
  actorId: number;
  type: NotificationType;
  postId?: number;
  commentId?: number;
  messageId?: number;
}
