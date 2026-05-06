-- ============================================================
-- EventSphere - Useful SQL Queries (for DBMS project reference)
-- ============================================================
USE eventsphere;

-- ============================================================
-- BASIC SELECT QUERIES
-- ============================================================

-- Get all users
SELECT * FROM users;

-- Get all events with organizer name (JOIN)
SELECT 
    e.id, 
    e.title, 
    e.date, 
    e.location, 
    e.price, 
    e.available_seats,
    u.name AS organizer_name,
    u.email AS organizer_email
FROM events e
JOIN users u ON e.organizer_id = u.id
ORDER BY e.date ASC;

-- Get all bookings with user and event details (Multiple JOINs)
SELECT 
    b.id AS booking_id,
    u.name AS user_name,
    u.email AS user_email,
    e.title AS event_title,
    e.date AS event_date,
    b.tickets,
    b.status,
    b.booking_date
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN events e ON b.event_id = e.id
ORDER BY b.booking_date DESC;

-- ============================================================
-- AGGREGATE QUERIES
-- ============================================================

-- Total revenue per event
SELECT 
    e.title,
    COUNT(b.id) AS total_bookings,
    SUM(b.tickets) AS total_tickets_sold,
    SUM(p.amount) AS total_revenue
FROM events e
LEFT JOIN bookings b ON e.id = b.event_id AND b.status = 'confirmed'
LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_status = 'completed'
GROUP BY e.id, e.title
ORDER BY total_revenue DESC;

-- Count of users by role
SELECT role, COUNT(*) AS total_users
FROM users
GROUP BY role;

-- Events with available seats
SELECT title, total_seats, available_seats, 
       (total_seats - available_seats) AS tickets_sold
FROM events
WHERE available_seats > 0
ORDER BY available_seats ASC;

-- Top 3 most booked events
SELECT 
    e.title,
    SUM(b.tickets) AS tickets_sold
FROM events e
JOIN bookings b ON e.id = b.event_id
WHERE b.status = 'confirmed'
GROUP BY e.id, e.title
ORDER BY tickets_sold DESC
LIMIT 3;

-- ============================================================
-- USER-SPECIFIC QUERIES
-- ============================================================

-- Get bookings for a specific user (with event and payment info)
SELECT 
    b.id,
    e.title,
    e.date,
    e.location,
    b.tickets,
    b.status,
    p.amount,
    p.payment_status
FROM bookings b
JOIN events e ON b.event_id = e.id
LEFT JOIN payments p ON b.id = p.booking_id
WHERE b.user_id = 3;  -- Replace 3 with actual user ID

-- ============================================================
-- ORGANIZER QUERIES
-- ============================================================

-- Get all events for a specific organizer with booking stats
SELECT 
    e.id,
    e.title,
    e.date,
    e.price,
    e.total_seats,
    e.available_seats,
    COUNT(b.id) AS total_bookings,
    COALESCE(SUM(b.tickets), 0) AS tickets_sold
FROM events e
LEFT JOIN bookings b ON e.id = b.event_id AND b.status = 'confirmed'
WHERE e.organizer_id = 2  -- Replace with organizer's user ID
GROUP BY e.id;

-- Get attendees for a specific event
SELECT 
    u.name,
    u.email,
    b.tickets,
    b.status,
    b.booking_date
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.event_id = 1  -- Replace with actual event ID
ORDER BY b.booking_date;

-- ============================================================
-- ADMIN QUERIES
-- ============================================================

-- Dashboard stats
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM events) AS total_events,
    (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') AS confirmed_bookings,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payment_status = 'completed') AS total_revenue;

-- Search events by title or location
SELECT * FROM events
WHERE title LIKE '%Tech%' OR location LIKE '%Mumbai%';

-- ============================================================
-- SUBQUERY EXAMPLE
-- ============================================================

-- Find users who have never made a booking
SELECT id, name, email
FROM users
WHERE id NOT IN (SELECT DISTINCT user_id FROM bookings)
AND role = 'user';

-- Find events with more than 50% seats filled
SELECT title, total_seats, available_seats,
       ROUND(((total_seats - available_seats) / total_seats) * 100, 2) AS percent_filled
FROM events
HAVING percent_filled > 50
ORDER BY percent_filled DESC;
