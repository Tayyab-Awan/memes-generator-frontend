import { z } from "zod";
import {
  ALLOWED_IMAGE_TYPES,
  CAPTION_POSITIONS,
  HEX_COLOR_PATTERN,
  MAX_CAPTION_LENGTH,
  MAX_CAPTIONS,
  MAX_FONT_SCALE,
  MAX_UPLOAD_BYTES,
  MIN_CAPTIONS,
  MIN_FONT_SCALE,
} from "@/shared/constants";

const allowedTypes: readonly string[] = ALLOWED_IMAGE_TYPES;

export const imageFileSchema = z
  .instanceof(File, { message: "Choose an image." })
  .refine((file) => allowedTypes.includes(file.type), {
    message: "Use a JPEG, PNG, WebP or GIF image.",
    abort: true,
  })
  .refine((file) => file.size > 0, {
    message: "That file is empty.",
    abort: true,
  })
  .refine((file) => file.size <= MAX_UPLOAD_BYTES, {
    message: `The image must be ${MAX_UPLOAD_BYTES / 1024 / 1024} MB or smaller.`,
  });

export const captionSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, "Caption text can't be empty.")
    .max(
      MAX_CAPTION_LENGTH,
      `Captions can be at most ${MAX_CAPTION_LENGTH} characters.`,
    ),
  position: z.enum(CAPTION_POSITIONS),
  color: z
    .string()
    .regex(HEX_COLOR_PATTERN, "Use a hex colour such as #FFFFFF."),
  fontScale: z
    .number()
    .min(MIN_FONT_SCALE, `Font size must be at least ${MIN_FONT_SCALE}.`)
    .max(MAX_FONT_SCALE, `Font size must be at most ${MAX_FONT_SCALE}.`),
});

export const createMemeSchema = z.object({
  image: imageFileSchema,
  captions: z
    .array(captionSchema)
    .min(MIN_CAPTIONS, "Add at least one caption.")
    .max(MAX_CAPTIONS, `You can add up to ${MAX_CAPTIONS} captions.`),
});

export type CaptionInput = z.output<typeof captionSchema>;
export type CreateMemeInput = z.output<typeof createMemeSchema>;
