import { Env } from '../types';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

export async function handleStatsRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  if (path === '/api/stats' && method === 'GET') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    try {
      // 1. Total bookings
      const bookingsCountRes = await env.DB.prepare('SELECT COUNT(*) as count FROM bookings').first<{ count: number }>();
      const totalBookings = bookingsCountRes?.count || 0;

      // 2. Pending bookings
      const pendingBookingsRes = await env.DB.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = "pending"').first<{ count: number }>();
      const pendingBookings = pendingBookingsRes?.count || 0;

      // 3. Confirmed bookings
      const confirmedBookingsRes = await env.DB.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = "confirmed"').first<{ count: number }>();
      const confirmedBookings = confirmedBookingsRes?.count || 0;

      // 4. Completed bookings
      const completedBookingsRes = await env.DB.prepare('SELECT COUNT(*) as count FROM bookings WHERE status = "completed"').first<{ count: number }>();
      const completedBookings = completedBookingsRes?.count || 0;

      // 5. Total estimated revenue from completed/confirmed
      const revenueRes = await env.DB.prepare(
        'SELECT SUM(service_price) as total_rev FROM bookings WHERE status IN ("confirmed", "completed")'
      ).first<{ total_rev: number | null }>();
      const totalRevenue = revenueRes?.total_rev || 0;

      // 6. Inquiries total & unread
      const inquiriesCountRes = await env.DB.prepare('SELECT COUNT(*) as count FROM inquiries').first<{ count: number }>();
      const unreadInquiriesRes = await env.DB.prepare('SELECT COUNT(*) as count FROM inquiries WHERE is_read = 0').first<{ count: number }>();
      const totalInquiries = inquiriesCountRes?.count || 0;
      const unreadInquiries = unreadInquiriesRes?.count || 0;

      // 7. Subscribers count
      const subscribersRes = await env.DB.prepare('SELECT COUNT(*) as count FROM subscribers WHERE is_active = 1').first<{ count: number }>();
      const totalSubscribers = subscribersRes?.count || 0;

      // 8. Testimonials count
      const testimonialsRes = await env.DB.prepare('SELECT COUNT(*) as count FROM testimonials WHERE status = "approved"').first<{ count: number }>();
      const totalReviews = testimonialsRes?.count || 0;

      // 9. Blog posts count
      const blogPostsRes = await env.DB.prepare('SELECT COUNT(*) as count FROM blog_posts WHERE is_published = 1').first<{ count: number }>();
      const totalPosts = blogPostsRes?.count || 0;

      // 10. Recent Bookings
      const recentBookings = await env.DB.prepare(
        'SELECT id, reference_code, name, phone, service, booking_date, booking_time, location_type, status, created_at FROM bookings ORDER BY created_at DESC LIMIT 5'
      ).all();

      // 11. Recent Activity
      const recentActivity = await env.DB.prepare(
        'SELECT id, actor_email, action, resource_type, resource_id, details_json, created_at FROM activity_logs ORDER BY created_at DESC LIMIT 10'
      ).all();

      return successResponse({
        kpis: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          totalRevenue,
          totalInquiries,
          unreadInquiries,
          totalSubscribers,
          totalReviews,
          totalPosts,
        },
        recentBookings: recentBookings.results,
        recentActivity: recentActivity.results,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Failed to load stats: ${msg}`, 500);
    }
  }

  return errorResponse('Not found', 404);
}
