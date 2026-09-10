import { Env } from '../types';
import { generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handleContactRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. POST /api/contact (Public submit contact message)
  if (path === '/api/contact' && method === 'POST') {
    try {
      const body = await request.json() as {
        name?: string;
        email?: string;
        phone?: string;
        subject?: string;
        message?: string;
      };

      const name = body.name?.trim();
      const message = body.message?.trim();
      if (!name || !message) {
        return errorResponse('Name and message are required', 400);
      }

      const id = generateUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `INSERT INTO inquiries (id, name, email, phone, subject, message, is_read, is_replied, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, 0, 0, ?, ?)`
      ).bind(
        id,
        name,
        body.email?.trim() || null,
        body.phone?.trim() || null,
        body.subject?.trim() || null,
        message,
        now,
        now
      ).run();

      return successResponse(
        { id },
        'Message sent successfully! We will get back to you within 24 hours.',
        undefined,
        201
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to send message: ${msg}`, 500);
    }
  }

  // 2. GET /api/contact (Admin list messages)
  if (path === '/api/contact' && method === 'GET') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const unreadOnly = url.searchParams.get('unread') === 'true';
    const search = url.searchParams.get('search')?.trim();
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    let baseQuery = 'FROM inquiries WHERE 1=1';
    const params: (string | number)[] = [];

    if (unreadOnly) {
      baseQuery += ' AND is_read = 0';
    }
    if (search) {
      baseQuery += ' AND (name LIKE ? OR email LIKE ? OR phone LIKE ? OR message LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    const countRes = await env.DB.prepare(`SELECT COUNT(*) as total ${baseQuery}`).bind(...params).first<{ total: number }>();
    const total = countRes ? countRes.total : 0;

    const items = await env.DB.prepare(`SELECT * ${baseQuery} ORDER BY created_at DESC LIMIT ? OFFSET ?`)
      .bind(...params, limit, offset)
      .all();

    return successResponse(items.results, undefined, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  // 3. PATCH /api/contact/:id (Admin mark read/replied)
  const singleMatch = path.match(/^\/api\/contact\/([a-zA-Z0-9_-]+)$/);
  if (singleMatch && method === 'PATCH') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    try {
      const body = await request.json() as {
        is_read?: boolean;
        is_replied?: boolean;
        admin_notes?: string;
      };

      const now = new Date().toISOString();
      let query = 'UPDATE inquiries SET updated_at = ?';
      const params: (string | number)[] = [now];

      if (body.is_read !== undefined) {
        query += ', is_read = ?';
        params.push(body.is_read ? 1 : 0);
      }
      if (body.is_replied !== undefined) {
        query += ', is_replied = ?';
        params.push(body.is_replied ? 1 : 0);
      }
      if (body.admin_notes !== undefined) {
        query += ', admin_notes = ?';
        params.push(body.admin_notes);
      }
      query += ' WHERE id = ?';
      params.push(id);

      await env.DB.prepare(query).bind(...params).run();

      return successResponse(null, 'Inquiry updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to update inquiry: ${msg}`, 500);
    }
  }

  // 4. DELETE /api/contact/:id (Admin delete message)
  if (singleMatch && method === 'DELETE') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    await env.DB.prepare('DELETE FROM inquiries WHERE id = ?').bind(id).run();
    return successResponse(null, 'Message deleted successfully');
  }

  return errorResponse('Not found', 404);
}
