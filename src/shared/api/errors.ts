import {
  CREATE_RATE_LIMIT_PER_MINUTE,
  MAX_UPLOAD_BYTES,
} from "@/shared/constants";

export const NETWORK_ERROR_STATUS = 0;

export class ApiError extends Error {
  readonly status: number;
  readonly messages: string[];

  constructor(status: number, messages: string[]) {
    super(messages.join("\n"));
    this.name = "ApiError";
    this.status = status;
    this.messages = messages;
  }
}

const RATE_LIMIT_MESSAGE = `Slow down! You can create up to ${CREATE_RATE_LIMIT_PER_MINUTE} memes a minute. Try again in a minute.`;

const FALLBACK_MESSAGES: Record<number, string> = {
  [NETWORK_ERROR_STATUS]:
    "Couldn't reach the server. Check your connection and try again.",
  400: "The request was invalid.",
  404: "Not found.",
  413: `The image is too large. The limit is ${MAX_UPLOAD_BYTES / 1024 / 1024} MB.`,
  502: "The image couldn't be stored. Please try again.",
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function toMessageList(value: unknown): string[] {
  const raw = Array.isArray(value) ? value : [value];
  return raw
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function parseApiError(status: number, body: unknown): ApiError {
  if (status === 429) {
    return new ApiError(status, [RATE_LIMIT_MESSAGE]);
  }

  const messages = isRecord(body) ? toMessageList(body.message) : [];
  if (messages.length > 0) {
    return new ApiError(status, messages);
  }

  const fallback =
    FALLBACK_MESSAGES[status] ??
    (isRecord(body) && typeof body.error === "string" && body.error.trim()
      ? body.error.trim()
      : `Something went wrong (HTTP ${status}). Please try again.`);
  return new ApiError(status, [fallback]);
}

export function networkError(): ApiError {
  return parseApiError(NETWORK_ERROR_STATUS, null);
}

export function getErrorMessages(error: unknown): string[] {
  if (error instanceof ApiError) return error.messages;
  return ["Something went wrong. Please try again."];
}
