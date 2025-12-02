import type { Comment } from "../comment";
import type { Message } from "../message";
import type { User } from "../user";
import type { UserPost } from "../user-post";

export interface Reaction {
  id: number;
  user: User;
  reaction: string;
  message?: Message;
  post?: UserPost;
  comment?: Comment;
  createdAt: Date;
}