export type ConnectionResult = { ok: boolean; message: string };
export type IntegrationCapability = { action: string; description: string; readOnly: boolean; approvalRequired: boolean };
export interface IntegrationPlugin { key: string; name: string; description: string; connect(): Promise<void>; disconnect(): Promise<void>; testConnection(): Promise<ConnectionResult>; listCapabilities(): Promise<IntegrationCapability[]>; executeAction(action: string, input: unknown): Promise<unknown>; }
