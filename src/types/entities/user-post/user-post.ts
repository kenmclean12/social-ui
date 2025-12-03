import type { Content } from "../content";

export interface UserPost {
  id: number;
  createdAt: Date;
  title?: string;
  contents: Content[];
}
