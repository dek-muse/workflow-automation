const sensitivePatterns = [/password/i, /secret/i, /token/i, /api[-_]?key/i, /authorization/i, /credential/i, /encryption/i, /session/i, /refresh/i, /access/i];

export function redactSensitive(value: unknown): unknown {
  if (Array.isArray(value)) return value.map((item) => redactSensitive(item));
  if (!value || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value as Record<string, unknown>).map(([key, item]) => [key, isSensitiveKey(key) ? "[REDACTED]" : redactSensitive(item)]));
}

export function isSensitiveKey(key: string) {
  return sensitivePatterns.some((pattern) => pattern.test(key));
}