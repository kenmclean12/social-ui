import type { Content } from "../content";
import type { Conversation } from "../conversation/conversation";
import type { Like } from "../like";
import type { Reaction } from "../reaction";
import type { User } from "../user";
import type { MessageRead } from "./message-read";

export interface Message {
  id: number;
  createdAt: Date;
  content: string;
  attachments: Content[];
  sender: User;
  conversation: Conversation;
  reads: MessageRead[];
  likes?: Like[];
  reactions: Reaction[];
  editedAt?: Date;
  isDeleted: boolean;
}