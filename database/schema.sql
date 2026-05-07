-- ============================================================
-- EventSphere Database Schema (PostgreSQL Version)
-- Note: Make sure to connect to the 'eventsphere' database before running this!
-- ============================================================

-- ============================================================
-- TABLE: users
-- Stores all registered users (admin, organizer, user)
-- ============================================================
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,                       -- Unique user ID
    name VARCHAR(100) NOT NULL,                  -- Full name
    email VARCHAR(150) NOT NULL UNIQUE,          -- Email (must be unique)
    password VARCHAR(255) NOT NULL,              -- Hashed password
    role VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'organizer', 'admin')), -- User role
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP -- Account creation time
);

-- ============================================================
-- TABLE: events
-- Stores all events created by organizers
-- ============================================================
CREATE TABLE IF NOT EXISTS events (
    id SERIAL PRIMARY KEY,                       -- Unique event ID
    title VARCHAR(200) NOT NULL,                 -- Event title
    description TEXT,                            -- Event description
    date TIMESTAMP NOT NULL,                     -- Event date and time
    location VARCHAR(255) NOT NULL,              -- Event location
    price DECIMAL(10, 2) DEFAULT 0.00,           -- Ticket price
    total_seats INT NOT NULL DEFAULT 100,        -- Total available seats
    available_seats INT NOT NULL DEFAULT 100,    -- Remaining seats (updated on booking)
    category VARCHAR(100) DEFAULT 'General',     -- Event category
    image_url VARCHAR(500) DEFAULT NULL,         -- Optional event image
    organizer_id INT NOT NULL,                   -- FK to users table (the organizer)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    -- Foreign key: organizer must exist in users table
    FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: bookings
-- Records each ticket booking made by a user
-- ============================================================
CREATE TABLE IF NOT EXISTS bookings (
    id SERIAL PRIMARY KEY,                       -- Unique booking ID
    user_id INT NOT NULL,                        -- FK to users table
    event_id INT NOT NULL,                       -- FK to events table
    tickets INT NOT NULL DEFAULT 1,              -- Number of tickets booked
    booking_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When the booking was made
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled', 'pending')), -- Booking status
    -- Foreign keys
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- ============================================================
-- TABLE: payments
-- Stores payment info for each booking
-- ============================================================
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,                       -- Unique payment ID
    booking_id INT NOT NULL,                     -- FK to bookings table
    amount DECIMAL(10, 2) NOT NULL,              -- Total amount paid
    payment_status VARCHAR(20) DEFAULT 'completed' CHECK (payment_status IN ('pending', 'completed', 'failed', 'refunded')),
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- When payment was made
    -- Foreign key
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE
);

-- ============================================================
-- USEFUL INDEXES for faster queries
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_events_organizer ON events(organizer_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_event ON bookings(event_id);
CREATE INDEX IF NOT EXISTS idx_payments_booking ON payments(booking_id);
