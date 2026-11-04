"use client";

import { Button, ButtonLink } from "@/shared/ui/button";
import { ErrorMessages } from "@/shared/ui/error-messages";

export default function MemeError({ retry }: { retry: () => void }) {
  return (
    <div className="mx-auto max-w-xl">
      <ErrorMessages
        title="Couldn't load this meme"
        messages={["The server didn't respond as expected. Please try again."]}
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => retry()}>
              Try again
            </Button>
            <ButtonLink variant="secondary" href="/memes">
              Back to gallery
            </ButtonLink>
          </div>
        }
      />
    </div>
  );
}
