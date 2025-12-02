import type { Message, UserPost } from "../../entities";
import type { SafeUserDto } from "../user";
import type { NotificationType } from "./notification-create-dto";

export interface SafeNotificationDto {
  id: number;
  recipient: SafeUserDto;
  actionUser: SafeUserDto;
  type: NotificationType;
  post?: UserPost;
  comment?: Comment;
  message?: Message;
  read: boolean;
  createdAt: string;
}