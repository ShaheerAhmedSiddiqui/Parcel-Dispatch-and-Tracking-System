# ParcelTrack Test Scenarios and Test Cases

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Execution status at preparation:** Not Run unless a case is updated after execution

## 1. Test Case Record Format

Each test case records its ID, requirement traceability, scenario, preconditions, inputs, steps, expected result, actual result, status, and test technique. Actual Result must be filled only after the test has been executed.

Status values: **Not Run**, **Pass**, **Fail**, **Blocked**.

## 2. Authentication and Authorization

| ID | Requirement | Scenario / test | Preconditions | Inputs | Steps | Expected result | Actual result | Status / type |
|---|---|---|---|---|---|---|---|---|
| TC-001 | FR-01, FR-03 | Administrator login | Active Administrator exists in test DB | Valid admin email and password | Open login, enter credentials, submit | Session is created and admin is redirected to /admin/dashboard | Not Run | Not Run — Positive |
| TC-002 | FR-01, FR-03 | Delivery Staff login | Active Delivery Staff account and profile exist | Valid staff email and password | Open login, enter credentials, submit | Session is created and staff is redirected to /staff | Not Run | Not Run — Positive |
| TC-003 | FR-02 | Reject incorrect password | Account exists | Correct email, incorrect password | Submit login form | Login is rejected with a generic invalid-credentials message | Not Run | Not Run — Negative |
| TC-004 | FR-02 | Reject missing login fields | Login page is available | Empty email or empty password | Submit login form with one required value missing | Request is rejected and a validation message is displayed | Not Run | Not Run — Negative |
| TC-005 | FR-02, NFR-12 | Reject inactive account | Inactive account exists in test DB | Inactive account email and its test password | Submit login form | Account cannot establish an authenticated session | Not Run | Not Run — Negative |
| TC-006 | FR-03, NFR-12, NFR-13 | Block unauthenticated staff routes | No authenticated session | GET /admin/dashboard, /parcels, /staff | Request each protected route without a session | Each request redirects to /login | Not Run | Not Run — Role-based |
| TC-007 | FR-03, NFR-13, BR-09 | Enforce role restrictions | Admin and Delivery Staff sessions are available | Admin requests staff-only route; staff requests admin-only route | Execute requests with each role session | User cannot access a route outside the assigned role | Not Run | Not Run — Role-based |
| TC-008 | FR-04 | Logout terminates session | Authenticated staff session exists | POST /logout | Submit logout, then request a protected route | Session is destroyed, cookie is cleared, and protected route requires login | Not Run | Not Run — Positive / Security |

**Implementation note:** The current login controller calls findByEmail. The SRS wording for FR-01 says username or email; username-based login must therefore be tested and recorded as an implementation gap until supported.

## 3. Parcel Registration and Input Validation

| ID | Requirement | Scenario / test | Preconditions | Inputs | Steps | Expected result | Actual result | Status / type |
|---|---|---|---|---|---|---|---|---|
| TC-009 | FR-05 to FR-09 | Register a valid parcel | Admin authenticated; approved test pricing row exists | Complete synthetic sender/receiver details, positive weight, non-negative distance, supported type | Open registration, enter valid data, obtain quote, submit | Parcel is saved with a unique tracking number and initial status Booked | Not Run | Not Run — Positive |
| TC-010 | FR-06, FR-09, NFR-08, NFR-23, BR-02 | Reject missing required parcel information | Admin authenticated | Leave one required name, contact, address, or delivery type blank | Submit registration | Registration is rejected and missing-field feedback is displayed | Not Run | Not Run — Negative |
| TC-011 | FR-06, FR-09, NFR-15 | Validate contact number classes | Admin authenticated | Contacts shorter than 7, 7 characters, 20 characters, 21 characters, or containing unsupported letters | Submit each representative contact value | Only strings matching the implemented 7–20 character contact pattern are accepted by the validator | Not Run | Not Run — BVA / EP |
| TC-012 | FR-07, FR-09, FR-14, BR-03 | Validate parcel weight | Admin authenticated | -0.01, 0, 0.01, and a non-numeric value | Submit each weight value | Only finite numeric weight greater than zero passes application validation | Not Run | Not Run — BVA / Negative |
| TC-013 | FR-12, FR-09 | Validate delivery distance | Admin authenticated | -0.01, 0, 0.01, and a non-numeric value | Submit each distance value | Negative or non-numeric distance is rejected; zero and positive distance are accepted by the validator | Not Run | Not Run — BVA |
| TC-014 | FR-07, BR-04 | Validate delivery type | Admin authenticated | STANDARD, EXPRESS, SAME_DAY, and an unsupported value | Submit each delivery type | The three supported enum values are accepted by validation; unsupported values are rejected | Not Run | Not Run — EP / Negative |
| TC-015 | FR-10 | Search parcel by tracking number | Admin authenticated; parcel exists | Existing tracking number | Search in parcel list | Matching parcel is returned to authorized staff | Not Run | Not Run — Positive |
| TC-016 | FR-08, NFR-11, NFR-22, BR-01 | Verify tracking-number uniqueness and format | Database available | Register two different parcels | Register both and compare identifiers | Each parcel receives a different unique tracking number in the PT- plus six-digit format | Not Run | Not Run — Positive |
| TC-017 | FR-05, FR-08, FR-21, FR-22, BR-08 | Verify initial status and history | Admin authenticated; test pricing row exists | Valid new parcel | Register parcel and inspect record/history | New parcel starts as Booked and an initial timestamped history record is stored | Not Run | Not Run — Positive |

## 4. Delivery Charge Calculation

| ID | Requirement | Scenario / test | Preconditions | Inputs | Steps | Expected result | Actual result | Status / type |
|---|---|---|---|---|---|---|---|---|
| TC-018 | FR-11, FR-12, BR-04 | Verify charge formula | Valid pricing row exists in isolated test DB | Base charge B, weight W, per-kg rate Rw, distance D, per-km rate Rd | Calculate quote | Result equals B + (W × Rw) + (D × Rd), rounded to two decimal places | Not Run | Not Run — Positive |
| TC-019 | FR-11, FR-12 | Verify supported delivery types use their own rules | Pricing rows exist for the tested types | STANDARD, EXPRESS, SAME_DAY with controlled test rules | Request one quote for each type | Each calculation uses the pricing row matching the selected delivery type | Not Run | Not Run — Positive / EP |
| TC-020 | FR-11, FR-14 | Reject missing pricing rule | No row exists for selected type in isolated test DB | Valid parcel values and an unseeded pricing type | Request quote | Quote fails with a missing-pricing-rule error; no parcel is registered | Not Run | Not Run — Negative |
| TC-021 | FR-11, FR-12 | Reject invalid pricing values | Unit test or isolated test rule | Negative or non-finite base/per-kg/per-km rate | Call charge calculator | Invalid pricing configuration is rejected | Not Run | Not Run — Negative |

## 5. Staff Assignment and Dispatch

| ID | Requirement | Scenario / test | Preconditions | Inputs | Steps | Expected result | Actual result | Status / type |
|---|---|---|---|---|---|---|---|---|
| TC-022 | FR-15, FR-17, BR-09 | Assign active Delivery Staff | Admin authenticated; parcel is Booked; staff profile exists | Valid staff ID | Assign staff to parcel | Assignment is saved, parcel becomes Assigned, and history is recorded | Not Run | Not Run — Positive |
| TC-023 | FR-15, FR-16 | Reject invalid or inactive staff | Admin authenticated; Booked parcel exists | Unknown staff ID or inactive account ID | Attempt assignment | Assignment is rejected and parcel remains unchanged | Not Run | Not Run — Negative |
| TC-024 | FR-16 | Enforce staff availability | Test staff profiles exist with AVAILABLE, BUSY, and OFF_DUTY availability | One staff member from each availability class | Inspect assignment choices and attempt assignment | Only staff meeting the approved availability rule are offered and assignable | Not Run | Not Run — EP / Role-based |
| TC-025 | FR-15, FR-18, BR-05 | Prevent dispatch before assignment | Admin session; parcel is Booked and unassigned | Attempt to set Dispatched | Submit status update | Unassigned parcel cannot be dispatched; parcel state remains unchanged | Not Run | Not Run — Negative |

**Implementation note:** Repository inspection showed that getAllStaff selects active staff without filtering availability, and assignStaff checks active role but not the availability value. TC-024 is therefore an explicit gap/defect test, not a claim that availability enforcement already works.

## 6. Status, Shipment History, Failed Delivery, and Returns

| ID | Requirement | Scenario / test | Preconditions | Inputs | Steps | Expected result | Actual result | Status / type |
|---|---|---|---|---|---|---|---|---|
| TC-026 | FR-19, FR-20, FR-23, BR-06 | Follow valid status workflow | Parcel registered and assigned | Booked → Assigned → Dispatched → Out for Delivery → Delivered | Execute each permitted transition | Each valid transition succeeds in the defined order | Not Run | Not Run — Positive |
| TC-027 | FR-23, BR-06 | Reject invalid status transition | Parcel in Booked or Delivered status | Attempt Booked → Delivered or Delivered → earlier state | Submit status update | Invalid transition is rejected and current status remains unchanged | Not Run | Not Run — Negative |
| TC-028 | FR-21, FR-22, NFR-09, NFR-24, BR-08 | Preserve timestamped history | Parcel can be updated | Valid permitted status change | Update status and inspect shipment_history | New status and timestamp are stored against the correct parcel; earlier history remains | Not Run | Not Run — Positive |
| TC-029 | FR-24, FR-25, BR-07 | Record failed delivery with reason | Parcel is Out for Delivery and assigned to logged-in staff | Non-empty failure reason | Submit failed delivery update | Delivery Failed status is saved and a delivery_attempt record is inserted | Not Run | Not Run — Positive |
| TC-030 | FR-25, BR-07 | Reject empty failure reason | Parcel is Out for Delivery | Empty or whitespace-only failure reason | Submit failed delivery update | Request is rejected and no attempt count or history update is committed | Not Run | Not Run — Negative |
| TC-031 | FR-26 | Increment delivery attempt count | Parcel has fewer than three attempts | First, second, and third failed attempts with valid retry progression | Record attempts sequentially | attempt_count and attempt_no increase consistently | Not Run | Not Run — Positive |
| TC-032 | FR-26, FR-27 | Enforce the implementation limit of three attempts | Parcel has three recorded failed attempts and is back in an eligible delivery state | Fourth failed attempt | Attempt to record another failure | Fourth attempt is rejected; return should be initiated according to the implemented policy | Not Run | Not Run — BVA / Negative |
| TC-033 | FR-27, FR-28, BR-11 | Initiate return | Parcel is Delivery Failed; admin authenticated | Non-empty return reason | Initiate return | Return row is created and status changes to Return Initiated | Not Run | Not Run — Positive |
| TC-034 | FR-28 | Progress return | Return is already initiated | Return Initiated → Return in Transit → Returned to Sender | Execute permitted return transitions | Return progresses only through permitted transitions | Not Run | Not Run — Positive |
| TC-035 | FR-28, NFR-24 | Verify return completion timestamp | Parcel has a parcel_returns record | Complete return operation | Complete return and inspect parcel_returns | completed_at is set when status becomes Returned to Sender | Not Run | Not Run — Positive / Integrity |

**Implementation note:** A completeReturn repository method exists, but the inspected route/controller flow does not call it. TC-035 must verify the database completion timestamp and should be tracked as a defect if the generic status update leaves completed_at NULL.

## 7. Public Tracking and Privacy

| ID | Requirement | Scenario / test | Preconditions | Inputs | Steps | Expected result | Actual result | Status / type |
|---|---|---|---|---|---|---|---|---|
| TC-036 | FR-29, FR-30, NFR-04 | Open public tracking without login | No session | GET /track | Open tracking page | Tracking form is available without authentication | Not Run | Not Run — Positive |
| TC-037 | FR-30, FR-31, FR-32 | Track an existing parcel | Parcel with history exists | Valid PT- plus six-digit tracking number | Search through public tracking form | Current status and available timestamped shipment history are displayed | Not Run | Not Run — Positive |
| TC-038 | FR-33 | Reject invalid tracking format | Public tracking page is available | Malformed tracking number | Submit tracking search | Clear invalid-format message is shown without a database lookup | Not Run | Not Run — Negative / EP |
| TC-039 | FR-33 | Handle unknown tracking number | Database available | Well-formed tracking number not present in DB | Submit tracking search | A no-parcel-found message is displayed | Not Run | Not Run — Negative |
| TC-040 | FR-34, FR-35, NFR-16, BR-10 | Verify public data minimization | Existing parcel and history | Valid tracking number | Open public result and inspect rendered content/data | Public view contains tracking/status/history only; no staff account details, phone numbers, full sender/receiver data, or charge details | Not Run | Not Run — Security |
| TC-041 | NFR-16, BR-10 | Verify customer read-only boundary | No authenticated staff session | POST to a staff/admin mutation route | Attempt request without authentication | Customer cannot change parcel records; protected mutation routes reject/redirect | Not Run | Not Run — Security / Role-based |

## 8. Non-Functional and Cross-Cutting Tests

| ID | Requirement | Scenario / test | Preconditions | Inputs | Steps | Expected result | Actual result | Status / type |
|---|---|---|---|---|---|---|---|---|
| TC-042 | NFR-05, NFR-06 | Measure response-time target | Agreed hardware, database, test dataset, and load profile | Representative normal requests and tracking requests | Run repeatable timing test and calculate percentile | At least 95% of normal requests complete within 2 seconds under the agreed test conditions; tracking response meets the agreed acceptable target | Not Run | Not Run — Performance |
| TC-043 | NFR-07 | Check concurrent staff use | Dedicated test environment and multiple test accounts | Defined number of simultaneous sessions and requests | Execute concurrent staff workflows | Application supports the agreed concurrent test load without data corruption or unhandled failures | Not Run | Not Run — Performance / Reliability |
| TC-044 | NFR-10 | Handle database unavailability | Controlled test environment | Database service stopped or connection intentionally unavailable | Request a database-dependent page/operation | User receives an appropriate error and no false success is reported | Not Run | Not Run — Reliability |
| TC-045 | NFR-14 | Verify password storage | Isolated test DB and test account | Known test password | Create/read account through approved setup and inspect stored value | Stored credential is a password hash and not the plain-text test password | Not Run | Not Run — Security |
| TC-046 | NFR-15 | Check input handling and parameterization | Controlled test environment | Special characters and SQL-like strings in searchable/validated fields | Submit through relevant forms and searches | Input is validated/handled as data; it does not alter query structure or expose unrelated records | Not Run | Not Run — Security / Negative |
| TC-047 | NFR-01 to NFR-03, NFR-20, NFR-21 | Check usability and browser layouts | Supported desktop/laptop browsers available | Representative pages and invalid form inputs | Inspect labels, instructions, validation messages, and layout in target browsers | Pages remain understandable and usable; validation feedback is visible and layout is not broken | Not Run | Not Run — Usability / Compatibility |

## 9. Automated Test Mapping

| Automated test ID | Test file | Coverage |
|---|---|---|
| UT-001 to UT-005 | test/unit/chargeCalculator.test.js | Charge formula, numeric inputs, rounding, invalid weight/distance, missing/invalid pricing |
| UT-006 to UT-010 | test/unit/statusMachine.test.js | Permitted transitions, forbidden transitions, terminal statuses, unknown statuses |
| UT-011 to UT-013 | test/unit/trackingNumber.test.js | Tracking-number format and invalid parcel identifiers |
| UT-014 to UT-019 | test/unit/validators.test.js | Required fields, contacts, weight, distance, delivery types |
| IT-001 to IT-007 | test/integration/app.integration.test.js | Login/tracking page rendering, invalid tracking format, protected route redirects, unauthenticated logout |
| Existing smoke tests | test/app.test.js | Health endpoint, home page, 404 behavior |

Automated tests that require a live MySQL database are intentionally not included until the repository has a dedicated, isolated test-database setup.

## 10. Execution Record

The cases in this document are initially **Not Run**. After execution, update Actual Result and Status. Link any reproducible failure to its GitHub defect issue and record the retest result.


---

## 11. Deliverable 6 — Automated Execution Addendum

**Execution evidence:** 27 November 2026 terminal capture; command `npm test`.  
**Overall automated result:** 6 suites passed, 31 tests passed, 0 failed; 9.582 seconds.  
**Coverage:** 35.36% statements, 20.90% branches, 28.35% functions, 35.30% lines.

### Automated result mapped to test cases

The entries below record the automated coverage actually exercised. Where the automated check covers only a unit/service or page-rendering portion, the complete system scenario remains Not Run.

| Test case | Automated evidence | Recorded result and limitation |
|---|---|---|
| TC-006 | IT-004 | Pass for unauthenticated redirects on /admin/dashboard, /parcels, and /staff |
| TC-011 | UT-016 | Partial unit verification passed for contact length/character validation; form submission not run |
| TC-012 | UT-017 | Partial unit verification passed for weight validation; parcel form/database flow not run |
| TC-013 | UT-017 | Partial unit verification passed for distance validation; parcel form/database flow not run |
| TC-014 | UT-018, UT-019 | Partial unit verification passed for supported/unsupported delivery types; form flow not run |
| TC-018 | UT-001, UT-002 | Charge-calculator formula and rounding assertions passed; database quote flow not run |
| TC-020 | UT-005 | Missing pricing-rule input was rejected by the calculator; database lookup/registration flow not run |
| TC-021 | UT-005 | Invalid pricing configuration was rejected by the calculator; database configuration flow not run |
| TC-026 | UT-006, UT-007 | Partial service-level verification passed for permitted transitions; controller/database workflow not run |
| TC-027 | UT-008, UT-009, UT-010 | Partial service-level verification passed for invalid/terminal/unknown transitions; controller/database workflow not run |
| TC-036 | IT-002 | Public tracking page rendered without authentication; actual parcel search/result not run |
| TC-038 | IT-003 | Pass for malformed tracking-number request returning HTTP 400 and expected message |

### Additional automated checks

- IT-001: staff login page rendered.
- IT-005: unauthenticated logout redirected to login.
- SMK-001 to SMK-004 in `test/app.test.js`: health endpoint, home page, and unknown-route handling passed.
- All other Deliverable 5 scenarios remain Not Run unless explicitly listed above. A partial unit check does not mark the complete browser/database test case as passed.

### Execution status distinction

- **Automated checks:** 31 passed, 0 failed.
- **Full system scenarios:** 9 remain Not Run.
- **UAT scenarios:** 7 remain pending.
- **Database, performance, concurrency, browser compatibility, and cross-role workflows:** not evidenced by this automated run.

