import type { Message } from "../message";
import type { UserPost } from "../user-post";

export const ContentType = {
  IMAGE: 'image',
  VIDEO: 'video',
  GIF: 'gif',
  AUDIO: 'audio',
  FILE: 'file',
} as const;

export type ContentType = typeof ContentType[keyof typeof ContentType];

export interface Content {
  id: number;
  type: ContentType;
  data: string;
  message?: Message;
  post?: UserPost;
  createdAt: Date;
}