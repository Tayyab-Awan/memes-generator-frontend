import type { Metadata } from "next";
import { Suspense } from "react";
import { GallerySkeleton, MemeGallery } from "@/features/gallery/meme-gallery";

export const metadata: Metadata = {
  title: "Gallery",
};

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold sm:text-3xl">Gallery</h1>
      <Suspense fallback={<GallerySkeleton />}>
        <MemeGallery />
      </Suspense>
    </div>
  );
}
