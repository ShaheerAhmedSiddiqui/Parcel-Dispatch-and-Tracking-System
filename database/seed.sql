
USE parcel_db;

-- Create administrator account
INSERT INTO users
    (full_name, username, email, password_hash, role, is_active)
VALUES
    (
        'System Administrator',
        'admin',
        'admin@parcel.test',
        '$2b$12$kYlvboEjB7qR3CUwjYG8H.Lvrde7RuD6gT9GlmWvpc6BoR/AXInUe',
        'ADMIN',
        TRUE
    );

-- Create delivery staff accounts
INSERT INTO users
    (full_name, username, email, password_hash, role, is_active)
VALUES
    (
        'Ali Ahmed',
        'ali',
        'ali@parcel.test',
        '$2b$12$kYlvboEjB7qR3CUwjYG8H.Lvrde7RuD6gT9GlmWvpc6BoR/AXInUe',
        'DELIVERY_STAFF',
        TRUE
    ),
    (
        'Sara Ahmed',
        'sara',
        'sara@parcel.test',
        '$2b$12$kYlvboEjB7qR3CUwjYG8H.Lvrde7RuD6gT9GlmWvpc6BoR/AXInUe',
        'DELIVERY_STAFF',
        TRUE
    ),
    (
        'Old Staff Account',
        'old',
        'old@parcel.test',
        '$2b$12$kYlvboEjB7qR3CUwjYG8H.Lvrde7RuD6gT9GlmWvpc6BoR/AXInUe',
        'DELIVERY_STAFF',
        FALSE
    );

-- Create delivery staff profiles
INSERT INTO delivery_staff (user_id, phone, availability)
SELECT user_id, '03001234567', 'AVAILABLE'
FROM users WHERE username = 'ali';

INSERT INTO delivery_staff (user_id, phone, availability)
SELECT user_id, '03007654321', 'AVAILABLE'
FROM users WHERE username = 'sara';

INSERT INTO delivery_staff (user_id, phone, availability)
SELECT user_id, '03001112223', 'OFF_DUTY'
FROM users WHERE username = 'old';
