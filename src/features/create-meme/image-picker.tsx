"use client";

import { useRef, useState, type DragEvent, type ReactNode } from "react";
import { ALLOWED_IMAGE_TYPES, MAX_UPLOAD_BYTES } from "@/shared/constants";
import { formatBytes } from "@/shared/format";
import { Button } from "@/shared/ui/button";
import type { SelectedImage } from "./meme-preview";

interface ImagePickerProps {
  image: SelectedImage | null;
  error: string | null;
  disabled: boolean;
  onFile: (file: File) => void;
  children?: ReactNode;
}

const HINT_ID = "image-hint";
const ERROR_ID = "image-error";

export function ImagePicker({
  image,
  error,
  disabled,
  onFile,
  children,
}: ImagePickerProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const openPicker = () => inputRef.current?.click();

  const handleDragOver = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    if (disabled) return;
    event.dataTransfer.dropEffect = "copy";
    setDragging(true);
  };

  const handleDrop = (event: DragEvent<HTMLElement>) => {
    event.preventDefault();
    setDragging(false);
    if (disabled) return;
    const file = event.dataTransfer.files.item(0);
    if (file) onFile(file);
  };

  const describedBy = error ? `${HINT_ID} ${ERROR_ID}` : HINT_ID;

  return (
    <section aria-labelledby="image-heading" className="space-y-3">
      <h2 id="image-heading" className="text-lg font-semibold">
        Image
      </h2>

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_IMAGE_TYPES.join(",")}
        className="hidden"
        tabIndex={-1}
        aria-hidden="true"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.item(0);
          if (file) onFile(file);
          event.target.value = "";
        }}
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`rounded-xl border-2 border-dashed transition-colors ${
          dragging ? "border-accent bg-accent/5" : "border-border"
        } ${image ? "p-2" : ""}`}
      >
        {image ? (
          children
        ) : (
          <button
            type="button"
            onClick={openPicker}
            disabled={disabled}
            aria-describedby={describedBy}
            className="flex min-h-64 w-full flex-col items-center justify-center gap-2 rounded-xl p-6 text-center focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
          >
            <span className="font-semibold">
              Drop an image here or click to browse
            </span>
            <span className="text-sm text-muted">
              JPEG, PNG, WebP or GIF up to {formatBytes(MAX_UPLOAD_BYTES)}
            </span>
          </button>
        )}
      </div>

      <p id={HINT_ID} className="sr-only">
        Accepted types: JPEG, PNG, WebP or GIF. Maximum size{" "}
        {formatBytes(MAX_UPLOAD_BYTES)}. Animated GIFs use their first frame.
      </p>

      {image ? (
        <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
          <p className="min-w-0 truncate text-muted">
            <span className="font-medium text-foreground">
              {image.file.name}
            </span>{" "}
            · {formatBytes(image.file.size)} · {image.width}×{image.height}
          </p>
          <Button
            variant="secondary"
            onClick={openPicker}
            disabled={disabled}
            aria-describedby={describedBy}
          >
            Change image
          </Button>
        </div>
      ) : null}

      {error ? (
        <p id={ERROR_ID} role="alert" className="text-sm text-danger">
          {error}
        </p>
      ) : null}
    </section>
  );
}
