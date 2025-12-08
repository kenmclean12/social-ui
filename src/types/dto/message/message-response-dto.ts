import type { LikeResponseDto } from "../like";
import type { ReactionResponseDto } from "../reaction";
import type { UserResponseDto } from "../user";
import type { MessageReadResponseDto } from "./message-read-response-dto";

export interface MessageResponseDto {
  id: number;
  createdAt: Date;
  content: string;
  sender: UserResponseDto;
  conversationId: number;
  reads?: MessageReadResponseDto[];
  likes?: LikeResponseDto[];
  reactions?: ReactionResponseDto[];
  editedAt?: Date;
  isDeleted?: boolean;
}
