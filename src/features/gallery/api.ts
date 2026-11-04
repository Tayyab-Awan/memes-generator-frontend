import { apiFetch } from "@/shared/api/client";
import type { PaginatedMemes } from "@/shared/api/types";

interface ListMemesParams {
  limit: number;
  cursor?: string | null;
  signal?: AbortSignal;
}

export function listMemes({
  limit,
  cursor,
  signal,
}: ListMemesParams): Promise<PaginatedMemes> {
  const params = new URLSearchParams({ limit: String(limit) });
  if (cursor) params.set("cursor", cursor);
  return apiFetch<PaginatedMemes>(`/memes?${params.toString()}`, { signal });
}
