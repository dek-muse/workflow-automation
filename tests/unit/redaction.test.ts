import { describe, expect, it } from "vitest";
import { redactSensitive } from "../../src/server/services/redaction.service";

describe("sensitive value redaction", () => {
  it("redacts nested secrets and tokens", () => {
    expect(redactSensitive({ passwordHash: "hash", nested: { access_token: "token", safe: "ok" }, list: [{ apiKey: "key" }] })).toEqual({ passwordHash: "[REDACTED]", nested: { access_token: "[REDACTED]", safe: "ok" }, list: [{ apiKey: "[REDACTED]" }] });
  });
});