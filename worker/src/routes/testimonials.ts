import { Env } from '../types';
import { generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handleTestimonialsRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. GET /api/testimonials (Public list approved testimonials)
  if (path === '/api/testimonials' && method === 'GET') {
    const featured = url.searchParams.get('featured') === 'true';
    let query = `SELECT id, name, event_type, rating, quote, is_featured, photo_url, created_at
                 FROM testimonials WHERE status = 'approved'`;
    if (featured) {
      query += ' AND is_featured = 1';
    }
    query += ' ORDER BY is_featured DESC, created_at DESC';

    const { results } = await env.DB.prepare(query).all();
    return successResponse(results);
  }

  // 2. POST /api/testimonials (Public submit review)
  if (path === '/api/testimonials' && method === 'POST') {
    try {
      const body = await request.json() as {
        name?: string;
        eventType?: string;
        rating?: number;
        quote?: string;
        photoUrl?: string;
      };

      const name = body.name?.trim();
      const eventType = body.eventType?.trim() || 'Glam Session';
      const quote = body.quote?.trim();
      const rating = Math.min(5, Math.max(1, body.rating || 5));

      if (!name || !quote) {
        return errorResponse('Name and review message are required', 400);
      }

      const id = generateUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `INSERT INTO testimonials (id, name, event_type, rating, quote, is_featured, status, photo_url, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, 0, 'approved', ?, ?, ?)`
      ).bind(id, name, eventType, rating, quote, body.photoUrl || null, now, now).run();

      return successResponse(
        { id },
        'Thank you for your lovely review! It has been posted to our wall of love. ✨',
        undefined,
        201
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to submit review: ${msg}`, 500);
    }
  }

  // 3. GET /api/testimonials/admin (Admin list all reviews)
  if (path === '/api/testimonials/admin' && method === 'GET') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const status = url.searchParams.get('status');
    let query = 'SELECT * FROM testimonials WHERE 1=1';
    const params: string[] = [];

    if (status && status !== 'all') {
      query += ' AND status = ?';
      params.push(status);
    }
    query += ' ORDER BY created_at DESC';

    const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);
    const { results } = await stmt.all();

    return successResponse(results);
  }

  // 4. PATCH /api/testimonials/:id (Admin approve/feature/reject)
  const singleMatch = path.match(/^\/api\/testimonials\/([a-zA-Z0-9_-]+)$/);
  if (singleMatch && method === 'PATCH') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    try {
      const body = await request.json() as {
        status?: 'pending' | 'approved' | 'rejected';
        is_featured?: boolean;
      };

      const now = new Date().toISOString();
      let query = 'UPDATE testimonials SET updated_at = ?';
      const params: (string | number)[] = [now];

      if (body.status !== undefined) {
        query += ', status = ?';
        params.push(body.status);
      }
      if (body.is_featured !== undefined) {
        query += ', is_featured = ?';
        params.push(body.is_featured ? 1 : 0);
      }
      query += ' WHERE id = ?';
      params.push(id);

      await env.DB.prepare(query).bind(...params).run();

      return successResponse(null, 'Testimonial updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to update testimonial: ${msg}`, 500);
    }
  }

  // 5. DELETE /api/testimonials/:id (Admin delete review)
  if (singleMatch && method === 'DELETE') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    await env.DB.prepare('DELETE FROM testimonials WHERE id = ?').bind(id).run();
    return successResponse(null, 'Testimonial deleted successfully');
  }

  return errorResponse('Not found', 404);
}
