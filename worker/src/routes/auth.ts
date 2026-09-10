import { Env } from '../types';
import { generateSalt, hashPassword, verifyPassword, createJwt, generateUUID } from '../utils/crypto';
import { successResponse, errorResponse } from '../utils/response';
import { requireAuth } from '../middleware/auth';

/**
 * Handle Auth Routes:
 * POST /api/auth/login
 * POST /api/auth/register
 * GET  /api/auth/me
 * POST /api/auth/change-password
 * POST /api/auth/logout
 */
export async function handleAuthRoutes(
  request: Request,
  env: Env,
  url: URL
): Promise<Response> {
  const path = url.pathname;
  const method = request.method;

  // 1. POST /api/auth/login
  if (path === '/api/auth/login' && method === 'POST') {
    try {
      const body = await request.json() as { email?: string; password?: string };
      const email = body.email?.trim().toLowerCase();
      const password = body.password;

      if (!email || !password) {
        return errorResponse('Email and password are required', 400);
      }

      // Check if user exists in D1
      let user = await env.DB.prepare(
        'SELECT id, email, password_hash, password_salt, name, role FROM users WHERE email = ?'
      ).bind(email).first<{
        id: string;
        email: string;
        password_hash: string;
        password_salt: string;
        name: string;
        role: 'superadmin' | 'admin' | 'staff';
      }>();

      // Bootstrap: if no users exist at all in the database, allow first login to initialize superadmin
      if (!user) {
        const countRes = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>();
        const totalUsers = countRes ? countRes.count : 0;
        if (totalUsers === 0 && (email === 'admin@b1touchartistry.com' || email.includes('@'))) {
          // Initialize first superadmin
          const salt = generateSalt();
          const hash = await hashPassword(password, salt);
          const userId = generateUUID();
          const now = new Date().toISOString();
          await env.DB.prepare(
            'INSERT INTO users (id, email, password_hash, password_salt, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
          ).bind(userId, email, hash, salt, 'B1touch Studio Admin', 'superadmin', now, now).run();

          user = {
            id: userId,
            email,
            password_hash: hash,
            password_salt: salt,
            name: 'B1touch Studio Admin',
            role: 'superadmin',
          };
        }
      }

      if (!user) {
        return errorResponse('Invalid email or password', 401);
      }

      // Verify password
      const isValid = await verifyPassword(password, user.password_hash, user.password_salt);
      if (!isValid) {
        return errorResponse('Invalid email or password', 401);
      }

      // Update last login
      const now = new Date().toISOString();
      await env.DB.prepare('UPDATE users SET last_login = ?, updated_at = ? WHERE id = ?')
        .bind(now, now, user.id)
        .run();

      // Generate JWT
      const token = await createJwt(
        {
          userId: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
        env.JWT_SECRET || 'default-fallback-b1-secret-key-change-in-prod'
      );

      // Log activity
      await env.DB.prepare(
        'INSERT INTO activity_logs (id, actor_id, actor_email, action, resource_type, resource_id, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)'
      ).bind(generateUUID(), user.id, user.email, 'auth.login', 'user', user.id, now).run();

      return successResponse(
        {
          token,
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          },
        },
        'Login successful',
        undefined,
        200,
        {
          'Set-Cookie': `b1_auth_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800; Secure`,
        }
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Login failed: ${msg}`, 500);
    }
  }

  // 2. POST /api/auth/register
  if (path === '/api/auth/register' && method === 'POST') {
    try {
      const body = await request.json() as {
        email?: string;
        password?: string;
        name?: string;
        role?: 'superadmin' | 'admin' | 'staff';
      };

      const email = body.email?.trim().toLowerCase();
      const password = body.password;
      const name = body.name?.trim() || 'Staff Member';
      const role = body.role || 'staff';

      if (!email || !password || password.length < 8) {
        return errorResponse('Valid email and password (min 8 chars) are required', 400);
      }

      // Check if this is the first user bootstrap OR require admin authentication
      const countRes = await env.DB.prepare('SELECT COUNT(*) as count FROM users').first<{ count: number }>();
      const totalUsers = countRes ? countRes.count : 0;

      if (totalUsers > 0) {
        // Require superadmin/admin auth
        const authGuard = await requireAuth(request, env, ['superadmin', 'admin']);
        if (authGuard instanceof Response) return authGuard;
      }

      // Check existing email
      const existing = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
        .bind(email)
        .first();
      if (existing) {
        return errorResponse('User with this email already exists', 409);
      }

      const salt = generateSalt();
      const hash = await hashPassword(password, salt);
      const userId = generateUUID();
      const now = new Date().toISOString();

      await env.DB.prepare(
        'INSERT INTO users (id, email, password_hash, password_salt, name, role, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(userId, email, hash, salt, name, role, now, now).run();

      const token = await createJwt(
        {
          userId,
          email,
          name,
          role,
        },
        env.JWT_SECRET || 'default-fallback-b1-secret-key-change-in-prod'
      );

      return successResponse(
        {
          token,
          user: { id: userId, email, name, role },
        },
        'User registered successfully',
        undefined,
        201
      );
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Registration failed: ${msg}`, 500);
    }
  }

  // 3. GET /api/auth/me
  if (path === '/api/auth/me' && method === 'GET') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    const user = await env.DB.prepare(
      'SELECT id, email, name, role, avatar_url, created_at, last_login FROM users WHERE id = ?'
    ).bind(authGuard.user.userId).first();

    if (!user) {
      return errorResponse('User not found', 404);
    }

    return successResponse(user);
  }

  // 4. POST /api/auth/change-password
  if (path === '/api/auth/change-password' && method === 'POST') {
    const authGuard = await requireAuth(request, env);
    if (authGuard instanceof Response) return authGuard;

    try {
      const body = await request.json() as { currentPassword?: string; newPassword?: string };
      if (!body.currentPassword || !body.newPassword || body.newPassword.length < 8) {
        return errorResponse('Current password and new password (min 8 chars) are required', 400);
      }

      const user = await env.DB.prepare(
        'SELECT password_hash, password_salt FROM users WHERE id = ?'
      ).bind(authGuard.user.userId).first<{ password_hash: string; password_salt: string }>();

      if (!user) return errorResponse('User not found', 404);

      const isValid = await verifyPassword(body.currentPassword, user.password_hash, user.password_salt);
      if (!isValid) {
        return errorResponse('Incorrect current password', 400);
      }

      const newSalt = generateSalt();
      const newHash = await hashPassword(body.newPassword, newSalt);
      const now = new Date().toISOString();

      await env.DB.prepare(
        'UPDATE users SET password_hash = ?, password_salt = ?, updated_at = ? WHERE id = ?'
      ).bind(newHash, newSalt, now, authGuard.user.userId).run();

      return successResponse(null, 'Password updated successfully');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return errorResponse(`Password change failed: ${msg}`, 500);
    }
  }

  // 5. POST /api/auth/logout
  if (path === '/api/auth/logout' && method === 'POST') {
    return successResponse(
      null,
      'Logged out successfully',
      undefined,
      200,
      {
        'Set-Cookie': 'b1_auth_token=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax; Secure',
      }
    );
  }

  return errorResponse('Not found', 404);
}
