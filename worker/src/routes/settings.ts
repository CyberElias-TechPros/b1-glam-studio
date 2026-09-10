import { Env } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handleSettingsRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. GET /api/settings (Public get settings)
  if (path === '/api/settings' && method === 'GET') {
    const { results } = await env.DB.prepare('SELECT key, value FROM studio_settings').all<{
      key: string;
      value: string;
    }>();

    const settings: Record<string, string> = {};
    for (const r of results) {
      settings[r.key] = r.value;
    }

    return successResponse(settings);
  }

  // 2. PUT /api/settings (Admin update settings)
  if (path === '/api/settings' && method === 'PUT') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    try {
      const body = await request.json() as Record<string, string>;
      const now = new Date().toISOString();

      for (const [key, val] of Object.entries(body)) {
        if (typeof key === 'string' && typeof val === 'string') {
          await env.DB.prepare(
            `INSERT INTO studio_settings (key, value, updated_at) VALUES (?, ?, ?)
             ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
          ).bind(key, val, now).run();
        }
      }

      return successResponse(null, 'Studio settings updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to update settings: ${msg}`, 500);
    }
  }

  return errorResponse('Not found', 404);
}
