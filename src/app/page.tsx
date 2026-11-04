import type { Metadata } from "next";
import { CreateMemeForm } from "@/features/create-meme/create-meme-form";

export const metadata: Metadata = {
  title: "Create a meme",
};

export default function CreateMemePage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-bold sm:text-3xl">Create a meme</h1>
        <p className="text-muted">
          Pick an image, write your captions and we&apos;ll render the rest.
        </p>
      </div>
      <CreateMemeForm />
    </div>
  );
}
