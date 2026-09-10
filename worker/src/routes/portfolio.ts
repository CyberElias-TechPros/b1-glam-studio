import { Env } from '../types';
import { generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handlePortfolioRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. GET /api/portfolio (Public list items)
  if (path === '/api/portfolio' && method === 'GET') {
    const category = url.searchParams.get('category');
    const featured = url.searchParams.get('featured') === 'true';

    let query = 'SELECT * FROM portfolio_items WHERE 1=1';
    const params: string[] = [];

    if (category && category !== 'All') {
      query += ' AND category = ?';
      params.push(category);
    }
    if (featured) {
      query += ' AND is_featured = 1';
    }
    query += ' ORDER BY display_order ASC, created_at DESC';

    const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);
    const { results } = await stmt.all();

    return successResponse(results);
  }

  // 2. POST /api/portfolio/:id/like (Public toggle like)
  const likeMatch = path.match(/^\/api\/portfolio\/([a-zA-Z0-9_-]+)\/like$/);
  if (likeMatch && method === 'POST') {
    const itemId = likeMatch[1];
    const ip = request.headers.get('CF-Connecting-IP') || 
               request.headers.get('X-Forwarded-For') || 
               '127.0.0.1';

    // Hash IP for privacy
    const enc = new TextEncoder();
    const hashBuffer = await crypto.subtle.digest('SHA-256', enc.encode(ip + 'b1-salt'));
    const ipHash = Array.from(new Uint8Array(hashBuffer)).map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);

    try {
      // Check existing like
      const existing = await env.DB.prepare(
        'SELECT id FROM portfolio_likes WHERE item_id = ? AND client_ip_hash = ?'
      ).bind(itemId, ipHash).first();

      if (existing) {
        // Unlike
        await env.DB.prepare('DELETE FROM portfolio_likes WHERE item_id = ? AND client_ip_hash = ?')
          .bind(itemId, ipHash)
          .run();
        await env.DB.prepare('UPDATE portfolio_items SET likes_count = MAX(0, likes_count - 1) WHERE id = ?')
          .bind(itemId)
          .run();

        return successResponse({ liked: false }, 'Unliked look');
      } else {
        // Like
        const id = generateUUID();
        const now = new Date().toISOString();
        await env.DB.prepare(
          'INSERT INTO portfolio_likes (id, item_id, client_ip_hash, created_at) VALUES (?, ?, ?, ?)'
        ).bind(id, itemId, ipHash, now).run();
        await env.DB.prepare('UPDATE portfolio_items SET likes_count = likes_count + 1 WHERE id = ?')
          .bind(itemId)
          .run();

        return successResponse({ liked: true }, 'Liked look! ❤️');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to like: ${msg}`, 500);
    }
  }

  // 3. POST /api/portfolio (Admin create item)
  if (path === '/api/portfolio' && method === 'POST') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    try {
      const body = await request.json() as {
        title?: string;
        category?: string;
        description?: string;
        imageUrl?: string;
        webpUrl?: string;
        isFeatured?: boolean;
        displayOrder?: number;
      };

      if (!body.title || !body.imageUrl || !body.category) {
        return errorResponse('Title, category, and imageUrl are required', 400);
      }

      const id = generateUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `INSERT INTO portfolio_items (
          id, title, category, description, image_url, webp_url,
          is_featured, likes_count, display_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, 0, ?, ?, ?)`
      ).bind(
        id,
        body.title.trim(),
        body.category.trim(),
        body.description?.trim() || null,
        body.imageUrl.trim(),
        body.webpUrl?.trim() || null,
        body.isFeatured ? 1 : 0,
        body.displayOrder || 0,
        now,
        now
      ).run();

      return successResponse({ id }, 'Portfolio item added successfully', undefined, 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to create portfolio item: ${msg}`, 500);
    }
  }

  // 4. PUT /api/portfolio/:id (Admin update item)
  const singleMatch = path.match(/^\/api\/portfolio\/([a-zA-Z0-9_-]+)$/);
  if (singleMatch && method === 'PUT') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    try {
      const body = await request.json() as {
        title?: string;
        category?: string;
        description?: string;
        imageUrl?: string;
        webpUrl?: string;
        isFeatured?: boolean;
        displayOrder?: number;
      };

      const now = new Date().toISOString();
      await env.DB.prepare(
        `UPDATE portfolio_items SET
          title = COALESCE(?, title),
          category = COALESCE(?, category),
          description = COALESCE(?, description),
          image_url = COALESCE(?, image_url),
          webp_url = COALESCE(?, webp_url),
          is_featured = COALESCE(?, is_featured),
          display_order = COALESCE(?, display_order),
          updated_at = ?
         WHERE id = ?`
      ).bind(
        body.title || null,
        body.category || null,
        body.description || null,
        body.imageUrl || null,
        body.webpUrl || null,
        body.isFeatured !== undefined ? (body.isFeatured ? 1 : 0) : null,
        body.displayOrder !== undefined ? body.displayOrder : null,
        now,
        id
      ).run();

      return successResponse(null, 'Portfolio item updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to update item: ${msg}`, 500);
    }
  }

  // 5. DELETE /api/portfolio/:id (Admin delete item)
  if (singleMatch && method === 'DELETE') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    await env.DB.prepare('DELETE FROM portfolio_items WHERE id = ?').bind(id).run();
    return successResponse(null, 'Portfolio item deleted successfully');
  }

  return errorResponse('Not found', 404);
}
