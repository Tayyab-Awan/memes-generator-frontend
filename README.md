# Meme Generator frontend

Next.js (App Router) frontend for the Meme Generator API. Users upload an image and add captions. The backend renders the final meme, and the gallery shows every meme created.

Stack: Next.js 16, React 19, TypeScript (strict), Tailwind CSS 4, TanStack Query, Zod, Vitest, pnpm.

## Setup

Requirements: Node.js 20.19+ and pnpm 10.

```bash
pnpm install
cp .env.example .env.local
pnpm dev
```

The app runs at <http://localhost:4000>. The backend must be running (default <http://localhost:3000>). Its Swagger docs are at `{NEXT_PUBLIC_API_URL}/docs`.

### CORS

The backend only accepts browser requests from the origins listed in its `CORS_ORIGIN` env var. The default is `http://localhost:5173`. Add this frontend's origin to the backend's `.env` (comma-separated) and restart it:

```env
CORS_ORIGIN=http://localhost:4000
```

If `CORS_ORIGIN` doesn't include this origin, creating a meme and loading the gallery fail with a network error in the browser. The meme detail page still works, because it's fetched on the server.

## Environment variables

| Name                  | Required | Example                 | Description                                                                                                              |
| --------------------- | -------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| `NEXT_PUBLIC_API_URL` | Yes      | `http://localhost:3000` | Base URL of the backend API. Used in the browser and on the server. Inlined at build time, so rebuild after changing it. |

## Scripts

| Script              | What it does                                  |
| ------------------- | --------------------------------------------- |
| `pnpm dev`          | Start the dev server on port 4000             |
| `pnpm build`        | Production build                              |
| `pnpm start`        | Serve the production build on port 4000       |
| `pnpm lint`         | ESLint                                        |
| `pnpm typecheck`    | Generate route types, then run `tsc --noEmit` |
| `pnpm format`       | Format with Prettier                          |
| `pnpm format:check` | Check formatting without writing              |
| `pnpm test`         | Run unit tests once (Vitest)                  |
| `pnpm test:watch`   | Run unit tests in watch mode                  |

## Pages

- `/`: create a meme. Pick an image (drag and drop or browse), edit 1 to 5 captions and see a live CSS preview. The preview is approximate; the server's render is final.
- `/memes`: gallery with infinite scroll.
- `/memes/[id]`: a single meme, with download, copy link and Open Graph tags for link previews.

## Project structure

```
src/
  app/                  routes only
  features/
    create-meme/        form, caption editor, preview, schema, mutation hook
    gallery/            grid, card, infinite query hook
    meme-detail/        detail view, download and copy actions
  shared/
    api/                fetch client, types, error parsing, query provider
    ui/                 buttons, header, shared components
    constants.ts        backend limits used for validation and UI
```

`src/shared/constants.ts` mirrors the backend limits (5 MB uploads, JPEG/PNG/WebP/GIF, 1 to 5 captions of up to 200 characters, font scale 0.5 to 2). Update it whenever the backend changes them.
