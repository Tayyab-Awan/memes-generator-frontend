"use client";

import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type FormEvent } from "react";
import type { CaptionPosition } from "@/shared/api/types";
import { getErrorMessages } from "@/shared/api/errors";
import { MAX_CAPTIONS } from "@/shared/constants";
import { Button } from "@/shared/ui/button";
import { ErrorMessages } from "@/shared/ui/error-messages";
import { Spinner } from "@/shared/ui/spinner";
import {
  initialCaptionDrafts,
  newCaptionDraft,
  type CaptionDraft,
} from "./caption-draft";
import { CaptionEditor } from "./caption-editor";
import { ImagePicker } from "./image-picker";
import { MemePreview, type SelectedImage } from "./meme-preview";
import { createMemeSchema, imageFileSchema } from "./schema";
import { useCreateMeme } from "./use-create-meme";

const SUBMIT_HINT_ID = "submit-hint";

function loadImageSize(
  url: string,
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new window.Image();
    img.onload = () =>
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new Error("Image could not be decoded"));
    img.src = url;
  });
}

function nextPosition(captions: CaptionDraft[]): CaptionPosition {
  const used = new Set(captions.map((caption) => caption.position));
  if (!used.has("top")) return "top";
  if (!used.has("bottom")) return "bottom";
  return "center";
}

export function CreateMemeForm() {
  const router = useRouter();
  const mutation = useCreateMeme();
  const nextId = useRef(3);

  const [image, setImage] = useState<SelectedImage | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [captions, setCaptions] =
    useState<CaptionDraft[]>(initialCaptionDrafts);

  const busy = mutation.isPending || mutation.isSuccess;

  const validation = useMemo(
    () => createMemeSchema.safeParse({ image: image?.file, captions }),
    [image, captions],
  );

  const captionErrors = useMemo(() => {
    const errors: Record<string, string | undefined> = {};
    if (validation.success) return errors;
    for (const issue of validation.error.issues) {
      const [field, index] = issue.path;
      if (field !== "captions" || typeof index !== "number") continue;
      const id = captions[index]?.id;
      if (id && !errors[id]) errors[id] = issue.message;
    }
    return errors;
  }, [validation, captions]);

  const submitHint = !image
    ? "Choose an image to continue."
    : validation.success
      ? null
      : "Fill in or remove empty captions to continue.";

  const replaceImage = (next: SelectedImage | null) => {
    setImage((previous) => {
      if (previous && previous.url !== next?.url) {
        URL.revokeObjectURL(previous.url);
      }
      return next;
    });
  };

  const handleFile = async (file: File) => {
    mutation.reset();
    const parsed = imageFileSchema.safeParse(file);
    if (!parsed.success) {
      setImageError(parsed.error.issues[0]?.message ?? "Invalid image.");
      return;
    }
    const url = URL.createObjectURL(file);
    try {
      const size = await loadImageSize(url);
      setImageError(null);
      replaceImage({ file, url, ...size });
    } catch {
      URL.revokeObjectURL(url);
      setImageError("That image couldn't be read. Try another file.");
    }
  };

  const updateCaption = (id: string, patch: Partial<CaptionDraft>) => {
    setCaptions((current) =>
      current.map((caption) =>
        caption.id === id ? { ...caption, ...patch } : caption,
      ),
    );
  };

  const addCaption = () => {
    setCaptions((current) => {
      if (current.length >= MAX_CAPTIONS) return current;
      const id = `caption-${nextId.current++}`;
      return [...current, newCaptionDraft(id, nextPosition(current))];
    });
  };

  const removeCaption = (id: string) => {
    setCaptions((current) =>
      current.length > 1
        ? current.filter((caption) => caption.id !== id)
        : current,
    );
  };

  const resetForm = () => {
    replaceImage(null);
    setImageError(null);
    setCaptions(initialCaptionDrafts());
    nextId.current = 3;
    mutation.reset();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setCaptions((current) =>
      current.map((caption) => ({ ...caption, touched: true })),
    );
    if (!validation.success) return;
    mutation.mutate(validation.data, {
      onSuccess: (meme) => {
        router.push(`/memes/${meme.id}`);
        resetForm();
      },
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)] lg:items-start"
    >
      <div className="space-y-2 lg:sticky lg:top-6">
        <ImagePicker
          image={image}
          error={imageError}
          disabled={busy}
          onFile={handleFile}
        >
          {image ? <MemePreview image={image} captions={captions} /> : null}
        </ImagePicker>
        {image ? (
          <p className="text-xs text-muted">
            Preview only. The server renders the final meme, so line breaks and
            sizes may differ slightly.
          </p>
        ) : null}
      </div>

      <div className="space-y-6">
        <CaptionEditor
          captions={captions}
          errors={captionErrors}
          disabled={busy}
          onChange={updateCaption}
          onAdd={addCaption}
          onRemove={removeCaption}
        />

        {mutation.isError ? (
          <ErrorMessages
            title="Your meme wasn't created"
            messages={getErrorMessages(mutation.error)}
          />
        ) : null}

        <div className="space-y-2">
          <Button
            type="submit"
            disabled={!validation.success || busy}
            aria-describedby={submitHint ? SUBMIT_HINT_ID : undefined}
            className="w-full"
          >
            {busy ? (
              <>
                <Spinner />
                <span>Creating meme…</span>
              </>
            ) : (
              "Create meme"
            )}
          </Button>
          {submitHint && !busy ? (
            <p id={SUBMIT_HINT_ID} className="text-center text-sm text-muted">
              {submitHint}
            </p>
          ) : null}
          <p className="sr-only" aria-live="polite">
            {busy ? "Creating your meme" : ""}
          </p>
        </div>
      </div>
    </form>
  );
}
