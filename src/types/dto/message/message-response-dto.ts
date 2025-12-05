import type { UserResponseDto } from "../user";
import type { MessageReadResponseDto } from "./message-read-response-dto";

export interface MessageResponseDto {
  id: number;
  createdAt: Date;
  content: string;
  sender: UserResponseDto;
  conversationId: number;
  reads?: MessageReadResponseDto[];
  editedAt?: Date;
  isDeleted?: boolean;
}
