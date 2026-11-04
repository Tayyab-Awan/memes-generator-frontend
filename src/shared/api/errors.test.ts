import { describe, expect, it } from "vitest";
import {
  ApiError,
  getErrorMessages,
  NETWORK_ERROR_STATUS,
  networkError,
  parseApiError,
} from "./errors";

describe("parseApiError", () => {
  it("wraps a string message in a list", () => {
    const error = parseApiError(404, {
      statusCode: 404,
      message: "Meme not found",
      error: "Not Found",
    });
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(404);
    expect(error.messages).toEqual(["Meme not found"]);
  });

  it("keeps every message from an array", () => {
    const error = parseApiError(400, {
      statusCode: 400,
      message: [
        "captions.0.text must be shorter than or equal to 200 characters",
        "captions must contain no more than 5 elements",
      ],
      error: "Bad Request",
    });
    expect(error.messages).toEqual([
      "captions.0.text must be shorter than or equal to 200 characters",
      "captions must contain no more than 5 elements",
    ]);
  });

  it("drops non-string and blank entries", () => {
    const error = parseApiError(400, {
      message: ["  valid  ", 42, null, "", "   "],
    });
    expect(error.messages).toEqual(["valid"]);
  });

  it("returns a friendly message for 429 regardless of body", () => {
    const error = parseApiError(429, {
      statusCode: 429,
      message: "ThrottlerException: Too Many Requests",
    });
    expect(error.status).toBe(429);
    expect(error.messages).toHaveLength(1);
    expect(error.messages[0]).toMatch(/slow down/i);
    expect(error.messages[0]).toMatch(/try again in a minute/i);
  });

  it("uses a status fallback when there is no message", () => {
    expect(parseApiError(413, null).messages[0]).toMatch(/too large/i);
    expect(parseApiError(502, "Bad Gateway").messages[0]).toMatch(
      /couldn't be stored/i,
    );
  });

  it("falls back to the error field for unknown statuses", () => {
    expect(
      parseApiError(503, { statusCode: 503, error: "Service Unavailable" })
        .messages,
    ).toEqual(["Service Unavailable"]);
  });

  it("falls back to a generic message with the status code", () => {
    expect(parseApiError(500, "<html>oops</html>").messages).toEqual([
      "Something went wrong (HTTP 500). Please try again.",
    ]);
  });

  it("exposes the messages on the Error message", () => {
    const error = parseApiError(400, { message: ["a", "b"] });
    expect(error.message).toBe("a\nb");
    expect(error.name).toBe("ApiError");
  });
});

describe("networkError", () => {
  it("uses the network status and a connection message", () => {
    const error = networkError();
    expect(error.status).toBe(NETWORK_ERROR_STATUS);
    expect(error.messages[0]).toMatch(/couldn't reach the server/i);
  });
});

describe("getErrorMessages", () => {
  it("returns ApiError messages", () => {
    expect(getErrorMessages(new ApiError(400, ["x", "y"]))).toEqual(["x", "y"]);
  });

  it("returns a generic message for unknown errors", () => {
    expect(getErrorMessages(new Error("boom"))).toEqual([
      "Something went wrong. Please try again.",
    ]);
    expect(getErrorMessages("boom")).toHaveLength(1);
  });
});
