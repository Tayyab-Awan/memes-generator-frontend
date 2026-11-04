import { ButtonLink } from "@/shared/ui/button";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
      <h1 className="font-meme text-5xl uppercase">404</h1>
      <p className="text-muted">
        We couldn&apos;t find that page. The meme may not exist.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <ButtonLink href="/memes">Browse the gallery</ButtonLink>
        <ButtonLink variant="secondary" href="/">
          Make a meme
        </ButtonLink>
      </div>
    </div>
  );
}
