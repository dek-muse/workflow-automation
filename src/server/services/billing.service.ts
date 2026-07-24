import type { WorkspacePlan } from "@prisma/client";
export type BillingProvider = { createCheckoutSession(workspaceId: string, plan: WorkspacePlan): Promise<{ url: string }>; syncSubscription(workspaceId: string): Promise<void> };
export const nullBillingProvider: BillingProvider = { async createCheckoutSession() { throw new Error("Billing provider is not configured. Stripe or another provider can be added behind this interface."); }, async syncSubscription() {} };
