import type { User } from "../user";
import type { Message } from "./Message";

export interface MessageRead {
  id: number;
  message: Message;
  user: User;
  readAt: Date;
}