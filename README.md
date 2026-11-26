# ParcelTrack — Parcel Dispatch and Tracking System

ParcelTrack is a web-based application for managing parcel bookings, delivery staff assignments, shipment status updates, and public parcel tracking. It is being developed as a Software Quality Engineering (SQE) course project.

> **Implementation status:** This README describes the code currently present on the repository's `main` branch. It distinguishes implemented functionality from setup requirements and known limitations. The application is intended for local development and academic demonstration, not production deployment.

## 1. Problem Statement

Small courier operations may manage parcel bookings and deliveries through paper registers or disconnected records. This can make it difficult to calculate consistent delivery charges, assign parcels to delivery staff, keep a reliable shipment history, and communicate delivery progress to customers.

ParcelTrack centralizes these activities in one application. Staff can register and manage parcels, while customers can use a tracking number to view the current shipment status and recorded tracking history without creating an account.

## 2. Main Features

### Administrator / Courier Clerk

- Sign in to the staff area using an email address and password.
- View the administrator dashboard and parcel list.
- Register a parcel with sender, receiver, address, weight, distance, and delivery-type information.
- Request a delivery-charge quote using the configured pricing rules.
- Generate a unique tracking number when a parcel is registered.
- View parcel details and shipment history.
- Assign a parcel to delivery staff.
- Update parcel status and initiate a return for an eligible parcel.

### Delivery Staff (Rider)

- Sign in to the delivery staff area.
- View parcels assigned to the signed-in staff member.
- Open assigned delivery details and view shipment history and delivery attempts.
- Update permitted delivery statuses and record a failed-delivery reason when required.

### Customer

- Open the public tracking page without signing in.
- Search using a tracking number in the format `PT-000001`.
- View the current parcel status and timestamped shipment history.

### Shipment Statuses

The database and status workflow define these statuses:

`Booked` → `Assigned` → `Dispatched` → `Out for Delivery` → `Delivered`

The workflow also supports `Delivery Failed`, `Return Initiated`, `Return in Transit`, and `Returned to Sender`, subject to the permitted transitions implemented by the application.

### Current Delivery Types

The current application code accepts `STANDARD`, `EXPRESS`, and `SAME_DAY`. The corresponding pricing rules must exist in the `pricing_rules` database table for charge calculation and parcel registration to work.

## 3. Technology Stack

| Area | Technology |
|---|---|
| Runtime | Node.js |
| Backend framework | Express.js |
| Server-rendered frontend | EJS |
| Frontend | HTML, CSS, JavaScript |
| Database | MySQL |
| Database driver | `mysql2` (promise API) |
| Authentication | Express sessions and `bcryptjs` password verification |
| Environment configuration | `dotenv` |
| Automated testing | Jest |
| HTTP testing | Supertest |
| Version control | Git and GitHub |

The application uses a layered structure:

`Routes → Controllers → Services → Repositories → MySQL`

EJS templates are stored in `src/views`, and browser assets are served from `public`.

## 4. Repository Structure

The following is the current high-level structure of the `main` branch. Some placeholder directories are retained for future development.

```text
Parcel-Dispatch-and-Tracking-System/
├── .github/
│   ├── ISSUE_TEMPLATE/
│   └── pull_request_template.md
├── database/
│   ├── generate-hash.js
│   ├── schema.sql
│   ├── seed.sql
│   ├── test-connection.js
│   ├── test-parcel-repository.js
│   └── test-repositories.js
├── docs/
│   ├── BACKEND.md
│   ├── SDS_dlv_3/
│   ├── SRS_dlv_2/
│   ├── design/
│   ├── project_proposal/
│   └── workflow-notes.md
├── public/
│   ├── css/
│   ├── images/
│   │   └── logo.png
│   └── js/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   ├── middleware/
│   ├── models/          # Placeholder directory at present
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/      # Placeholder directory at present
│   └── views/
│       ├── admin/
│       ├── partials/
│       └── staff/
├── test/
│   └── app.test.js
├── .gitignore
├── AGENTS.md
├── LICENSE
├── package.json
├── package-lock.json
└── README.md
```

### Important source files

- `src/app.js` — configures Express, sessions, EJS, static assets, and route mounting.
- `src/server.js` — starts the HTTP server.
- `src/config/db.js` — creates the MySQL connection pool.
- `src/routes/` — authentication, admin, parcel, staff, and tracking routes.
- `src/controllers/` — handles request processing and view rendering.
- `src/services/` — charge calculation, status workflow, tracking-number generation, and input validation.
- `src/repositories/` — SQL queries and database operations.
- `database/schema.sql` — creates the database tables.
- `database/seed.sql` — inserts development users and delivery-staff profiles.
- `test/app.test.js` — current Jest/Supertest application-level tests.

## 5. Prerequisites

Install the following software before setting up the project:

- **Node.js** and npm. Use a currently supported Node.js LTS release.
- **MySQL Server** with the MySQL command-line client, or a local MySQL package such as XAMPP.
- **Git**.

The database connection in `src/config/db.js` defaults to `localhost:3307`, user `root`, an empty password, and database `parcel_db`. Change the values in `.env` to match your local MySQL installation.

## 6. Installation and Local Setup

### Step 1 — Clone the repository

```bash
git clone https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System.git
cd Parcel-Dispatch-and-Tracking-System
```

### Step 2 — Install dependencies

```bash
npm install
```

### Step 3 — Configure environment variables

Create a local `.env` file in the project root. Copy `.env.example` and edit the values for your machine.

**Windows PowerShell:**

```powershell
Copy-Item .env.example .env
```

**macOS / Linux / Git Bash:**

```bash
cp .env.example .env
```

Use the following configuration as the `.env.example` template:

```dotenv
# Application
PORT=3000
NODE_ENV=development
SESSION_SECRET=replace_with_a_long_random_local_secret

# MySQL connection
DB_HOST=localhost
DB_PORT=3307
DB_USER=root
DB_PASSWORD=
DB_NAME=parcel_db
```

| Variable | Purpose | Current default / example |
|---|---|---|
| `PORT` | HTTP port used by the application | `3000` |
| `NODE_ENV` | Runtime environment; controls production cookie/error behavior | `development` |
| `SESSION_SECRET` | Secret used to sign the session cookie | Set a private local value; do not commit it |
| `DB_HOST` | MySQL server host | `localhost` |
| `DB_PORT` | MySQL server port | `3307` |
| `DB_USER` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | Empty for a default local XAMPP root account; set your own value if required |
| `DB_NAME` | Database name | `parcel_db` |

`src/config/db.js` contains defaults for the database variables and `src/server.js` defaults the application port to `3000`. Set `SESSION_SECRET` in your local `.env` even though the current application code has a development fallback. Do not use that fallback or a sample value for a deployed environment.

The repository ignores `.env` and explicitly allows `.env.example` to be committed. Never put a real database password, production session secret, or private credential in `.env.example` or in Git.

### Step 4 — Create the database schema

Make sure your MySQL service is running. From the repository root, run:

```bash
mysql -h localhost -P 3307 -u root -p < database/schema.sql
```

Enter your MySQL password when prompted. If your local MySQL root account has no password, press Enter when prompted. If your MySQL service uses port `3306` or another port, replace `3307` with that port and set the same value in `.env`.

`database/schema.sql` creates the `parcel_db` database and the application's tables, including:

- `users`
- `delivery_staff`
- `pricing_rules`
- `parcels`
- `shipment_history`
- `delivery_attempts`
- `parcel_returns`

### Step 5 — Insert development seed data

Run the seed script after the schema has been created:

```bash
mysql -h localhost -P 3307 -u root -p < database/seed.sql
```

The seed script creates the development administrator and delivery-staff accounts described in the **Development Login Accounts** section below. Run this seed script only once on a fresh database unless you have intentionally cleared the existing seed records; it does not use duplicate-safe inserts.

> **Important — pricing configuration is not seeded yet:** `database/seed.sql` currently inserts users and delivery-staff profiles but does not insert any records into `pricing_rules`. The application creates the pricing table, but the quote and parcel-registration features require a matching pricing row. Ask the project team for the approved base charge, per-kilogram rate, and per-kilometre rate, then add the agreed rules for the delivery types being used. No tariff values are included here because they have not been supplied as approved project values. Until pricing rows are added, charge quotes and parcel registration will fail with a missing-pricing-rule message.

### Step 6 — Start the application

```bash
npm start
```

The server starts at:

```text
http://localhost:3000
```

If you changed `PORT` in `.env`, open the corresponding port instead. To confirm that the server is responding, visit `http://localhost:3000/health`; the endpoint returns a JSON response with the status `ok`.

## 7. Development Login Accounts

The current `database/seed.sql` creates the following active development accounts. All seeded accounts use the same sample password listed below.

| Role | Login email | Password |
|---|---|---|
| Administrator | `admin@parcel.test` | `Password@123` |
| Delivery Staff | `ali@parcel.test` | `Password@123` |
| Delivery Staff | `sara@parcel.test` | `Password@123` |

Open `http://localhost:3000/login` and sign in using the **email address** and password. The current login form and controller authenticate by email; username login is not currently wired into the login flow, even though usernames are stored in the database.

An inactive test staff account (`old@parcel.test`) is also present in the seed data and cannot be used to sign in.

> These are public development/demo credentials only. Do not reuse them outside a local test database. Change or remove seeded passwords before any deployment.

## 8. Application Routes and Access Roles

| Method | Route | Access | Purpose |
|---|---|---|---|
| `GET` | `/` | Public | Home page and tracking entry point |
| `GET` | `/about` | Public | About page |
| `GET` | `/health` | Public | Application health/liveness response |
| `GET` | `/login` | Public | Display staff login form |
| `POST` | `/login` | Public | Authenticate staff using email and password |
| `POST` | `/logout` | Authenticated staff | Destroy the staff session and log out |
| `GET` | `/track` | Public | Display tracking form |
| `GET` | `/track?trackingNumber=PT-000001` | Public | Search for a parcel and display its status/history |
| `GET` | `/admin/dashboard` | Administrator | Display admin dashboard |
| `GET` | `/parcels` | Administrator | List and filter parcels |
| `GET` | `/parcels/new` | Administrator | Display parcel registration form |
| `POST` | `/parcels/quote` | Administrator | Calculate a parcel delivery-charge quote |
| `POST` | `/parcels` | Administrator | Register a parcel |
| `GET` | `/parcels/:id` | Administrator | Display parcel details and actions |
| `POST` | `/parcels/:id/assign` | Administrator | Assign delivery staff to a parcel |
| `POST` | `/parcels/:id/status` | Administrator | Update parcel status |
| `POST` | `/parcels/:id/return` | Administrator | Initiate a parcel return |
| `GET` | `/staff` | Delivery Staff | Display the signed-in staff member's deliveries |
| `GET` | `/staff/parcels/:id` | Assigned Delivery Staff | Display details for a parcel assigned to that staff member |
| `POST` | `/staff/parcels/:id/status` | Assigned Delivery Staff | Update the delivery status of an assigned parcel |

The tracking search sends the tracking number as the `trackingNumber` query parameter. There is no `/track/:trackingNumber` route in the current implementation.

Customers do not have accounts or a customer dashboard. Public tracking is read-only and displays the parcel's tracking number, current status, and shipment-status history rather than staff login details.

## 9. Running Tests

The current npm test command is:

```bash
npm test
```

The `test` script in `package.json` runs Jest with coverage enabled (`jest --coverage`). The current test folder contains `test/app.test.js`, which includes basic application checks for:

- `GET /health` returning a successful health response.
- `GET /` rendering the home page.
- An unknown route returning a 404 page.

The test suite is still limited. The current `package.json` does **not** define separate `test:unit`, `test:integration`, or `dev` scripts. Do not use those commands unless the scripts are added to `package.json` later. The database diagnostic scripts in `database/` are manual scripts, not part of the Jest command.

To run the database connection diagnostic after configuring `.env` and creating the database, use:

```bash
node database/test-connection.js
```

Other database helper scripts are available in the `database/` directory. They require a running MySQL instance and a correctly configured local `.env` file.

## 10. Screenshots

The current repository contains the ParcelTrack logo at `public/images/logo.png`, but it does not yet contain screenshots of the running application. To complete this section, capture screenshots from the actual locally running application and add them under `docs/screenshots/`.

Recommended screenshots:

1. Public home page with the tracking form.
2. Staff login page.
3. Administrator dashboard.
4. Parcel registration form (after pricing rules have been configured).
5. Parcel details / staff assignment view.
6. Delivery staff dashboard or delivery details page.
7. Public tracking result showing a sample tracking number and shipment history.

After adding the image files, embed them here using relative links, for example:

```markdown
![ParcelTrack home page](docs/screenshots/home.png)
![Administrator dashboard](docs/screenshots/admin-dashboard.png)
![Public parcel tracking](docs/screenshots/public-tracking.png)
```

Only commit screenshots containing synthetic/demo parcel data. Do not include real customer contact details, passwords, session cookies, or other private information.

## 11. Current Limitations and Development Notes

- Pricing rules are not currently inserted by `database/seed.sql`; approved rates must be added to `pricing_rules` before quote and registration workflows can be used.
- Staff login currently accepts email and password, not username and password.
- The Jest suite currently contains only basic application smoke tests. More unit and route/integration tests are still needed for the business rules and workflows.
- There is no dedicated `test:unit`, `test:integration`, or `dev` npm script in the current `package.json`.
- The current implementation uses the default in-memory Express session store. This is suitable only for a local demonstration, not a production deployment.
- CSRF protection and login rate limiting/account lockout are not currently implemented.
- Screenshots of the running application still need to be captured and committed under `docs/screenshots/`.

## 12. Project Scope

The application focuses on parcel registration, configurable delivery-charge calculation, staff assignment, shipment status management, failed-delivery recording, return initiation, and public tracking.

The project scope does not include live GPS tracking, interactive maps, online payments, real-time notifications, external courier API integrations, or advanced route optimization.

## 13. Project Team

| Team member | Responsibility |
|---|---|
| Shaheer Ahmed Siddiqui | Development |
| Lakesh Kumar | Testing and Evaluation (QA) |
| Safeer Ahmed Mirani | Documentation |

## 14. Project Documentation

Project documents are maintained in the `docs/` directory:

- **SRS:** `docs/SRS_dlv_2/`
- **Software Design Specification:** `docs/SDS_dlv_3/`
- **Project proposal:** `docs/project_proposal/`
- **Design documents:** `docs/design/`
- **Backend implementation notes:** `docs/BACKEND.md`
- **GitHub workflow notes:** `docs/workflow-notes.md`

## 15. License

This project is distributed under the MIT License. See [LICENSE](LICENSE) for details.

---

**Course:** Software Quality Engineering  
**Project:** Parcel Dispatch and Tracking System (ParcelTrack)
