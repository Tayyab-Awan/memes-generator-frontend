import { apiFetch } from "@/shared/api/client";
import type { Meme } from "@/shared/api/types";
import type { CreateMemeInput } from "./schema";

export function createMeme({
  image,
  captions,
}: CreateMemeInput): Promise<Meme> {
  const body = new FormData();
  body.append("image", image);
  body.append("captions", JSON.stringify(captions));
  return apiFetch<Meme>("/memes", { method: "POST", body });
}
