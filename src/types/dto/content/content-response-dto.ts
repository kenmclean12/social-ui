import type { ContentType } from "../../entities";

export interface ContentResponseDto {
  id: number;
  type: ContentType;
  url: string;
}
