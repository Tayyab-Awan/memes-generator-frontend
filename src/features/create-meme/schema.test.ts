import { describe, expect, it } from "vitest";
import {
  MAX_CAPTION_LENGTH,
  MAX_CAPTIONS,
  MAX_FONT_SCALE,
  MAX_UPLOAD_BYTES,
  MIN_FONT_SCALE,
} from "@/shared/constants";
import { captionSchema, createMemeSchema, imageFileSchema } from "./schema";

function makeFile(type: string, size: number, name = "image"): File {
  return new File([new Uint8Array(size)], name, { type });
}

const validCaption = {
  text: "One does not simply",
  position: "top",
  color: "#FFFFFF",
  fontScale: 1,
} as const;

describe("imageFileSchema", () => {
  it.each(["image/jpeg", "image/png", "image/webp", "image/gif"])(
    "accepts %s",
    (type) => {
      expect(imageFileSchema.safeParse(makeFile(type, 10)).success).toBe(true);
    },
  );

  it("rejects unsupported types", () => {
    const result = imageFileSchema.safeParse(makeFile("image/svg+xml", 10));
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/JPEG, PNG, WebP or GIF/);
  });

  it("accepts a file exactly at the size limit", () => {
    const file = makeFile("image/png", MAX_UPLOAD_BYTES);
    expect(imageFileSchema.safeParse(file).success).toBe(true);
  });

  it("rejects a file over the size limit", () => {
    const result = imageFileSchema.safeParse(
      makeFile("image/png", MAX_UPLOAD_BYTES + 1),
    );
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.message).toMatch(/5 MB or smaller/);
  });

  it("rejects empty files", () => {
    expect(imageFileSchema.safeParse(makeFile("image/png", 0)).success).toBe(
      false,
    );
  });

  it("rejects values that are not files", () => {
    expect(imageFileSchema.safeParse(undefined).success).toBe(false);
    expect(imageFileSchema.safeParse("image.png").success).toBe(false);
  });
});

describe("captionSchema", () => {
  it("accepts a valid caption", () => {
    expect(captionSchema.parse(validCaption)).toEqual(validCaption);
  });

  it("trims text before validating", () => {
    expect(captionSchema.parse({ ...validCaption, text: "  hi  " }).text).toBe(
      "hi",
    );
  });

  it("rejects text that is empty after trimming", () => {
    expect(
      captionSchema.safeParse({ ...validCaption, text: "   " }).success,
    ).toBe(false);
  });

  it("enforces the maximum length after trimming", () => {
    const atLimit = "a".repeat(MAX_CAPTION_LENGTH);
    expect(
      captionSchema.safeParse({ ...validCaption, text: ` ${atLimit} ` })
        .success,
    ).toBe(true);
    expect(
      captionSchema.safeParse({ ...validCaption, text: `${atLimit}a` }).success,
    ).toBe(false);
  });

  it.each(["top", "center", "bottom"])("accepts position %s", (position) => {
    expect(captionSchema.safeParse({ ...validCaption, position }).success).toBe(
      true,
    );
  });

  it("rejects unknown positions", () => {
    expect(
      captionSchema.safeParse({ ...validCaption, position: "left" }).success,
    ).toBe(false);
  });

  it.each(["#FFF", "#ffffff", "#A1b2C3"])("accepts colour %s", (color) => {
    expect(captionSchema.safeParse({ ...validCaption, color }).success).toBe(
      true,
    );
  });

  it.each(["FFFFFF", "#FFFF", "#GGGGGG", "#FFFFFFFF", "white"])(
    "rejects colour %s",
    (color) => {
      expect(captionSchema.safeParse({ ...validCaption, color }).success).toBe(
        false,
      );
    },
  );

  it("enforces the font scale range", () => {
    for (const fontScale of [MIN_FONT_SCALE, 1, MAX_FONT_SCALE]) {
      expect(
        captionSchema.safeParse({ ...validCaption, fontScale }).success,
      ).toBe(true);
    }
    for (const fontScale of [MIN_FONT_SCALE - 0.1, MAX_FONT_SCALE + 0.1]) {
      expect(
        captionSchema.safeParse({ ...validCaption, fontScale }).success,
      ).toBe(false);
    }
  });
});

describe("createMemeSchema", () => {
  const image = makeFile("image/jpeg", 100);

  it("accepts an image with 1 to 5 captions", () => {
    for (let count = 1; count <= MAX_CAPTIONS; count++) {
      const captions = Array.from({ length: count }, () => validCaption);
      expect(createMemeSchema.safeParse({ image, captions }).success).toBe(
        true,
      );
    }
  });

  it("rejects zero captions", () => {
    expect(createMemeSchema.safeParse({ image, captions: [] }).success).toBe(
      false,
    );
  });

  it("rejects more than the maximum number of captions", () => {
    const captions = Array.from(
      { length: MAX_CAPTIONS + 1 },
      () => validCaption,
    );
    expect(createMemeSchema.safeParse({ image, captions }).success).toBe(false);
  });

  it("requires an image", () => {
    expect(
      createMemeSchema.safeParse({ image: undefined, captions: [validCaption] })
        .success,
    ).toBe(false);
  });

  it("reports caption issues with their index", () => {
    const result = createMemeSchema.safeParse({
      image,
      captions: [validCaption, { ...validCaption, text: "" }],
    });
    expect(result.success).toBe(false);
    expect(result.error?.issues[0]?.path).toEqual(["captions", 1, "text"]);
  });

  it("strips extra fields and trims captions in the output", () => {
    const result = createMemeSchema.parse({
      image,
      captions: [{ ...validCaption, id: "caption-1", text: "  hello " }],
    });
    expect(result.captions).toEqual([{ ...validCaption, text: "hello" }]);
  });
});
