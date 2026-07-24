# API

All API routes return `{ success: true, data }` or `{ success: false, error }`.

Collection routes support `workspaceId`, `page`, and `pageSize` query parameters:
- `/api/workspaces`
- `/api/agents`
- `/api/workflows`
- `/api/executions`
- `/api/approvals`
- `/api/integrations`
- `/api/contacts`
- `/api/tasks`
- `/api/analytics`
- `/api/notifications`
- `/api/audit-logs`

Health endpoints:
- `/api/health`
- `/api/ready`

Mutations are intended to pass through service-layer actions so validation, permissions, audit logging, and workspace scoping stay centralized.
