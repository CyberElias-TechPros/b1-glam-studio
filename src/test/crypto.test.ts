import { describe, it, expect } from 'vitest';
import {
  generateSalt,
  hashPassword,
  verifyPassword,
  createJwt,
  verifyJwt,
  generateBookingReference,
  generateUUID,
} from '../../worker/src/utils/crypto';

describe('Web Crypto Utilities', () => {
  it('should generate a 32-character hex salt', () => {
    const salt1 = generateSalt(16);
    const salt2 = generateSalt(16);
    expect(salt1).toHaveLength(32);
    expect(salt2).toHaveLength(32);
    expect(salt1).not.toEqual(salt2);
  });

  it('should correctly hash and verify passwords using PBKDF2', async () => {
    const salt = generateSalt();
    const password = 'SuperSecurePassword123!@#';
    const hash = await hashPassword(password, salt);

    expect(hash).toBeDefined();
    expect(hash.length).toBe(64); // 256 bits = 64 hex chars

    const isValid = await verifyPassword(password, hash, salt);
    expect(isValid).toBe(true);

    const isInvalid = await verifyPassword('WrongPassword123', hash, salt);
    expect(isInvalid).toBe(false);
  });

  it('should create and verify HMAC-SHA256 JWT tokens', async () => {
    const secret = 'my-super-secret-jwt-key-for-tests-1234567890';
    const payload = {
      userId: 'user-123',
      email: 'admin@b1touchartistry.com',
      name: 'B1 Admin',
      role: 'admin' as const,
    };

    const token = await createJwt(payload, secret, 3600);
    expect(token).toBeDefined();
    expect(token.split('.')).toHaveLength(3);

    const decoded = await verifyJwt(token, secret);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe('user-123');
    expect(decoded?.email).toBe('admin@b1touchartistry.com');
    expect(decoded?.role).toBe('admin');

    // Tampered token check
    const tampered = token.slice(0, -4) + 'abcd';
    const failedDecoded = await verifyJwt(tampered, secret);
    expect(failedDecoded).toBeNull();
  });

  it('should generate valid format booking reference codes', () => {
    const code = generateBookingReference();
    const year = new Date().getFullYear();
    expect(code).toMatch(new RegExp(`^B1-${year}-[A-Z0-9]{4}$`));
  });

  it('should generate valid UUIDs', () => {
    const uuid = generateUUID();
    expect(uuid).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
