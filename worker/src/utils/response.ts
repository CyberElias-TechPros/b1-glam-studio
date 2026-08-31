/**
 * JSON and Response helper utilities for Cloudflare Workers
 */

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: Record<string, unknown>;
}

export function jsonResponse<T>(
  data: ApiResponse<T>,
  status: number = 200,
  headers: Record<string, string> = {}
): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'X-Content-Type-Options': 'nosniff',
      'X-Frame-Options': 'DENY',
      'Referrer-Policy': 'strict-origin-when-cross-origin',
      ...headers,
    },
  });
}

export function successResponse<T>(
  data: T,
  message?: string,
  meta?: Record<string, unknown>,
  status: number = 200,
  headers: Record<string, string> = {}
): Response {
  return jsonResponse(
    {
      success: true,
      data,
      message,
      meta,
    },
    status,
    headers
  );
}

export function errorResponse(
  error: string,
  status: number = 400,
  details?: unknown,
  headers: Record<string, string> = {}
): Response {
  return jsonResponse(
    {
      success: false,
      error,
      data: details as undefined,
    },
    status,
    headers
  );
}
