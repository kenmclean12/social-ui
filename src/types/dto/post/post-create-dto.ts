import type { ContentCreateDto } from "../content";

export interface PostCreateDto {
  userId: number;
  title?: string;
  textContent?: string;
  attachments?: ContentCreateDto[];
}
