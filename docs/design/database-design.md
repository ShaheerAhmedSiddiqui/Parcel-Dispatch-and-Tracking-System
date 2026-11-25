# Logical Database Design — Parcel Dispatch and Tracking System

## 1. Design basis and scope

SRS section 7.3 explicitly requires storage for:
- User accounts and roles.
- Parcel details.
- Delivery staff assignments.
- Shipment status history.
- Delivery attempts.

This document defines a **logical data model** for those items. It is not a claim that the physical MySQL schema has already been implemented. Exact column sizes, enum implementation, address details, pricing policy, and retry policy should be agreed before finalizing the schema.

Customers are public tracking users in the SRS; customer account registration is listed as a future enhancement. Therefore, the proposed `users` table represents staff accounts, not mandatory customer accounts.

## 2. Entity relationship diagram

```mermaid
erDiagram
    USERS ||--o{ PARCELS : registers
    USERS ||--o{ PARCEL_ASSIGNMENTS : assigned_staff
    USERS ||--o{ PARCEL_ASSIGNMENTS : assigns
    PARCELS ||--o{ PARCEL_ASSIGNMENTS : has_assignment_history
    PARCELS ||--o{ SHIPMENT_HISTORY : has_history
    USERS ||--o{ SHIPMENT_HISTORY : records_update
    PARCELS ||--o{ DELIVERY_ATTEMPTS : has_attempts
    USERS ||--o{ DELIVERY_ATTEMPTS : records_attempt

    USERS {
      BIGINT user_id PK
      VARCHAR full_name
      VARCHAR email UK
      VARCHAR password_hash
      VARCHAR role
      BOOLEAN is_active
      DATETIME created_at
      DATETIME updated_at
    }

    PARCELS {
      BIGINT parcel_id PK
      VARCHAR tracking_number UK
      BIGINT registered_by FK
      VARCHAR sender_name
      VARCHAR sender_contact
      VARCHAR receiver_name
      VARCHAR receiver_contact
      VARCHAR pickup_address
      VARCHAR delivery_address
      DECIMAL weight_kg
      DECIMAL distance_km
      VARCHAR delivery_type
      DECIMAL delivery_charge
      VARCHAR current_status
      DATETIME created_at
      DATETIME updated_at
    }

    PARCEL_ASSIGNMENTS {
      BIGINT assignment_id PK
      BIGINT parcel_id FK
      BIGINT delivery_staff_id FK
      BIGINT assigned_by FK
      DATETIME assigned_at
      DATETIME unassigned_at
      BOOLEAN is_current
    }

    SHIPMENT_HISTORY {
      BIGINT history_id PK
      BIGINT parcel_id FK
      BIGINT updated_by FK
      VARCHAR status
      VARCHAR note
      DATETIME changed_at
    }

    DELIVERY_ATTEMPTS {
      BIGINT attempt_id PK
      BIGINT parcel_id FK
      BIGINT delivery_staff_id FK
      INT attempt_number
      VARCHAR failure_reason
      DATETIME attempted_at
    }
```

## 3. Entity descriptions

| Entity | Purpose | Important fields / integrity |
|---|---|---|
| users | Administrator/Courier Clerk and Delivery Staff accounts | Unique email; password hash only; role; active flag |
| parcels | Sender/receiver, shipment details, price, tracking number, current status | Unique tracking number; required details; weight greater than zero |
| parcel_assignments | Current and historical delivery staff assignments | Foreign keys to parcel and delivery staff; records assigning staff and assignment time |
| shipment_history | Append-only status-change timeline | Parcel, status, timestamp, and actor; one parcel has many history rows |
| delivery_attempts | Records delivery attempts, especially failed attempts | Parcel, staff member, attempt number, reason, timestamp |

## 4. Relationships and cardinalities

- One staff account can register many parcels.
- One parcel can have multiple assignment records over time.
- One delivery staff member can be assigned multiple parcels.
- One parcel has many shipment-history rows.
- One parcel can have zero or more delivery-attempt rows.
- A staff account can be responsible for many shipment-history updates and delivery attempts.

## 5. Candidate database constraints and indexes

These are implementation recommendations derived from the SRS integrity requirements:

- Primary key for each entity.
- Unique constraint on `users.email`.
- Unique constraint on `parcels.tracking_number` (BR-01, NFR-11 and NFR-22).
- Foreign keys for every relationship.
- Enforce `weight_kg > 0` (FR-14 / BR-03) both in application validation and, where supported, a database check.
- Index `parcels.current_status` for operational work queues.
- Index `shipment_history(parcel_id, changed_at)` for chronological tracking.
- Index `delivery_attempts(parcel_id, attempt_number)`.
- Index `parcel_assignments(delivery_staff_id, is_current)` for a staff member's assigned parcels.

The SRS does not dictate the exact technique for enforcing at most one active assignment. Select a transaction-safe approach compatible with the deployed MySQL version.

## 6. Transaction boundaries

The following operations should be atomic:

1. **Register parcel:** insert the parcel and its initial Booked shipment-history row in one transaction.
2. **Assign staff:** create/update the assignment record and set the parcel status to Assigned, with a corresponding history row in one transaction.
3. **Update status:** verify the current state, update the parcel, and append shipment history in one transaction.
4. **Record failed delivery:** save the attempt and relevant status/history update consistently in one transaction.

This prevents the parcel's current status from becoming inconsistent with its shipment history.

## 7. Privacy

The public tracking operation should return only the fields needed to communicate parcel progress. It must not return password hashes, staff account details, or unnecessary sender/receiver contact data. This supports FR-34, FR-35, and BR-10.

## 8. Decisions not specified by the SRS

The submitted SRS does not define:
- The full physical schema or exact field lengths.
- A final delivery charge formula or numerical rate values.
- A numeric failed-delivery retry limit.
- A detailed address structure.
- Data-retention and archival rules.

These values must not be invented in the database schema. Agree them with the team/business assumptions and record them in a revised or supplementary requirements note before implementation and test-case finalization.
