export class AppError extends Error { constructor(public readonly code: string, message: string, public readonly status = 400, public readonly details?: unknown) { super(message); } }
export class ForbiddenError extends AppError { constructor(message = "You do not have permission to perform this action.") { super("FORBIDDEN", message, 403); } }
export class NotFoundError extends AppError { constructor(entity = "Resource") { super("NOT_FOUND", `${entity} was not found.`, 404); } }
