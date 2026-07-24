# FlowPilot AI Architecture

FlowPilot AI is structured as a Next.js App Router SaaS with domain logic isolated under `src/server`. Route handlers validate and marshal requests, repositories scope tenant data, services coordinate business operations, and engines handle AI/tool/workflow execution.

Core boundaries:
- `server/auth`: NextAuth session and credential provider foundation.
- `server/permissions`: RBAC helpers for workspace roles.
- `server/repositories`: tenant-scoped database access.
- `server/services`: audit, workspace, analytics, encryption, and billing abstractions.
- `server/ai`: provider-independent AI adapter, deterministic mock provider, agent loop, tool registry, traces, cost-ready shape.
- `server/workflows`: idempotent workflow engine with persisted execution and approval pauses.
- `server/jobs`: BullMQ queue and worker process.
- `server/integrations`: plugin interface plus mock-safe integration placeholders.

Assumptions:
- External providers are disabled until credentials are supplied.
- Dashboard metrics use database queries; empty local databases show zero-state values.
- The initial builder is an ordered-node editor that can evolve into a canvas.

Risks:
- NextAuth v5 remains beta; pin and review before production launch.
- Real provider integrations require dedicated SSRF, OAuth, webhook, and secrets-hardening passes.
