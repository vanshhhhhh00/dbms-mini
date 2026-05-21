-- ============================================================
-- EventSphere - PostgreSQL Triggers
-- Run these in pgAdmin to add automatic business logic to your database.
-- ============================================================

-- ============================================================
-- TRIGGER 1: Prevent Overbooking
-- Runs BEFORE a new booking is inserted to ensure there are enough seats.
-- ============================================================
CREATE OR REPLACE FUNCTION check_seat_availability()
RETURNS TRIGGER AS $$
DECLARE
    current_available_seats INT;
BEGIN
    -- Grab the currently available seats for this event
    SELECT available_seats INTO current_available_seats
    FROM events
    WHERE id = NEW.event_id;

    -- If the requested tickets are more than what is available, abort the insert!
    IF current_available_seats < NEW.tickets THEN
        RAISE EXCEPTION 'Booking failed: Not enough seats available. Requested: %, Available: %', NEW.tickets, current_available_seats;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_before_booking_insert
BEFORE INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION check_seat_availability();

-- ============================================================
-- TRIGGER 2: Automatically Update Seats on Booking
-- Runs AFTER a new booking is successfully inserted to subtract seats.
-- ============================================================
CREATE OR REPLACE FUNCTION update_seats_on_booking()
RETURNS TRIGGER AS $$
BEGIN
    -- Subtract the booked tickets from the event's available_seats
    UPDATE events
    SET available_seats = available_seats - NEW.tickets
    WHERE id = NEW.event_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_booking_insert
AFTER INSERT ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_seats_on_booking();

-- ============================================================
-- TRIGGER 3: Restore Seats if a Booking is Cancelled
-- Runs AFTER a booking's status is updated to 'cancelled'.
-- ============================================================
CREATE OR REPLACE FUNCTION restore_seats_on_cancellation()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if the status was changed specifically to 'cancelled'
    IF NEW.status = 'cancelled' AND OLD.status != 'cancelled' THEN
        -- Add the tickets back to available_seats
        UPDATE events
        SET available_seats = available_seats + NEW.tickets
        WHERE id = NEW.event_id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_after_booking_update
AFTER UPDATE OF status ON bookings
FOR EACH ROW
EXECUTE FUNCTION restore_seats_on_cancellation();
