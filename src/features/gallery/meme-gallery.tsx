"use client";

import { useEffect, useRef } from "react";
import { getErrorMessages } from "@/shared/api/errors";
import { Button, ButtonLink } from "@/shared/ui/button";
import { ErrorMessages } from "@/shared/ui/error-messages";
import { Spinner } from "@/shared/ui/spinner";
import { MemeCard } from "./meme-card";
import { useMemesInfinite } from "./use-memes-infinite";

const GRID_CLASSES =
  "grid grid-cols-2 items-start gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4";

export function MemeGallery() {
  const {
    data,
    error,
    isPending,
    isError,
    isFetchingNextPage,
    isFetchNextPageError,
    hasNextPage,
    fetchNextPage,
    refetch,
  } = useMemesInfinite();
  const sentinelRef = useRef<HTMLDivElement>(null);

  const canLoadMore =
    hasNextPage && !isFetchingNextPage && !isFetchNextPageError;

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !canLoadMore) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void fetchNextPage();
        }
      },
      { rootMargin: "600px 0px" },
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [canLoadMore, fetchNextPage]);

  if (isPending) {
    return <GallerySkeleton />;
  }

  if (isError && !data) {
    return (
      <ErrorMessages
        title="Couldn't load the gallery"
        messages={getErrorMessages(error)}
        action={
          <Button variant="secondary" onClick={() => void refetch()}>
            Try again
          </Button>
        }
      />
    );
  }

  const memes = data.pages.flatMap((page) => page.items);

  if (memes.length === 0) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed border-border px-6 py-16 text-center">
        <p className="text-lg font-semibold">No memes yet</p>
        <p className="text-muted">Be the first to make one.</p>
        <ButtonLink href="/">Create a meme</ButtonLink>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ul className={GRID_CLASSES}>
        {memes.map((meme, index) => (
          <li key={meme.id}>
            <MemeCard meme={meme} priority={index < 4} />
          </li>
        ))}
      </ul>

      <div ref={sentinelRef} aria-hidden="true" />

      <div className="flex flex-col items-center gap-3" aria-live="polite">
        {isFetchingNextPage ? (
          <p className="flex items-center gap-2 text-sm text-muted">
            <Spinner />
            Loading more memes…
          </p>
        ) : null}

        {isFetchNextPageError ? (
          <ErrorMessages
            title="Couldn't load more memes"
            messages={getErrorMessages(error)}
            action={
              <Button variant="secondary" onClick={() => void fetchNextPage()}>
                Try again
              </Button>
            }
          />
        ) : null}

        {canLoadMore ? (
          <Button variant="secondary" onClick={() => void fetchNextPage()}>
            Load more
          </Button>
        ) : null}

        {!hasNextPage ? (
          <p className="text-sm text-muted">You&apos;ve reached the end.</p>
        ) : null}
      </div>
    </div>
  );
}

export function GallerySkeleton() {
  return (
    <div role="status" aria-label="Loading memes">
      <ul className={GRID_CLASSES} aria-hidden="true">
        {Array.from({ length: 8 }, (_, index) => (
          <li
            key={index}
            className="aspect-square animate-pulse rounded-xl bg-foreground/10"
          />
        ))}
      </ul>
    </div>
  );
}
