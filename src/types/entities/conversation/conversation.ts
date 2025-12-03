import type { Message } from "../message";
import type { User } from "../user";

export interface Conversation {
  id: number;
  createdAt: Date;
  name?: string;
  initiator: User;
  participants: User[];
  messages: Message[];
  closed: boolean;
}
