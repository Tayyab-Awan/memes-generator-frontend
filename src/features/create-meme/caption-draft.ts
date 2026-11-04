import type { CaptionPosition } from "@/shared/api/types";
import { DEFAULT_CAPTION_COLOR, DEFAULT_FONT_SCALE } from "@/shared/constants";

export interface CaptionDraft {
  id: string;
  text: string;
  position: CaptionPosition;
  color: string;
  fontScale: number;
  touched: boolean;
}

export function newCaptionDraft(
  id: string,
  position: CaptionPosition,
): CaptionDraft {
  return {
    id,
    text: "",
    position,
    color: DEFAULT_CAPTION_COLOR,
    fontScale: DEFAULT_FONT_SCALE,
    touched: false,
  };
}

export function initialCaptionDrafts(): CaptionDraft[] {
  return [
    newCaptionDraft("caption-1", "top"),
    newCaptionDraft("caption-2", "bottom"),
  ];
}
