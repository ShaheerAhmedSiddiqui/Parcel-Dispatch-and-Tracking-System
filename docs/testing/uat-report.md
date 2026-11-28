# ParcelTrack User Acceptance Testing (UAT) Report

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Status:** Prepared template — acceptance execution pending

## 1. Purpose

UAT verifies that the implemented workflows meet the practical needs of the defined project actors. UAT must be performed using synthetic demonstration data and a controlled test environment.

## 2. UAT Participants and Roles

| Actor | UAT responsibility |
|---|---|
| Administrator / Courier Clerk | Validate parcel registration, charge preview, parcel search, staff assignment, status oversight, and return initiation |
| Delivery Staff | Validate assigned delivery visibility, delivery detail viewing, status updates, and failed-delivery recording |
| Public Customer | Validate tracking without login, current status display, history visibility, and privacy |

## 3. UAT Scenarios

| UAT ID | Actor | Scenario | Preconditions | Steps / input | Expected result | Actual result | Acceptance |
|---|---|---|---|---|---|---|---|
| UAT-01 | Administrator / Courier Clerk | Register a parcel | Admin account available; pricing row configured | Enter valid synthetic sender/receiver details, weight, distance, and delivery type; request quote and submit | Parcel is registered with a tracking number and Booked status | Not Run | Pending |
| UAT-02 | Administrator / Courier Clerk | Review a parcel and assign staff | Booked test parcel and staff test account exist | Open parcel details and assign eligible staff | Assigned staff is linked and parcel status/history is updated | Not Run | Pending |
| UAT-03 | Administrator / Courier Clerk | Manage parcel status and return | Parcel is in a permitted status | Review status actions; initiate return with a reason for an eligible failed parcel | Only permitted actions are available and return initiation is recorded | Not Run | Pending |
| UAT-04 | Delivery Staff | View assigned deliveries | Delivery Staff account is linked to a staff profile and parcels are assigned | Sign in and open delivery list/details | Staff can view assigned deliveries and cannot access admin-only routes | Not Run | Pending |
| UAT-05 | Delivery Staff | Update delivery and record failure | Parcel assigned to the signed-in staff member | Update a permitted status; attempt a failed delivery with and without a reason | Permitted update succeeds; failed delivery without a reason is rejected | Not Run | Pending |
| UAT-06 | Public Customer | Track a parcel | A parcel and shipment history exist | Open public tracking page without login and search using a valid tracking number | Current status and history are displayed | Not Run | Pending |
| UAT-07 | Public Customer | Verify tracking privacy and error handling | Public tracking page available | Try malformed and unknown tracking numbers; inspect displayed data | Clear errors appear; no private staff account or unnecessary personal details are exposed | Not Run | Pending |

## 4. Acceptance Record

| UAT ID | Reviewer | Date | Decision (Accepted / Rejected / Conditional) | Comments / evidence |
|---|---|---|---|---|
| UAT-01 | To be recorded | Not Run | Pending | |
| UAT-02 | To be recorded | Not Run | Pending | |
| UAT-03 | To be recorded | Not Run | Pending | |
| UAT-04 | To be recorded | Not Run | Pending | |
| UAT-05 | To be recorded | Not Run | Pending | |
| UAT-06 | To be recorded | Not Run | Pending | |
| UAT-07 | To be recorded | Not Run | Pending | |

## 5. UAT Exit Criteria

- All in-scope UAT scenarios have been executed.
- Actual results and evidence have been recorded.
- Rejected scenarios have linked defect records or documented reasons.
- Known limitations are communicated to the project team.
- Acceptance decisions are recorded by the designated reviewers.

## 6. UAT Conclusion

UAT scenarios are prepared but have not been executed or accepted. Do not mark the system as accepted until the reviewers complete the scenarios and record their decisions.


---

## 7. Deliverable 6 — UAT Execution Status

The latest PR #27 CI run passed 38 regular automated tests and 9 isolated MySQL workflow tests, but it did not include human acceptance participants or reviewer decisions. All seven UAT scenarios above therefore remain **Not Run / Pending**. No reviewer sign-off, acceptance, rejection, or conditional acceptance is claimed.

UAT must be performed separately with the Administrator / Courier Clerk, Delivery Staff, and public Customer workflows, using synthetic data and recording actual results and reviewer decisions.


---

## 7. Deliverable 6 — Human UAT Remains Pending

The database-backed automated workflow suite is not a substitute for acceptance by project users. All seven UAT scenarios above remain Not Run / Pending.

The Administrator / Courier Clerk, Delivery Staff, and public Customer scenarios must be demonstrated and reviewed using the application UI and synthetic records. Record the participant/reviewer, date, actual result, decision, comments, and screenshot evidence for each scenario. No acceptance or sign-off is claimed in this report.


## 8. Latest automated system test context

CI workflow [46161684598](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/actions/runs/46161684598) passed 38 regular tests and 9 MySQL-backed workflow tests. This is engineering/system verification, not a human acceptance decision. UAT-01 to UAT-07 must still be demonstrated to the Administrator / Courier Clerk, Delivery Staff, and public Customer representatives, with named reviewers, actual outcomes, decisions, dates and screenshots.


---

## 9. Manual UAT Setup — Isolated Local Database

Run UAT only with synthetic data in the dedicated `parcel_db_test` database. Do not use the normal `parcel_db` working database or any production/customer records.

### 9.1 Prepare the test database

1. Start MySQL in XAMPP.
2. Confirm the local `.env` has the correct `DB_HOST`, `DB_PORT`, `DB_USER`, and `DB_PASSWORD` for your local MySQL installation. Your local environment commonly uses port 3307; use the port configured on your machine.
3. Run:

```powershell
npm run test:db
```

This creates/updates only the guarded `parcel_db_test` database, applies the project schema, and seeds synthetic test-only tariffs and accounts. The command also runs the automated DB test suite.

### 9.2 Start the application against the test database

In the PowerShell window used to start the application:

```powershell
$env:DB_NAME = "parcel_db_test"
$env:SESSION_SECRET = "parceltrack-local-uat-only-secret"
npm start
```

Keep this PowerShell session open while performing UAT. The environment override applies to that application process; it does not change `.env` or redirect other sessions.

### 9.3 Synthetic UAT accounts

| Role | Username | Password |
|---|---|---|
| Administrator / Courier Clerk | `testadmin` | `TestPass123!` |
| Delivery Staff | `testrider` | `TestPass123!` |
| Public Customer | No account required | Use `/track` |

These accounts are created by the isolated test setup script. They are for local testing only and must not be used as real credentials.

### 9.4 Recommended UAT execution order

| Order | UAT ID | Action |
|---|---|---|
| 1 | UAT-01 | As Administrator, register a synthetic parcel. Verify quote, tracking number and Booked status. With test tariffs, weight 2, distance 5 and STANDARD should quote 135; this is a synthetic test value, not a company tariff. |
| 2 | UAT-02 | Open the parcel details and assign the AVAILABLE test rider. Confirm the parcel becomes Assigned and the rider availability becomes BUSY. |
| 3 | UAT-04 | Sign in as Delivery Staff and verify the assigned parcel appears in the delivery list and details. Attempt an admin-only route and confirm it is denied. |
| 4 | UAT-05 | As the rider, move the parcel through Dispatched and Out for Delivery. Submit a blank failure reason (it should be rejected), then submit a valid synthetic reason (it should be recorded). |
| 5 | UAT-03 | As Administrator, initiate the return for the eligible failed parcel. Then as the rider, advance it through Return in Transit to Returned to Sender. Confirm the final status and completion timestamp. |
| 6 | UAT-06 | Sign out and open `/track` as a public customer. Search using the parcel tracking number and check its current status/history. |
| 7 | UAT-07 | Try malformed and unknown tracking numbers. Inspect the public page and confirm it does not expose names, phone numbers, addresses, staff details or delivery charges. |

### 9.5 Evidence and acceptance record

For each UAT ID, capture:
- Reviewer/participant and role being evaluated.
- Date and environment.
- Actual result and Accepted / Rejected / Conditional decision.
- Screenshot saved under `docs/testing/evidence/`, for example `uat-01-register-parcel.png`.
- Any defect issue reference and reproduction steps if the outcome differs from expectation.

Update the UAT scenario row and Acceptance Record only after the reviewer actually performs the scenario. Do not mark a scenario accepted based only on the automated CI run. All seven acceptance decisions are currently **Pending**.
