import { Env } from './types';
import { getCorsHeaders, handleOptions } from './middleware/cors';
import { checkRateLimit } from './middleware/rateLimit';
import { handleAuthRoutes } from './routes/auth';
import { handleBookingRoutes } from './routes/bookings';
import { handleContactRoutes } from './routes/contact';
import { handleNewsletterRoutes } from './routes/newsletter';
import { handleTestimonialsRoutes } from './routes/testimonials';
import { handleBlogRoutes } from './routes/blog';
import { handlePortfolioRoutes } from './routes/portfolio';
import { handleServicesRoutes } from './routes/services';
import { handleSettingsRoutes } from './routes/settings';
import { handleStatsRoutes } from './routes/stats';
import { handleUploadRoutes } from './routes/upload';
import { successResponse, errorResponse } from './utils/response';

export default {
  /**
   * Cloudflare Worker Fetch handler
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const method = request.method;

    // 1. Handle CORS Preflight
    if (method === 'OPTIONS') {
      return handleOptions(request, env);
    }

    const corsHeaders = getCorsHeaders(request, env);

    // 2. Health check
    if (url.pathname === '/api/health' || url.pathname === '/health') {
      return successResponse(
        {
          status: 'healthy',
          service: 'B1touch Artistry Cloudflare API',
          timestamp: new Date().toISOString(),
          environment: env.ENVIRONMENT || 'production',
        },
        'B1touch API is fully operational',
        undefined,
        200,
        corsHeaders
      );
    }

    // 3. Rate limiting for mutating endpoints
    if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method)) {
      const rateLimit = await checkRateLimit(request, env, 60, 60);
      if (!rateLimit.allowed) {
        return errorResponse(
          'Too many requests. Please slow down and try again in a minute.',
          429,
          undefined,
          corsHeaders
        );
      }
    }

    try {
      let response: Response;

      // 4. Route dispatcher
      if (url.pathname.startsWith('/api/auth')) {
        response = await handleAuthRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/bookings')) {
        response = await handleBookingRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/contact')) {
        response = await handleContactRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/newsletter')) {
        response = await handleNewsletterRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/testimonials')) {
        response = await handleTestimonialsRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/blog')) {
        response = await handleBlogRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/portfolio')) {
        response = await handlePortfolioRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/services')) {
        response = await handleServicesRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/settings')) {
        response = await handleSettingsRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/stats')) {
        response = await handleStatsRoutes(request, env, url);
      } else if (url.pathname.startsWith('/api/upload') || url.pathname.startsWith('/api/media/')) {
        response = await handleUploadRoutes(request, env, url);
      } else {
        response = errorResponse(`Route not found: ${method} ${url.pathname}`, 404);
      }

      // Merge CORS headers into response
      const newHeaders = new Headers(response.headers);
      for (const [key, value] of Object.entries(corsHeaders)) {
        if (!newHeaders.has(key)) {
          newHeaders.set(key, value);
        }
      }

      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: newHeaders,
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('Unhandled Worker Exception:', err);
      return errorResponse(
        `Internal Server Error: ${msg}`,
        500,
        undefined,
        corsHeaders
      );
    }
  },

  /**
   * Cloudflare Worker Scheduled Cron Trigger Handler
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    console.log(`Cron triggered at ${new Date().toISOString()}: cron=${event.cron}`);
    try {
      // Periodic cleanup of outdated logs older than 90 days
      const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
      await env.DB.prepare('DELETE FROM activity_logs WHERE created_at < ?').bind(ninetyDaysAgo).run();
      console.log('Cleaned up historical logs older than 90 days');
    } catch (err) {
      console.error('Scheduled job error:', err);
    }
  },
};
