
-- ============================================================
-- Parcel Dispatch and Tracking System
-- Database: parcel_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS parcel_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE parcel_db;

-- ============================================================
-- 1. USERS
-- Stores administrator and delivery staff login accounts.
-- ============================================================

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,

    role ENUM('ADMIN', 'DELIVERY_STAFF') NOT NULL,

    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;


-- ============================================================
-- 2. DELIVERY STAFF
-- Stores additional information for delivery staff accounts.
-- ============================================================

CREATE TABLE IF NOT EXISTS delivery_staff (
    staff_id INT AUTO_INCREMENT PRIMARY KEY,

    user_id INT NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,

    availability ENUM(
        'AVAILABLE',
        'BUSY',
        'OFF_DUTY'
    ) NOT NULL DEFAULT 'AVAILABLE',

    CONSTRAINT fk_delivery_staff_user
        FOREIGN KEY (user_id)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- 3. PRICING RULES
-- Stores configurable delivery charges.
-- ============================================================

CREATE TABLE IF NOT EXISTS pricing_rules (
    rule_id INT AUTO_INCREMENT PRIMARY KEY,

    delivery_type ENUM(
        'STANDARD',
        'EXPRESS',
        'SAME_DAY'
    ) NOT NULL UNIQUE,

    base_charge DECIMAL(10,2) NOT NULL,
    per_kg_rate DECIMAL(10,2) NOT NULL,
    per_km_rate DECIMAL(10,2) NOT NULL,

    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_base_charge
        CHECK (base_charge >= 0),

    CONSTRAINT chk_per_kg_rate
        CHECK (per_kg_rate >= 0),

    CONSTRAINT chk_per_km_rate
        CHECK (per_km_rate >= 0)
) ENGINE=InnoDB;


-- ============================================================
-- 4. PARCELS
-- Stores parcel registration and current delivery information.
-- ============================================================

CREATE TABLE IF NOT EXISTS parcels (
    parcel_id INT AUTO_INCREMENT PRIMARY KEY,

    tracking_number VARCHAR(25) NOT NULL UNIQUE,

    sender_name VARCHAR(100) NOT NULL,
    sender_contact VARCHAR(20) NOT NULL,

    receiver_name VARCHAR(100) NOT NULL,
    receiver_contact VARCHAR(20) NOT NULL,

    pickup_address VARCHAR(255) NOT NULL,
    delivery_address VARCHAR(255) NOT NULL,

    weight_kg DECIMAL(8,2) NOT NULL,
    distance_km DECIMAL(8,2) NOT NULL,

    delivery_type ENUM(
        'STANDARD',
        'EXPRESS',
        'SAME_DAY'
    ) NOT NULL,

    delivery_charge DECIMAL(10,2) NOT NULL,

    current_status VARCHAR(30) NOT NULL DEFAULT 'Booked',

    assigned_staff_id INT NULL,

    attempt_count INT NOT NULL DEFAULT 0,

    created_by INT NOT NULL,

    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    updated_at DATETIME NOT NULL
        DEFAULT CURRENT_TIMESTAMP
        ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT chk_parcel_weight
        CHECK (weight_kg > 0),

    CONSTRAINT chk_parcel_distance
        CHECK (distance_km >= 0),

    CONSTRAINT chk_delivery_charge
        CHECK (delivery_charge >= 0),

    CONSTRAINT chk_attempt_count
        CHECK (attempt_count >= 0),

    CONSTRAINT chk_parcel_status
        CHECK (
            current_status IN (
                'Booked',
                'Assigned',
                'Dispatched',
                'Out for Delivery',
                'Delivered',
                'Delivery Failed',
                'Return Initiated',
                'Return in Transit',
                'Returned to Sender'
            )
        ),

    CONSTRAINT fk_parcel_assigned_staff
        FOREIGN KEY (assigned_staff_id)
        REFERENCES delivery_staff(staff_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_parcel_created_by
        FOREIGN KEY (created_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_parcel_assigned_staff (assigned_staff_id),
    INDEX idx_parcel_status (current_status),
    INDEX idx_parcel_created_at (created_at)
) ENGINE=InnoDB;


-- ============================================================
-- 5. SHIPMENT HISTORY
-- Stores timestamped parcel status changes.
-- ============================================================

CREATE TABLE IF NOT EXISTS shipment_history (
    history_id INT AUTO_INCREMENT PRIMARY KEY,

    parcel_id INT NOT NULL,

    status VARCHAR(30) NOT NULL,

    remarks VARCHAR(255) NULL,

    updated_by INT NOT NULL,

    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_history_parcel
        FOREIGN KEY (parcel_id)
        REFERENCES parcels(parcel_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_history_user
        FOREIGN KEY (updated_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_history_parcel (parcel_id),
    INDEX idx_history_updated_at (updated_at)
) ENGINE=InnoDB;


-- ============================================================
-- 6. DELIVERY ATTEMPTS
-- Records unsuccessful delivery attempts.
-- ============================================================

CREATE TABLE IF NOT EXISTS delivery_attempts (
    attempt_id INT AUTO_INCREMENT PRIMARY KEY,

    parcel_id INT NOT NULL,

    staff_id INT NOT NULL,

    attempt_no INT NOT NULL,

    attempt_time DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    failure_reason VARCHAR(255) NOT NULL,

    CONSTRAINT chk_attempt_number
        CHECK (attempt_no > 0),

    CONSTRAINT uq_parcel_attempt
        UNIQUE (parcel_id, attempt_no),

    CONSTRAINT fk_attempt_parcel
        FOREIGN KEY (parcel_id)
        REFERENCES parcels(parcel_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_attempt_staff
        FOREIGN KEY (staff_id)
        REFERENCES delivery_staff(staff_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    INDEX idx_attempt_parcel (parcel_id)
) ENGINE=InnoDB;


-- ============================================================
-- 7. PARCEL RETURNS
-- Stores parcel return information.
-- ============================================================

CREATE TABLE IF NOT EXISTS parcel_returns (
    return_id INT AUTO_INCREMENT PRIMARY KEY,

    parcel_id INT NOT NULL UNIQUE,

    initiated_by INT NOT NULL,

    reason VARCHAR(255) NOT NULL,

    initiated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,

    completed_at DATETIME NULL,

    CONSTRAINT fk_return_parcel
        FOREIGN KEY (parcel_id)
        REFERENCES parcels(parcel_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_return_user
        FOREIGN KEY (initiated_by)
        REFERENCES users(user_id)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;


-- ============================================================
-- DATABASE STRUCTURE CREATED SUCCESSFULLY
-- ============================================================
