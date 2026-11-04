import Image from "next/image";
import type { CSSProperties } from "react";
import type { CaptionDraft } from "./caption-draft";
import { captionColors } from "./caption-style";

export interface SelectedImage {
  file: File;
  url: string;
  width: number;
  height: number;
}

interface MemePreviewProps {
  image: SelectedImage;
  captions: CaptionDraft[];
}

export function MemePreview({ image, captions }: MemePreviewProps) {
  const ratio = image.width / image.height;

  return (
    <div
      className="meme-preview relative mx-auto overflow-hidden rounded-lg bg-black"
      style={{
        aspectRatio: `${image.width} / ${image.height}`,
        width: `min(100%, calc(70vh * ${ratio}))`,
      }}
    >
      <Image
        src={image.url}
        alt="Selected image"
        fill
        unoptimized
        className="object-fill"
      />
      {captions
        .filter((caption) => caption.text.trim().length > 0)
        .map((caption) => {
          const { fill, stroke } = captionColors(caption.color);
          const style = {
            "--caption-fill": fill,
            "--caption-stroke": stroke,
            "--caption-scale": caption.fontScale,
          } as CSSProperties;
          return (
            <p
              key={caption.id}
              aria-hidden="true"
              data-position={caption.position}
              className="meme-caption"
              style={style}
            >
              {caption.text}
            </p>
          );
        })}
    </div>
  );
}
