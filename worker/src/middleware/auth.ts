import { Env, UserTokenPayload } from '../types';
import { verifyJwt } from '../utils/crypto';
import { errorResponse } from '../utils/response';

/**
 * Extract and verify JWT from Authorization header or Cookie.
 */
export async function authenticateRequest(
  request: Request,
  env: Env
): Promise<{ user: UserTokenPayload | null; error?: string }> {
  const authHeader = request.headers.get('Authorization');
  let token: string | null = null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7).trim();
  } else {
    // Check cookie fallback
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
      const match = cookieHeader.match(/b1_auth_token=([^;]+)/);
      if (match) {
        token = match[1];
      }
    }
  }

  if (!token) {
    return { user: null, error: 'Authorization token required' };
  }

  const payload = await verifyJwt(token, env.JWT_SECRET || 'default-fallback-b1-secret-key-change-in-prod');
  if (!payload) {
    return { user: null, error: 'Invalid or expired authentication token' };
  }

  return { user: payload };
}

/**
 * Guard that ensures request is authenticated as an admin or staff.
 */
export async function requireAuth(
  request: Request,
  env: Env,
  allowedRoles: ('superadmin' | 'admin' | 'staff')[] = ['superadmin', 'admin', 'staff']
): Promise<{ user: UserTokenPayload } | Response> {
  const { user, error } = await authenticateRequest(request, env);
  if (!user || error) {
    return errorResponse(error || 'Unauthorized', 401);
  }

  if (!allowedRoles.includes(user.role)) {
    return errorResponse('Forbidden: Insufficient privileges', 403);
  }

  return { user };
}
