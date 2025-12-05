import type { MessageResponseDto } from "../message/message-response-dto";
import type { UserResponseDto } from "../user";

export interface ConversationResponseDto {
  id: number;
  name: string;
  closed: boolean;
  initiator: UserResponseDto;
  participants: UserResponseDto[];
  messages: MessageResponseDto[];
}
