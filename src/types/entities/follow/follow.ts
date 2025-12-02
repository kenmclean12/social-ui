import type { User } from "../user";

export interface Follow {
  id: number;
  createdAt: Date;
  follower: User;
  following: User;
}