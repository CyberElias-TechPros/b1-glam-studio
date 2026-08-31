import { UserTokenPayload } from '../types';

/**
 * Generate a cryptographically secure random salt in hex format.
 */
export function generateSalt(length: number = 16): string {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return Array.from(bytes)
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Hash a password using PBKDF2 with SHA-256 and 100,000 iterations.
 */
export async function hashPassword(password: string, saltHex: string): Promise<string> {
  const enc = new TextEncoder();
  const passwordKey = await crypto.subtle.importKey(
    'raw',
    enc.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits']
  );

  const saltBytes = new Uint8Array(
    saltHex.match(/.{1,2}/g)?.map((byte) => parseInt(byte, 16)) || []
  );

  const derivedBits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: saltBytes,
      iterations: 100000,
      hash: 'SHA-256',
    },
    passwordKey,
    256
  );

  return Array.from(new Uint8Array(derivedBits))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Verify a password against stored hash and salt in constant time.
 */
export async function verifyPassword(
  password: string,
  storedHash: string,
  saltHex: string
): Promise<boolean> {
  const calculatedHash = await hashPassword(password, saltHex);
  if (calculatedHash.length !== storedHash.length) return false;

  let match = 0;
  for (let i = 0; i < calculatedHash.length; i++) {
    match |= calculatedHash.charCodeAt(i) ^ storedHash.charCodeAt(i);
  }
  return match === 0;
}

/**
 * Base64URL encode string or Uint8Array
 */
function base64UrlEncode(input: string | Uint8Array): string {
  let str = '';
  if (typeof input === 'string') {
    str = btoa(unescape(encodeURIComponent(input)));
  } else {
    str = btoa(String.fromCharCode(...input));
  }
  return str.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/**
 * Base64URL decode to string
 */
function base64UrlDecode(input: string): string {
  let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4) {
    base64 += '=';
  }
  return decodeURIComponent(escape(atob(base64)));
}

/**
 * Create a signed JWT token using HMAC-SHA256
 */
export async function createJwt(
  payload: Omit<UserTokenPayload, 'iat' | 'exp'>,
  secret: string,
  expiresInSeconds: number = 86400 * 7 // 7 days
): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const fullPayload: UserTokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
  };

  const encodedHeader = base64UrlEncode(JSON.stringify(header));
  const encodedPayload = base64UrlEncode(JSON.stringify(fullPayload));
  const data = `${encodedHeader}.${encodedPayload}`;

  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret || 'default-fallback-b1-secret-key-change-in-prod'),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  const encodedSignature = base64UrlEncode(new Uint8Array(signature));

  return `${data}.${encodedSignature}`;
}

/**
 * Verify and parse a JWT token using HMAC-SHA256
 */
export async function verifyJwt(
  token: string,
  secret: string
): Promise<UserTokenPayload | null> {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const data = `${encodedHeader}.${encodedPayload}`;

    const enc = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      enc.encode(secret || 'default-fallback-b1-secret-key-change-in-prod'),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    // Convert signature back from base64Url
    let base64Sig = encodedSignature.replace(/-/g, '+').replace(/_/g, '/');
    while (base64Sig.length % 4) {
      base64Sig += '=';
    }
    const sigBinary = atob(base64Sig);
    const sigBytes = new Uint8Array(sigBinary.length);
    for (let i = 0; i < sigBinary.length; i++) {
      sigBytes[i] = sigBinary.charCodeAt(i);
    }

    const isValid = await crypto.subtle.verify(
      'HMAC',
      key,
      sigBytes,
      enc.encode(data)
    );
    if (!isValid) return null;

    const payloadJson = base64UrlDecode(encodedPayload);
    const payload: UserTokenPayload = JSON.parse(payloadJson);

    // Check expiration
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < now) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Generate a friendly Booking Reference Code (e.g. B1-2026-X8K9)
 */
export function generateBookingReference(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let randomPart = '';
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  for (let i = 0; i < 4; i++) {
    randomPart += chars[bytes[i] % chars.length];
  }
  const year = new Date().getFullYear();
  return `B1-${year}-${randomPart}`;
}

/**
 * Generate a standard UUID v4
 */
export function generateUUID(): string {
  return crypto.randomUUID();
}
