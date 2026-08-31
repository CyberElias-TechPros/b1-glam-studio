import { Env } from '../types';

/**
 * Handle CORS headers and preflight OPTIONS requests safely.
 */
export function getCorsHeaders(request: Request, env?: Env): Record<string, string> {
  const origin = request.headers.get('Origin') || '*';
  
  // In production we allow configured origins, Vercel preview URLs, and localhost
  let allowedOrigin = origin;
  if (env?.FRONTEND_URL) {
    if (
      origin === env.FRONTEND_URL ||
      origin.endsWith('.vercel.app') ||
      origin.endsWith('.e2b.app') ||
      origin.includes('localhost') ||
      origin.includes('127.0.0.1')
    ) {
      allowedOrigin = origin;
    }
  }

  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Range',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400',
  };
}

export function handleOptions(request: Request, env?: Env): Response {
  return new Response(null, {
    status: 204,
    headers: getCorsHeaders(request, env),
  });
}
