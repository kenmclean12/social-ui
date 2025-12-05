import type { MessageResponseDto } from "../message/message-response-dto";
import type { ConversationResponseDto } from "./conversation-response-dto";

export interface InitiateConversationResponseDto {
  conversation: ConversationResponseDto;
  firstMessage: MessageResponseDto;
}
