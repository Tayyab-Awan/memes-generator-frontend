export const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;
export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
] as const;

export const CAPTION_POSITIONS = ["top", "center", "bottom"] as const;
export const MIN_CAPTIONS = 1;
export const MAX_CAPTIONS = 5;
export const MAX_CAPTION_LENGTH = 200;
export const MIN_FONT_SCALE = 0.5;
export const MAX_FONT_SCALE = 2;
export const FONT_SCALE_STEP = 0.1;
export const DEFAULT_FONT_SCALE = 1;
export const DEFAULT_CAPTION_COLOR = "#FFFFFF";
export const HEX_COLOR_PATTERN = /^#([0-9a-f]{3}|[0-9a-f]{6})$/i;

export const GALLERY_PAGE_SIZE = 20;

export const CREATE_RATE_LIMIT_PER_MINUTE = 10;
