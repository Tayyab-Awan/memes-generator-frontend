"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { memeKeys } from "@/shared/api/query-keys";
import { GALLERY_PAGE_SIZE } from "@/shared/constants";
import { listMemes } from "./api";

export function useMemesInfinite() {
  return useInfiniteQuery({
    queryKey: memeKeys.list(),
    queryFn: ({ pageParam, signal }) =>
      listMemes({ limit: GALLERY_PAGE_SIZE, cursor: pageParam, signal }),
    initialPageParam: null as string | null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  });
}
