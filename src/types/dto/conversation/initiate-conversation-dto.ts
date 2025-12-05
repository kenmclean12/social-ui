import type { NoConversationMessageDto } from "../message";
import type { ConversationCreateDto } from "./conversation-create-dto";

export interface InitiateConversationDto {
  conversation: ConversationCreateDto;
  firstMessage: NoConversationMessageDto;
}
