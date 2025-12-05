export interface ConversationCreateDto {
  initiatorId: number;
  recipientIds: number[];
  name?: string;
}
