import type { CommentResponseDto } from "../comment";
import type { MessageResponseDto } from "../message";
import type { PostResponseDto } from "../post";
import type { UserResponseDto } from "../user";
import type { NotificationType } from "./notification-create-dto";

export interface NotificationResponseDto {
  id: number;
  recipient: UserResponseDto;
  actionUser: UserResponseDto;
  notificationMessage: string;
  type: NotificationType;
  post?: PostResponseDto;
  comment?: CommentResponseDto;
  message?: MessageResponseDto;
  read: boolean;
  createdAt: string;
}
