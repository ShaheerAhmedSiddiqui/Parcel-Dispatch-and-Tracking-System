# Backend overview

Layered architecture (matches the README): **routes -> controllers -> services -> repositories -> MySQL**.

| Layer | Folder | Responsibility |
|---|---|---|
| Routes | `src/routes` | URL + HTTP method -> controller, with login/role middleware |
| Controllers | `src/controllers` | Read request, call a service, render a view / redirect / JSON |
| Services | `src/services` | **Business rules.** `chargeCalculator`, `statusMachine`, `trackingNumber` are pure functions (no DB, no Express) |
| Validators | `src/validators` | Input validation (trim, type, range, format) |
| Repositories | `src/repositories` | SQL only. Status changes run in a transaction with an optimistic `expectedStatus` check |
| Middleware | `src/middleware` | Login/role checks, flash messages, 404 + central error handler |
| Config | `src/config` | `rules.js` (all business numbers), env config, DB pool |

`src/app.js` exports `createApp({ userRepo, parcelRepo })`. Tests inject in-memory repositories (`tests/helpers`), so unit and HTTP tests need no database.

## Business rules (`src/config/rules.js`) - PLACEHOLDER VALUES
Replace with the values in your SRS: weight bands and base charges, rate per km, express surcharge, max weight/distance, max failed attempts (default 3), max open parcels per staff (default 10). Unit tests read these values, so they keep passing when numbers change.

## Status workflow
`BOOKED -> ASSIGNED -> OUT_FOR_DELIVERY -> DELIVERED`
`OUT_FOR_DELIVERY -> DELIVERY_FAILED -> (retry) OUT_FOR_DELIVERY | RETURN_INITIATED -> RETURNED`
`BOOKED -> CANCELLED`, `ASSIGNED -> BOOKED` (unassign). DELIVERED / RETURNED / CANCELLED are final.
After `maxFailedAttempts` failures only return-to-sender is allowed.

## Endpoints
| Method & path | Who | Purpose |
|---|---|---|
| `GET /health` | public | liveness check |
| `GET /track`, `GET /track/:trackingNumber` | public | customer tracking (HTML, or JSON with `Accept: application/json`) |
| `GET/POST /login`, `POST /logout` | public | session login |
| `GET /parcels`, `GET /parcels/:id` | admin; staff (own parcels only) | list / detail |
| `GET /parcels/new`, `POST /parcels` | admin | register parcel (validates, prices, generates tracking number) |
| `POST /parcels/quote` | admin | JSON charge breakdown |
| `POST /parcels/:id/assign` | admin | assign to active staff |
| `POST /parcels/:id/status` | admin / assigned staff | status change (`status`, `note`) |
| `GET /staff` | staff | my deliveries |

## Running
```bash
npm install
cp .env.example .env                  # set SESSION_SECRET and DB_* values
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seed.sql  # dev users, password: Password@123
npm start                             # http://localhost:3000
npm test                              # unit + HTTP tests (no DB needed), with coverage
RUN_DB_TESTS=true DB_USER=root DB_PASSWORD=... npm run test:integration   # also runs MySQL tests
```
Seed accounts: `admin@parcel.test`, `ali@parcel.test`, `sara@parcel.test` (and an inactive `old@parcel.test`).

## Known limitations (for the final report)
- No CSRF protection yet (cookies are `SameSite=Lax`); add a CSRF token before real deployment.
- No login rate limiting / account lockout.
- Sessions use the default in-memory store (fine for demo, not production).
- No user-management screens; staff accounts are created via SQL.
