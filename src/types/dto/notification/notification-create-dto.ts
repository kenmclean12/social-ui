export const NotificationType = {
  FOLLOW: "FOLLOW",

  POST_LIKE: "POST_LIKE",
  POST_COMMENT: "POST_COMMENT",
  POST_REACTION: "POST_REACTION",

  COMMENT_LIKE: "COMMENT_LIKE",
  COMMENT_REACTION: "COMMENT_REACTION",
  COMMENT_REPLY: "COMMENT_REPLY",

  MESSAGE_LIKE: "MESSAGE_LIKE",
  MESSAGE_REACTION: "MESSAGE_REACTION",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

export interface NotificationCreateDto {
  recipientId: number;
  actorId: number;
  type: NotificationType;
  postId?: number;
  commentId?: number;
  messageId?: number;
}
