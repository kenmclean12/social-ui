import type { ContentCreateDto } from "../content";

export interface PostUpdateDto {
  title?: string;
  textContent?: string;
  attachments?: ContentCreateDto[];
}