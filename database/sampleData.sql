-- ============================================================
-- EventSphere Sample Data
-- Run AFTER schema.sql
-- Passwords below are hashed versions of: "Password123"
-- ============================================================
-- ============================================================

-- ============================================================
-- Insert sample users
-- Password for all accounts: Password123
-- ============================================================
INSERT INTO users (name, email, password, role) VALUES
(
    'Admin User',
    'admin@eventsphere.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Password123
    'admin'
),
(
    'John Organizer',
    'organizer@eventsphere.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Password123
    'organizer'
),
(
    'Jane User',
    'user@eventsphere.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- Password123
    'user'
),
(
    'Alice Smith',
    'alice@eventsphere.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'user'
),
(
    'Bob Organizer',
    'bob@eventsphere.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'organizer'
);

-- ============================================================
-- Insert sample events (organizer_id = 2 is John Organizer)
-- ============================================================
INSERT INTO events (title, description, date, location, price, total_seats, available_seats, category, organizer_id) VALUES
(
    'Tech Summit 2025',
    'A grand gathering of tech leaders, developers, and entrepreneurs. Learn about AI, blockchain, cloud computing, and more. Network with 500+ professionals.',
    '2025-08-15 09:00:00',
    'Mumbai Convention Center, Mumbai',
    999.00,
    200,
    185,
    'Technology',
    2
),
(
    'Music Fiesta Night',
    'An epic live music night featuring top Bollywood and indie artists. Food stalls, dance performances, and non-stop entertainment await you!',
    '2025-07-20 18:00:00',
    'Bandra Fort Open Ground, Mumbai',
    599.00,
    500,
    312,
    'Music',
    2
),
(
    'Startup Pitch Fest',
    'Watch 20 promising Indian startups pitch their ideas to top VCs and Angel investors. Great learning opportunity for aspiring entrepreneurs.',
    '2025-09-05 10:00:00',
    'IIT Bombay Auditorium, Mumbai',
    299.00,
    300,
    299,
    'Business',
    5
),
(
    'Annual Food Festival',
    'Celebrate India''s diverse culinary heritage. 50+ food stalls, live cooking demos by celebrity chefs, and food competitions.',
    '2025-07-30 11:00:00',
    'Juhu Beach, Mumbai',
    150.00,
    1000,
    867,
    'Food',
    5
),
(
    'Photography Workshop',
    'Hands-on workshop for photography enthusiasts. Learn composition, lighting, and post-processing techniques from professional photographers.',
    '2025-08-10 09:00:00',
    'Colaba Photography Studio, Mumbai',
    799.00,
    50,
    42,
    'Arts',
    2
),
(
    'Yoga & Wellness Retreat',
    'A full-day wellness retreat with yoga sessions, meditation, Ayurvedic consultations, and organic food. Rejuvenate your mind and body.',
    '2025-08-22 06:00:00',
    'Rishikesh Yoga Ashram, Uttarakhand',
    1200.00,
    80,
    55,
    'Health',
    5
);

-- ============================================================
-- Insert sample bookings (user_id=3 is Jane User, user_id=4 is Alice)
-- ============================================================
INSERT INTO bookings (user_id, event_id, tickets, status) VALUES
(3, 1, 2, 'confirmed'),
(3, 2, 3, 'confirmed'),
(4, 1, 1, 'confirmed'),
(4, 3, 2, 'cancelled'),
(3, 4, 4, 'confirmed');

-- ============================================================
-- Insert sample payments (linked to bookings above)
-- ============================================================
INSERT INTO payments (booking_id, amount, payment_status) VALUES
(1, 1998.00, 'completed'),  -- 2 tickets x 999
(2, 1797.00, 'completed'),  -- 3 tickets x 599
(3, 999.00,  'completed'),  -- 1 ticket x 999
(4, 598.00,  'refunded'),   -- 2 tickets x 299 (cancelled booking)
(5, 600.00,  'completed');  -- 4 tickets x 150
