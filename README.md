# FlowPilot AI

Production-ready SaaS foundation for multi-tenant AI workflow automation.

## Stack

Next.js App Router, TypeScript strict mode, Tailwind CSS, shadcn-style primitives, NextAuth, Prisma/MongoDB, Redis, BullMQ, Zod, Vitest, Playwright-ready e2e, Docker Compose.

## Local Setup

1. Copy `.env.example` to `.env` and keep `AI_PROVIDER=mock` for local development.
2. Install dependencies: `npm install`.
3. Start MongoDB and Redis: `docker compose up mongodb redis`.
4. Sync the Prisma schema: `npm run db:push`.
5. Seed demo data: `npm run db:seed`.
6. Start web: `npm run dev`.
7. Start worker in another shell: `npm run worker`.

Demo login: `demo@flowpilot.local` / `FlowPilotDemo123!`.

## Commands

- `npm run dev`
- `npm run build`
- `npm run lint`
- `npm run typecheck`
- `npm run test`
- `npm run test:e2e`
- `npm run db:push`
- `npm run db:seed`
- `npm run worker`

## Implemented Foundation

- Multi-tenant Prisma data model with workspace scoping, indexes, soft deletes where useful, auth adapter tables, workflow execution state, approvals, audit logs, usage, subscriptions, API keys, webhooks, and credential storage.
- RBAC helpers for Owner, Admin, Automation Manager, Approver, Operator, Analyst, and Viewer.
- Provider-independent AI service with deterministic mock provider and guarded real-provider placeholders.
- Secure AI tool registry with Zod input/output validation, permission checks, destructive/approval metadata, and safe mock behavior.
- Workflow engine with idempotent execution, persisted steps, approval pause, task node foundation, and BullMQ worker.
- Integration plugin interface with mock-safe placeholders for Gmail, Calendar, Slack, Telegram, WhatsApp Business, Instagram, Facebook, TikTok, LinkedIn, Webhook, and REST API.
- In-app SaaS shell, all requested routes, builder foundation, dashboards, settings, and operational pages.
- Docker, health/readiness endpoints, seed data, and architecture/API docs.

## Production Integration Work Remaining

- Add real OAuth/provider adapters and external action handlers.
- Complete email verification, password reset token flows, and invite acceptance UI.
- Add Stripe adapter behind the billing interface.
- Add full e2e coverage once browsers are installed.
- Harden SSRF checks for `http.request` before enabling outbound network calls.
