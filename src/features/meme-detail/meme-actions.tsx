"use client";

import { useEffect, useState } from "react";
import { Button, ButtonLink } from "@/shared/ui/button";
import { Spinner } from "@/shared/ui/spinner";
import { downloadImage } from "./download";

type Status =
  | { kind: "idle" }
  | { kind: "downloading" }
  | { kind: "copied" }
  | { kind: "error"; message: string };

export function MemeActions({
  id,
  imageUrl,
}: {
  id: string;
  imageUrl: string;
}) {
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  useEffect(() => {
    if (status.kind !== "copied") return;
    const timer = setTimeout(() => setStatus({ kind: "idle" }), 2000);
    return () => clearTimeout(timer);
  }, [status]);

  const handleDownload = async () => {
    setStatus({ kind: "downloading" });
    try {
      await downloadImage(imageUrl, `meme-${id}`);
      setStatus({ kind: "idle" });
    } catch {
      setStatus({
        kind: "error",
        message: "The download failed. Please try again.",
      });
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setStatus({ kind: "copied" });
    } catch {
      setStatus({
        kind: "error",
        message:
          "Couldn't copy the link. Copy it from the address bar instead.",
      });
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button
          onClick={() => void handleDownload()}
          disabled={status.kind === "downloading"}
        >
          {status.kind === "downloading" ? (
            <>
              <Spinner />
              <span>Downloading…</span>
            </>
          ) : (
            "Download"
          )}
        </Button>
        <Button variant="secondary" onClick={() => void handleCopy()}>
          {status.kind === "copied" ? "Link copied!" : "Copy link"}
        </Button>
        <ButtonLink variant="secondary" href="/">
          Make another
        </ButtonLink>
      </div>
      <p aria-live="polite" className="min-h-5 text-sm">
        {status.kind === "error" ? (
          <span className="text-danger">{status.message}</span>
        ) : status.kind === "copied" ? (
          <span className="sr-only">Link copied to clipboard</span>
        ) : null}
      </p>
    </div>
  );
}
