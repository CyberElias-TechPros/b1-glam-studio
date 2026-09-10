import { Env } from '../types';
import { generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handleServicesRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. GET /api/services (Public list services)
  if (path === '/api/services' && method === 'GET') {
    const { results } = await env.DB.prepare(
      'SELECT * FROM services ORDER BY display_order ASC, created_at ASC'
    ).all();

    const formatted = results.map((r) => ({
      ...r,
      features: typeof r.features_json === 'string' ? JSON.parse(r.features_json) : [],
    }));

    return successResponse(formatted);
  }

  // 2. POST /api/services (Admin create service)
  if (path === '/api/services' && method === 'POST') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    try {
      const body = await request.json() as {
        title?: string;
        category?: string;
        priceFormatted?: string;
        priceAmount?: number;
        description?: string;
        features?: string[];
        isPopular?: boolean;
        displayOrder?: number;
      };

      if (!body.title || !body.priceFormatted || !body.description) {
        return errorResponse('Title, priceFormatted, and description are required', 400);
      }

      const id = generateUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `INSERT INTO services (
          id, title, category, price_formatted, price_amount,
          description, features_json, is_popular, display_order, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
      ).bind(
        id,
        body.title.trim(),
        body.category || 'main',
        body.priceFormatted.trim(),
        body.priceAmount || 0,
        body.description.trim(),
        JSON.stringify(body.features || []),
        body.isPopular ? 1 : 0,
        body.displayOrder || 0,
        now,
        now
      ).run();

      return successResponse({ id }, 'Service created successfully', undefined, 201);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to create service: ${msg}`, 500);
    }
  }

  // 3. PUT /api/services/:id (Admin update service)
  const singleMatch = path.match(/^\/api\/services\/([a-zA-Z0-9_-]+)$/);
  if (singleMatch && method === 'PUT') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    try {
      const body = await request.json() as {
        title?: string;
        category?: string;
        priceFormatted?: string;
        priceAmount?: number;
        description?: string;
        features?: string[];
        isPopular?: boolean;
        displayOrder?: number;
      };

      const now = new Date().toISOString();
      await env.DB.prepare(
        `UPDATE services SET
          title = COALESCE(?, title),
          category = COALESCE(?, category),
          price_formatted = COALESCE(?, price_formatted),
          price_amount = COALESCE(?, price_amount),
          description = COALESCE(?, description),
          features_json = COALESCE(?, features_json),
          is_popular = COALESCE(?, is_popular),
          display_order = COALESCE(?, display_order),
          updated_at = ?
         WHERE id = ?`
      ).bind(
        body.title || null,
        body.category || null,
        body.priceFormatted || null,
        body.priceAmount !== undefined ? body.priceAmount : null,
        body.description || null,
        body.features ? JSON.stringify(body.features) : null,
        body.isPopular !== undefined ? (body.isPopular ? 1 : 0) : null,
        body.displayOrder !== undefined ? body.displayOrder : null,
        now,
        id
      ).run();

      return successResponse(null, 'Service updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to update service: ${msg}`, 500);
    }
  }

  // 4. DELETE /api/services/:id (Admin delete service)
  if (singleMatch && method === 'DELETE') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    await env.DB.prepare('DELETE FROM services WHERE id = ?').bind(id).run();
    return successResponse(null, 'Service deleted successfully');
  }

  return errorResponse('Not found', 404);
}
