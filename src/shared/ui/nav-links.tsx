"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Create" },
  { href: "/memes", label: "Gallery" },
] as const;

type Href = (typeof links)[number]["href"];

function activeHrefFor(pathname: string): Href | null {
  if (pathname === "/") return "/";
  if (pathname === "/memes" || pathname.startsWith("/memes/")) return "/memes";
  return null;
}

export function NavLinks({ activeHref }: { activeHref: Href | null }) {
  return (
    <ul className="flex gap-1">
      {links.map(({ href, label }) => {
        const active = href === activeHref;
        return (
          <li key={href}>
            <Link
              href={href}
              aria-current={active ? "page" : undefined}
              className={`inline-flex min-h-11 items-center rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${
                active
                  ? "bg-foreground/10 text-foreground"
                  : "text-muted hover:bg-foreground/5 hover:text-foreground"
              }`}
            >
              {label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function ActiveNavLinks() {
  return <NavLinks activeHref={activeHrefFor(usePathname())} />;
}
