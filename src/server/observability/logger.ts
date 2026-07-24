type LogLevel = "info" | "warn" | "error";
export function log(level: LogLevel, event: string, data: Record<string, unknown> = {}) { const entry = { level, event, timestamp: new Date().toISOString(), ...data }; const line = JSON.stringify(entry); if (level === "error") console.error(line); else if (level === "warn") console.warn(line); else console.log(line); }
