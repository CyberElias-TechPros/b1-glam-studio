-- Initial Seed Data for B1touch Artistry / B1 Glam Studio

-- Default Admin User (admin@b1touchartistry.com / Admin123!@#)
-- Salt: a1b2c3d4e5f60718293a4b5c6d7e8f90
-- PBKDF2 with SHA-256 (100,000 iterations)
INSERT OR IGNORE INTO users (id, email, password_hash, password_salt, name, role, created_at, updated_at)
VALUES (
  'user-admin-0001',
  'admin@b1touchartistry.com',
  'd6c4c0b4ebf8d48a609d9361fa383e742880b91e98863f683e9b11488c9df410',
  'a1b2c3d4e5f60718293a4b5c6d7e8f90',
  'B1touch Artistry Admin',
  'superadmin',
  '2026-01-01T00:00:00.000Z',
  '2026-01-01T00:00:00.000Z'
);

-- Studio Settings
INSERT OR IGNORE INTO studio_settings (key, value, updated_at) VALUES
('studio_name', 'B1touch Artistry', '2026-01-01T00:00:00.000Z'),
('studio_tagline', 'Where Dark Skin Meets Its Perfect Canvas', '2026-01-01T00:00:00.000Z'),
('phone', '+234 806 165 1126', '2026-01-01T00:00:00.000Z'),
('whatsapp', '2348061651126', '2026-01-01T00:00:00.000Z'),
('email', 'info@b1touchartistry.com', '2026-01-01T00:00:00.000Z'),
('address', 'Addo Road, Ajah, Lagos, Nigeria', '2026-01-01T00:00:00.000Z'),
('hours_weekday', 'Mon – Sat: 9:00 AM – 7:00 PM', '2026-01-01T00:00:00.000Z'),
('hours_sunday', 'Sunday: By Appointment Only', '2026-01-01T00:00:00.000Z'),
('instagram', 'https://instagram.com/b1touch_artistry', '2026-01-01T00:00:00.000Z'),
('facebook', 'https://facebook.com/b1touchartistry', '2026-01-01T00:00:00.000Z');

-- Initial Testimonials
INSERT OR IGNORE INTO testimonials (id, name, event_type, rating, quote, is_featured, status, created_at, updated_at) VALUES
('test-01', 'Adaeze Nwankwo', 'Traditional Wedding', 5, 'B1touch made me feel like absolute royalty on my wedding day. My skin looked flawless in every single photo — even the close-ups! I cried tears of joy and my makeup didn''t budge. This is the standard.', 1, 'approved', '2026-02-01T00:00:00.000Z', '2026-02-01T00:00:00.000Z'),
('test-02', 'Funke Adeyemi', '30th Birthday Celebration', 5, 'I''ve never received so many compliments in my life! The makeup lasted through 8 hours of dancing, photos, and celebration. Everyone kept asking who my MUA was. B1touch is simply the best in Lagos.', 1, 'approved', '2026-02-05T00:00:00.000Z', '2026-02-05T00:00:00.000Z'),
('test-03', 'Chidinma Okafor', 'Owambe Guest', 5, 'Finally, a makeup artist who truly understands dark skin tones. No ashy foundation, no mismatched tones — just pure perfection. I''m a client for life now. Every party, every event, it''s B1touch or nothing.', 1, 'approved', '2026-02-10T00:00:00.000Z', '2026-02-10T00:00:00.000Z'),
('test-04', 'Blessing Eze', 'White Wedding', 5, 'From the trial session to the big day, the experience was seamless. She listened to exactly what I wanted and delivered beyond my expectations. My husband couldn''t stop staring!', 0, 'approved', '2026-02-12T00:00:00.000Z', '2026-02-12T00:00:00.000Z');

-- Initial Services
INSERT OR IGNORE INTO services (id, title, category, price_formatted, price_amount, description, features_json, is_popular, display_order, created_at, updated_at) VALUES
('srv-01', 'Bridal Makeup', 'bridal', 'From ₦225,000', 225000, 'Your perfect wedding look, designed to last from ceremony to reception. Includes a trial session.', '["Pre-wedding consultation","Trial session included","Long-lasting HD finish","Touch-up kit provided","Lash application included"]', 1, 1, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'),
('srv-02', 'Owambe / Event Glam', 'events', 'From ₦100,000', 100000, 'Head-turning looks for Lagos parties, aso-ebi celebrations, and special occasions.', '["Full face glam","Lash application","Setting spray finish","2-hour session","Group discounts (5+)"]', 0, 2, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'),
('srv-03', 'Editorial & Photoshoot', 'editorial', 'From ₦150,000', 150000, 'Camera-ready perfection for professional shoots, campaigns, and content creation.', '["Colour consultation","HD/4K camera ready","Half-day or full-day rates","On-location available","Multiple look changes"]', 0, 3, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'),
('srv-04', 'Birthday Glam', 'events', 'From ₦125,000', 125000, 'Make your birthday unforgettable with a custom glam look that celebrates you.', '["Custom birthday look","Celebrant package","Guest group rates","Themed looks available","Photo-ready finish"]', 0, 4, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'),
('srv-05', 'Film & TV Makeup', 'production', 'From ₦250,000', 250000, 'Professional on-set makeup for Nollywood productions and television appearances.', '["Continuity expertise","HD studio lighting ready","Full-day on-set","Quick change capability","Special effects available"]', 0, 5, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z'),
('srv-06', 'Makeup Masterclass', 'academy', 'From ₦400,000', 400000, 'Learn the art of professional makeup with hands-on training at our Ajah studio.', '["1-on-1 or group options","Hands-on practice","Product knowledge","Certificate issued","Starter kit guidance"]', 0, 6, '2026-01-01T00:00:00.000Z', '2026-01-01T00:00:00.000Z');
