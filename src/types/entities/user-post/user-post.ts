import type { Comment } from "../comment";
import type { Like } from "../like";
import type { Reaction } from "../reaction";
import type { User } from "../user/user";

export interface UserPost {
  id: number;
  createdAt: Date;
  textContent?: string;
  creator: User;
  likes?: Like[];
  reactions?: Reaction[];
  comments?: Comment[];
  editedAt?: Date;
}
