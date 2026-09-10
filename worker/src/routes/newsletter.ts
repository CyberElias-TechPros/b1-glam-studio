import { Env } from '../types';
import { generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handleNewsletterRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. POST /api/newsletter/subscribe (Public subscribe)
  if (path === '/api/newsletter/subscribe' && method === 'POST') {
    try {
      const body = await request.json() as { email?: string; source?: string };
      const email = body.email?.trim().toLowerCase();

      if (!email || !email.includes('@') || !email.includes('.')) {
        return errorResponse('A valid email address is required', 400);
      }

      // Check if already subscribed
      const existing = await env.DB.prepare('SELECT id, is_active FROM subscribers WHERE email = ?')
        .bind(email)
        .first<{ id: string; is_active: number }>();

      if (existing) {
        if (!existing.is_active) {
          await env.DB.prepare('UPDATE subscribers SET is_active = 1 WHERE id = ?')
            .bind(existing.id)
            .run();
        }
        return successResponse(null, 'You are already subscribed to our newsletter! ✨');
      }

      const id = generateUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        'INSERT INTO subscribers (id, email, source, is_active, created_at) VALUES (?, ?, ?, 1, ?)'
      ).bind(id, email, body.source || 'website', now).run();

      return successResponse(
        { id, email },
        'Thank you for subscribing! Check your inbox for exclusive beauty updates.',
        undefined,
        201
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Subscription failed: ${msg}`, 500);
    }
  }

  // 2. POST /api/newsletter/unsubscribe (Public unsubscribe)
  if (path === '/api/newsletter/unsubscribe' && method === 'POST') {
    try {
      const body = await request.json() as { email?: string };
      const email = body.email?.trim().toLowerCase();
      if (!email) return errorResponse('Email is required', 400);

      await env.DB.prepare('UPDATE subscribers SET is_active = 0 WHERE email = ?')
        .bind(email)
        .run();

      return successResponse(null, 'You have been unsubscribed from our newsletter.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Unsubscribe failed: ${msg}`, 500);
    }
  }

  // 3. GET /api/newsletter (Admin list subscribers)
  if (path === '/api/newsletter' && method === 'GET') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(200, Math.max(1, parseInt(url.searchParams.get('limit') || '50', 10)));
    const offset = (page - 1) * limit;

    const countRes = await env.DB.prepare('SELECT COUNT(*) as total FROM subscribers').first<{ total: number }>();
    const total = countRes ? countRes.total : 0;

    const items = await env.DB.prepare('SELECT * FROM subscribers ORDER BY created_at DESC LIMIT ? OFFSET ?')
      .bind(limit, offset)
      .all();

    return successResponse(items.results, undefined, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  return errorResponse('Not found', 404);
}
