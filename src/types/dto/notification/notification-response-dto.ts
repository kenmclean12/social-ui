import type { Message, UserPost } from "../../entities";
import type { UserResponseDto } from "../user";
import type { NotificationType } from "./notification-create-dto";

export interface NotificationResponseDto {
  id: number;
  recipient: UserResponseDto;
  actionUser: UserResponseDto;
  type: NotificationType;
  post?: UserPost;
  comment?: Comment;
  message?: Message;
  read: boolean;
  createdAt: string;
}
