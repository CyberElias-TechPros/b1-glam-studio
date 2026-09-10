// Cloudflare Worker Environment Bindings and Type Definitions

export interface Env {
  // Cloudflare D1 Database
  DB: D1Database;
  // Cloudflare R2 Storage for Media/Uploads
  MEDIA_BUCKET?: R2Bucket;
  // Cloudflare KV for Caching / Rate Limiting / Configuration
  CACHE_KV?: KVNamespace;
  // Environment variables / Secrets
  JWT_SECRET: string;
  ENVIRONMENT: string;
  FRONTEND_URL?: string;
  STUDIO_WHATSAPP?: string;
  STUDIO_EMAIL?: string;
}

export interface UserTokenPayload {
  userId: string;
  email: string;
  name: string;
  role: 'superadmin' | 'admin' | 'staff';
  exp: number;
  iat: number;
}

export interface AuthenticatedRequest extends Request {
  user?: UserTokenPayload;
}
