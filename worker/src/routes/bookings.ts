import { Env } from '../types';
import { generateBookingReference, generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handleBookingRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. POST /api/bookings (Public booking request)
  if (path === '/api/bookings' && method === 'POST') {
    try {
      const body = await request.json() as {
        name?: string;
        phone?: string;
        email?: string;
        instagram?: string;
        service?: string;
        bookingDate?: string;
        bookingTime?: string;
        locationType?: 'studio' | 'home' | 'venue';
        eventType?: string;
        address?: string;
        notes?: string;
      };

      const name = body.name?.trim();
      const phone = body.phone?.trim();
      const service = body.service?.trim();
      const bookingDate = body.bookingDate?.trim();
      const bookingTime = body.bookingTime?.trim() || '10:00 AM';
      const locationType = body.locationType || 'studio';

      if (!name || !phone || !service || !bookingDate) {
        return errorResponse('Name, phone, service, and booking date are required', 400);
      }

      // Estimate price based on service
      const servicePrices: Record<string, number> = {
        'Bridal Makeup': 225000,
        'Owambe / Event Glam': 100000,
        'Editorial & Photoshoot': 150000,
        'Birthday Glam': 125000,
        'Film & TV Makeup': 250000,
        'Makeup Masterclass': 400000,
      };
      let servicePrice = servicePrices[service] || 100000;
      if (locationType === 'home') {
        servicePrice += 50000;
      }

      const id = generateUUID();
      const referenceCode = generateBookingReference();
      const now = new Date().toISOString();

      await env.DB.prepare(
        `INSERT INTO bookings (
          id, reference_code, name, phone, email, instagram, service,
          service_price, booking_date, booking_time, location_type,
          event_type, address, notes, status, created_at, updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
      ).bind(
        id,
        referenceCode,
        name,
        phone,
        body.email?.trim() || null,
        body.instagram?.trim() || null,
        service,
        servicePrice,
        bookingDate,
        bookingTime,
        locationType,
        body.eventType?.trim() || null,
        body.address?.trim() || null,
        body.notes?.trim() || null,
        now,
        now
      ).run();

      // Log activity
      await env.DB.prepare(
        'INSERT INTO activity_logs (id, action, resource_type, resource_id, details_json, created_at) VALUES (?, ?, ?, ?, ?, ?)'
      ).bind(
        generateUUID(),
        'booking.created',
        'booking',
        id,
        JSON.stringify({ referenceCode, service, bookingDate, name, phone }),
        now
      ).run();

      const whatsappText = encodeURIComponent(
        `Hi B1touch Artistry! I submitted a booking request.\n\n` +
        `🔖 Reference: ${referenceCode}\n` +
        `👤 Name: ${name}\n` +
        `💄 Service: ${service}\n` +
        `📅 Date: ${bookingDate}\n` +
        `⏰ Time: ${bookingTime}\n` +
        `📍 Location: ${locationType === 'home' ? 'Home/Location' : 'Ajah Studio'}\n\n` +
        `Please confirm my appointment. Thank you!`
      );

      return successResponse(
        {
          id,
          referenceCode,
          name,
          phone,
          service,
          bookingDate,
          bookingTime,
          locationType,
          servicePrice,
          status: 'pending',
          whatsappUrl: `https://wa.me/2348061651126?text=${whatsappText}`,
        },
        'Booking request submitted successfully! We will confirm your session shortly.',
        undefined,
        201
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to submit booking: ${msg}`, 500);
    }
  }

  // 2. GET /api/bookings/lookup/:code (Public status lookup)
  if (path.startsWith('/api/bookings/lookup/') && method === 'GET') {
    const code = decodeURIComponent(path.replace('/api/bookings/lookup/', '')).trim().toUpperCase();
    if (!code) return errorResponse('Booking reference code required', 400);

    const booking = await env.DB.prepare(
      `SELECT reference_code, name, service, service_price, booking_date, booking_time,
              location_type, event_type, status, created_at, updated_at
       FROM bookings WHERE UPPER(reference_code) = ?`
    ).bind(code).first();

    if (!booking) {
      return errorResponse(`No booking found with reference code "${code}"`, 404);
    }

    return successResponse(booking);
  }

  // 3. GET /api/bookings/availability (Public check available slots)
  if (path === '/api/bookings/availability' && method === 'GET') {
    const month = url.searchParams.get('month'); // e.g. "2026-02"
    let query = `SELECT booking_date, booking_time, COUNT(*) as count FROM bookings WHERE status IN ('pending', 'confirmed')`;
    const params: string[] = [];

    if (month) {
      query += ` AND booking_date LIKE ?`;
      params.push(`${month}%`);
    }
    query += ` GROUP BY booking_date, booking_time`;

    const stmt = params.length > 0 ? env.DB.prepare(query).bind(...params) : env.DB.prepare(query);
    const { results } = await stmt.all();

    return successResponse(results);
  }

  // 4. GET /api/bookings (Admin list bookings)
  if (path === '/api/bookings' && method === 'GET') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const status = url.searchParams.get('status');
    const search = url.searchParams.get('search')?.trim();
    const page = Math.max(1, parseInt(url.searchParams.get('page') || '1', 10));
    const limit = Math.min(100, Math.max(1, parseInt(url.searchParams.get('limit') || '20', 10)));
    const offset = (page - 1) * limit;

    let baseQuery = `FROM bookings WHERE 1=1`;
    const params: (string | number)[] = [];

    if (status && status !== 'all') {
      baseQuery += ` AND status = ?`;
      params.push(status);
    }
    if (search) {
      baseQuery += ` AND (name LIKE ? OR phone LIKE ? OR reference_code LIKE ? OR service LIKE ?)`;
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    // Total count
    const countRes = await env.DB.prepare(`SELECT COUNT(*) as total ${baseQuery}`).bind(...params).first<{ total: number }>();
    const total = countRes ? countRes.total : 0;

    // Items
    const itemsRes = await env.DB.prepare(
      `SELECT * ${baseQuery} ORDER BY booking_date DESC, created_at DESC LIMIT ? OFFSET ?`
    ).bind(...params, limit, offset).all();

    return successResponse(itemsRes.results, undefined, {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  }

  // 5. GET /api/bookings/:id (Admin single booking)
  const singleMatch = path.match(/^\/api\/bookings\/([a-zA-Z0-9_-]+)$/);
  if (singleMatch && method === 'GET') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first();
    if (!booking) return errorResponse('Booking not found', 404);

    return successResponse(booking);
  }

  // 6. PATCH /api/bookings/:id/status (Admin update status)
  const statusMatch = path.match(/^\/api\/bookings\/([a-zA-Z0-9_-]+)\/status$/);
  if (statusMatch && method === 'PATCH') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const id = statusMatch[1];
    try {
      const body = await request.json() as {
        status?: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
        adminNotes?: string;
        servicePrice?: number;
      };

      if (!body.status) {
        return errorResponse('Status is required', 400);
      }

      const booking = await env.DB.prepare('SELECT * FROM bookings WHERE id = ?').bind(id).first<{
        reference_code: string;
        status: string;
      }>();
      if (!booking) return errorResponse('Booking not found', 404);

      const now = new Date().toISOString();
      let query = 'UPDATE bookings SET status = ?, updated_at = ?';
      const params: (string | number)[] = [body.status, now];

      if (body.adminNotes !== undefined) {
        query += ', admin_notes = ?';
        params.push(body.adminNotes);
      }
      if (body.servicePrice !== undefined) {
        query += ', service_price = ?';
        params.push(body.servicePrice);
      }
      query += ' WHERE id = ?';
      params.push(id);

      await env.DB.prepare(query).bind(...params).run();

      // Log activity
      await env.DB.prepare(
        'INSERT INTO activity_logs (id, actor_id, actor_email, action, resource_type, resource_id, details_json, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(
        generateUUID(),
        authGuard.user.userId,
        authGuard.user.email,
        'booking.status_update',
        'booking',
        id,
        JSON.stringify({ oldStatus: booking.status, newStatus: body.status, referenceCode: booking.reference_code }),
        now
      ).run();

      return successResponse(null, `Booking status updated to ${body.status}`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to update booking status: ${msg}`, 500);
    }
  }

  // 7. DELETE /api/bookings/:id (Admin delete booking)
  if (singleMatch && method === 'DELETE') {
    const authGuard = await requireAuth(request, env, ['superadmin', 'admin']);
    if (authGuard instanceof Response) return authGuard;

    const id = singleMatch[1];
    await env.DB.prepare('DELETE FROM bookings WHERE id = ?').bind(id).run();
    return successResponse(null, 'Booking deleted successfully');
  }

  return errorResponse('Not found', 404);
}
