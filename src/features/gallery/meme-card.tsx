import Image from "next/image";
import Link from "next/link";
import type { Meme } from "@/shared/api/types";
import { formatDate } from "@/shared/format";

export function memeAltText(meme: Meme): string {
  const text = meme.captions.map((caption) => caption.text).join(" / ");
  return text ? `Meme: ${text}` : "Meme";
}

export function MemeCard({
  meme,
  priority,
}: {
  meme: Meme;
  priority: boolean;
}) {
  return (
    <Link
      href={`/memes/${meme.id}`}
      className="group block overflow-hidden rounded-xl border border-border bg-surface transition-shadow hover:shadow-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
    >
      <Image
        src={meme.imageUrl}
        alt={memeAltText(meme)}
        width={meme.width}
        height={meme.height}
        sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
        preload={priority}
        className="h-auto w-full bg-foreground/5"
      />
      <p className="px-3 py-2 text-xs text-muted">
        <time dateTime={meme.createdAt}>{formatDate(meme.createdAt)}</time>
      </p>
    </Link>
  );
}
