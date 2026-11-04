export const memeKeys = {
  all: ["memes"] as const,
  list: () => [...memeKeys.all, "list"] as const,
};
