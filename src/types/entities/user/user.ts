import type { Conversation } from "../conversation/conversation";
import type { Follow } from "../follow/follow";
import type { Message } from "../message";
import type { UserPost } from "../user-post";

export interface User {
  id: number;
  createdAt: Date;
  firstName: string;
  lastName: string;
  userName: string;
  age: number;
  phoneNumber?: string;
  email: string;
  hashedPassword: string;
  description?: string;
  avatarUrl: string | null;
  posts: UserPost[];
  following: Follow[];
  followers: Follow[];
  sentMessages: Message[];
  inititatedConversations: Conversation[];
  participatingConversations: Conversation[];
}