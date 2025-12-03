import type { ContentType } from "../../entities";

export interface ContentCreateDto {
  messageId?: number;
  postId?: number;
  type: ContentType;
  data: File;
  filename?: string;
}
