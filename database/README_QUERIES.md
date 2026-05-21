# EventSphere - PostgreSQL Queries Guide

This guide contains all the useful queries for managing your database directly in pgAdmin4. Since you are using **PostgreSQL**, these queries have been formatted perfectly for it. 

> **Important note for pgAdmin4**: Do **NOT** use `USE database_name;`. Simply ensure you are connected to the right database in the tree view before opening the Query Tool. Always remember to end each statement with a semicolon (`;`) so PostgreSQL knows where one query ends and the next begins!

---

## 1. DML: Make Changes (INSERT, UPDATE, DELETE)

PostgreSQL has a very handy `RETURNING *` feature. When you add or change data, `RETURNING *` will immediately show you the row you just affected so you don't need to run a `SELECT` query right after!

### INSERT (Add new records)

**Add a new User:**
```sql
INSERT INTO users (name, email, password, role) 
VALUES ('John Doe', 'john.doe@example.com', 'securepassword123', 'user')
RETURNING *; 
```

**Add a new Event:**
```sql
INSERT INTO events (title, description, date, location, price, total_seats, available_seats, organizer_id) 
VALUES (
    'Tech Conference 2026', 
    'A conference about the future of tech.', 
    '2026-10-15 09:00:00', 
    'San Francisco', 
    199.99, 
    500, 
    500, 
    1  -- Replace with a valid user_id
)
RETURNING *;
```

### UPDATE (Modify existing records)

**Promote a user to Admin or Organizer:**
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'john.doe@example.com'
RETURNING id, name, role;
```

**Reduce available seats for an event (e.g. manual booking):**
```sql
UPDATE events 
SET available_seats = available_seats - 2 
WHERE id = 1 AND available_seats >= 2
RETURNING title, available_seats;
```

**Confirm a booking:**
```sql
UPDATE bookings 
SET status = 'confirmed' 
WHERE id = 5
RETURNING *;
```

### DELETE (Remove records)

**Delete a specific booking:**
```sql
DELETE FROM bookings 
WHERE id = 10
RETURNING *;
```

**Delete an event:**
```sql
DELETE FROM events 
WHERE id = 3;
```

---

## 2. Basic SELECT Queries (Viewing Data)

**Get all users:**
```sql
SELECT * FROM users;
```

**Get all events with their organizer details:**
```sql
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
```

**Get all bookings with user and event details:**
```sql
SELECT 
    b.id AS booking_id,
    u.name AS user_name,
    e.title AS event_title,
    b.tickets,
    b.status,
    b.booking_date
FROM bookings b
JOIN users u ON b.user_id = u.id
JOIN events e ON b.event_id = e.id
ORDER BY b.booking_date DESC;
```

---

## 3. Analytics & Aggregate Queries

**Total revenue per event:**
```sql
SELECT 
    e.title,
    COUNT(b.id) AS total_bookings,
    COALESCE(SUM(b.tickets), 0) AS total_tickets_sold,
    COALESCE(SUM(p.amount), 0) AS total_revenue
FROM events e
LEFT JOIN bookings b ON e.id = b.event_id AND b.status = 'confirmed'
LEFT JOIN payments p ON b.id = p.booking_id AND p.payment_status = 'completed'
GROUP BY e.id, e.title
ORDER BY total_revenue DESC;
```

**Top 3 most booked events:**
```sql
SELECT 
    e.title,
    SUM(b.tickets) AS tickets_sold
FROM events e
JOIN bookings b ON e.id = b.event_id
WHERE b.status = 'confirmed'
GROUP BY e.id, e.title
ORDER BY tickets_sold DESC
LIMIT 3;
```

**Events with more than 50% seats filled:**
```sql
SELECT 
    title, 
    total_seats, 
    available_seats,
    ROUND(((total_seats - available_seats)::numeric / total_seats) * 100, 2) AS percent_filled
FROM events
WHERE total_seats > 0 AND ((total_seats - available_seats)::numeric / total_seats) > 0.50
ORDER BY percent_filled DESC;
```

---

## 4. Role-Specific Queries

### For a Specific User
**Get all bookings for a user (e.g., user_id = 3):**
```sql
SELECT 
    b.id,
    e.title,
    e.date,
    b.tickets,
    b.status,
    p.amount,
    p.payment_status
FROM bookings b
JOIN events e ON b.event_id = e.id
LEFT JOIN payments p ON b.id = p.booking_id
WHERE b.user_id = 3;
```

### For an Organizer
**Get attendees for a specific event (e.g., event_id = 1):**
```sql
SELECT 
    u.name,
    u.email,
    b.tickets,
    b.status,
    b.booking_date
FROM bookings b
JOIN users u ON b.user_id = u.id
WHERE b.event_id = 1
ORDER BY b.booking_date;
```

### For an Admin
**Overall System Dashboard Stats:**
```sql
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM events) AS total_events,
    (SELECT COUNT(*) FROM bookings WHERE status = 'confirmed') AS confirmed_bookings,
    (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE payment_status = 'completed') AS total_revenue;
```

---

## 5. Helpful Tips for pgAdmin

1. **Highlight to Run:** If you have multiple queries in the editor, highlight the one you want to run before pressing the Execute button (the "Play" icon). If you don't highlight anything, it will try to run all of them from top to bottom.
2. **Missing Semicolon Error:** If you see `syntax error at or near...`, it almost always means the query *above* the one you are trying to run is missing a `;` at the end!
3. **Rollbacks:** If you are about to do a big `DELETE` or `UPDATE`, wrap it in a transaction block. 
   ```sql
   BEGIN;
   UPDATE events SET price = 0; -- Oops, made them all free!
   ROLLBACK; -- Phew, this undoes the mistake.
   ```
   (If it looks good, run `COMMIT;` instead of `ROLLBACK;`).
