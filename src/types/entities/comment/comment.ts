import type { Like } from "../like";
import type { Reaction } from "../reaction";
import type { User } from "../user";
import type { UserPost } from "../user-post";

export interface Comment {
  id: number;
  createdAt: Date;
  user: User;
  post: UserPost;
  likes?: Like[];
  reactions?: Reaction[];
  replies?: Comment[];
  content: string;
}