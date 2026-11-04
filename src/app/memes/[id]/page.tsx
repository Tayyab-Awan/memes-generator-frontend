import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getMeme } from "@/features/meme-detail/api";
import { MemeDetail, memeTitle } from "@/features/meme-detail/meme-detail";

export async function generateMetadata({
  params,
}: PageProps<"/memes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const meme = await getMeme(id);
  if (!meme) return { title: "Meme not found" };

  const title = memeTitle(meme);
  const images = [
    { url: meme.imageUrl, width: meme.width, height: meme.height, alt: title },
  ];
  return {
    title,
    openGraph: { title, type: "website", images },
    twitter: { card: "summary_large_image", title, images },
  };
}

export default async function MemePage({ params }: PageProps<"/memes/[id]">) {
  const { id } = await params;
  const meme = await getMeme(id);
  if (!meme) notFound();
  return <MemeDetail meme={meme} />;
}
