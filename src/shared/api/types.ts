import type { CAPTION_POSITIONS } from "@/shared/constants";

export type CaptionPosition = (typeof CAPTION_POSITIONS)[number];

export interface Caption {
  text: string;
  position: CaptionPosition;
  color?: string;
  fontScale?: number;
}

export type MemeStatus = "pending" | "ready" | "failed";

export interface Meme {
  id: string;
  imageUrl: string;
  width: number;
  height: number;
  captions: Caption[];
  status: MemeStatus;
  createdAt: string;
}

export interface PaginatedMemes {
  items: Meme[];
  nextCursor: string | null;
}
