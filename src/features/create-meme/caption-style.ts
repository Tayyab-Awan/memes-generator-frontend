import { DEFAULT_CAPTION_COLOR, HEX_COLOR_PATTERN } from "@/shared/constants";

const DARK_LUMINANCE_THRESHOLD = 0.4;

function expandHex(hex: string): string {
  const digits = hex.slice(1);
  return digits.length === 3
    ? digits
        .split("")
        .map((digit) => digit + digit)
        .join("")
    : digits;
}

export function relativeLuminance(hex: string): number {
  const full = expandHex(hex);
  const [r, g, b] = [0, 2, 4].map(
    (index) => parseInt(full.slice(index, index + 2), 16) / 255,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function captionColors(color: string | undefined): {
  fill: string;
  stroke: string;
} {
  const fill =
    color && HEX_COLOR_PATTERN.test(color) ? color : DEFAULT_CAPTION_COLOR;
  const stroke =
    relativeLuminance(fill) < DARK_LUMINANCE_THRESHOLD ? "#FFFFFF" : "#000000";
  return { fill, stroke };
}
