import Link from "next/link";
import { Suspense } from "react";
import { ActiveNavLinks, NavLinks } from "./nav-links";

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="rounded font-meme text-xl tracking-wide uppercase focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"
        >
          Meme Generator
        </Link>
        <nav aria-label="Main">
          <Suspense fallback={<NavLinks activeHref={null} />}>
            <ActiveNavLinks />
          </Suspense>
        </nav>
      </div>
    </header>
  );
}
