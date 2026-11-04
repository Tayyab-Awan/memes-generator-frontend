"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { memeKeys } from "@/shared/api/query-keys";
import { createMeme } from "./api";

export function useCreateMeme() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createMeme,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: memeKeys.all }),
  });
}
