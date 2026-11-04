import { apiFetch } from "@/shared/api/client";
import { ApiError } from "@/shared/api/errors";
import type { Meme } from "@/shared/api/types";

export async function getMeme(id: string): Promise<Meme | null> {
  try {
    return await apiFetch<Meme>(`/memes/${encodeURIComponent(id)}`);
  } catch (error) {
    if (
      error instanceof ApiError &&
      (error.status === 400 || error.status === 404)
    ) {
      return null;
    }
    throw error;
  }
}
