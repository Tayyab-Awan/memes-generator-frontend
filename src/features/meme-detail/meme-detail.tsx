import Image from "next/image";
import type { Meme } from "@/shared/api/types";
import { formatDate } from "@/shared/format";
import { MemeActions } from "./meme-actions";

export function memeTitle(meme: Meme): string {
  const text = meme.captions
    .map((caption) => caption.text.trim())
    .filter(Boolean)
    .join(" / ");
  if (!text) return "Meme";
  return text.length > 60 ? `${text.slice(0, 57)}…` : text;
}

export function MemeDetail({ meme }: { meme: Meme }) {
  return (
    <article className="mx-auto max-w-3xl space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold break-words sm:text-3xl">
          {memeTitle(meme)}
        </h1>
        <p className="text-sm text-muted">
          Created{" "}
          <time dateTime={meme.createdAt}>{formatDate(meme.createdAt)}</time>
        </p>
      </div>

      <Image
        src={meme.imageUrl}
        alt={`Meme: ${meme.captions.map((caption) => caption.text).join(" / ")}`}
        width={meme.width}
        height={meme.height}
        sizes="(min-width: 768px) 768px, 100vw"
        preload
        className="mx-auto h-auto max-h-[75vh] w-auto max-w-full rounded-xl bg-foreground/5"
      />

      <MemeActions id={meme.id} imageUrl={meme.imageUrl} />
    </article>
  );
}

export function MemeDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Loading meme"
      className="mx-auto max-w-3xl space-y-6"
    >
      <div className="h-8 w-2/3 animate-pulse rounded bg-foreground/10" />
      <div className="aspect-square w-full animate-pulse rounded-xl bg-foreground/10" />
    </div>
  );
}
