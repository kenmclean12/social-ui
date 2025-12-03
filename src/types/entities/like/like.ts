import type { Comment } from "../comment";
import type { Message } from "../message";
import type { User } from "../user";
import type { UserPost } from "../user-post";

export interface Like {
  id: number;
  user: User;
  message?: Message;
  post?: UserPost;
  comment?: Comment;
  createdAt: Date;
}
