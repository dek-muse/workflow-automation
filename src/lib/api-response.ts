import { NextResponse } from "next/server";
import type { ApiError, ApiSuccess } from "@/types/api";
export function ok<T>(data: T, init?: ResponseInit) { return NextResponse.json<ApiSuccess<T>>({ success: true, data }, init); }
export function fail(code: string, message: string, status = 400, details?: unknown) { return NextResponse.json<ApiError>({ success: false, error: { code, message, details } }, { status }); }
