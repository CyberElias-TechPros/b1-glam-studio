import { describe, it, expect, beforeEach } from 'vitest';
import { api } from '@/lib/api';

describe('Booking Lifecycle and Storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('should successfully create a new booking request and return a reference code', async () => {
    const res = await api.bookings.create({
      name: 'Chioma Okeke',
      phone: '+2348012345678',
      email: 'chioma@example.com',
      service: 'Bridal Makeup',
      bookingDate: '2026-11-20',
      bookingTime: '11:00 AM',
      locationType: 'studio',
      notes: 'Natural glow with bronze tones.',
    });

    expect(res.success).toBe(true);
    expect(res.data).toBeDefined();
    expect(res.data?.referenceCode).toMatch(/^B1-\d{4}-[A-Z0-9]{4}$/);
    expect(res.data?.name).toBe('Chioma Okeke');
    expect(res.data?.service).toBe('Bridal Makeup');
    expect(res.data?.status).toBe('pending');
    expect(res.data?.whatsappUrl).toContain('wa.me');
  });

  it('should lookup a created booking by reference code', async () => {
    const createRes = await api.bookings.create({
      name: 'Zainab Balogun',
      phone: '+2348098765432',
      service: 'Owambe / Event Glam',
      bookingDate: '2026-12-05',
      locationType: 'home',
    });

    const refCode = createRes.data?.referenceCode;
    expect(refCode).toBeDefined();

    const lookupRes = await api.bookings.lookup(refCode!);
    expect(lookupRes.success).toBe(true);
    expect(lookupRes.data?.name).toBe('Zainab Balogun');
    expect(lookupRes.data?.service).toBe('Owambe / Event Glam');
    expect(lookupRes.data?.location_type).toBe('home');
  });

  it('should update booking status and staff notes', async () => {
    const createRes = await api.bookings.create({
      name: 'Ngozi Eze',
      phone: '+2348055555555',
      service: 'Editorial & Photoshoot',
      bookingDate: '2026-10-15',
    });

    const bookingId = createRes.data?.id;
    expect(bookingId).toBeDefined();

    const updateRes = await api.bookings.updateStatus(bookingId!, 'confirmed', 'Deposit paid via bank transfer', 150000);
    expect(updateRes.success).toBe(true);

    const listRes = await api.bookings.list({ status: 'confirmed' });
    const found = listRes.data?.find((b) => b.id === bookingId);
    expect(found?.status).toBe('confirmed');
    expect(found?.admin_notes).toBe('Deposit paid via bank transfer');
    expect(found?.service_price).toBe(150000);
  });
});
