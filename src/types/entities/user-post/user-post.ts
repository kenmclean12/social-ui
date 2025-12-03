import type { Comment } from "../comment";
import type { Content } from "../content";
import type { Like } from "../like";
import type { Reaction } from "../reaction";
import type { User } from "../user/user";

export interface UserPost {
  id: number;
  createdAt: Date;
  title?: string;
  textContent?: string;
  contents: Content[];
  creator: User;
  likes?: Like[];
  reactions?: Reaction[];
  comments?: Comment[];
  editedAt?: Date;
}
