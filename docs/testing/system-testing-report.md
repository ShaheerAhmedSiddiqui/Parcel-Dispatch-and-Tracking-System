# ParcelTrack System Testing Report

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Report status:** Automated MySQL workflow scenarios executed in CI; manual browser/non-functional completion pending

## 1. Objective

Record the results of testing complete ParcelTrack workflows from the perspective of the Administrator / Courier Clerk, Delivery Staff, and public Customer.

## 2. Environment Record

| Field | Execution detail |
|---|---|
| Branch / commit under test | `fix/deliverable-6-verified-defects` / `558bff8f71635c3045bb52caf3bb63ab17f5f1a6` |
| Test date | 28 November 2026 |
| Tester / execution agent | GitHub Actions CI (automated; no human UAT reviewer) |
| Operating system | Ubuntu 26.04.1 |
| Browser and version | Not tested by CI; browser UI check pending |
| Node.js version | 22.23.5 |
| MySQL version / database | MySQL 8.0.46 / isolated `parcel_db_test` |
| Test data source | Synthetic test data only |
| Application configuration | Local test configuration; secrets must not be recorded |

## 3. System Test Scenarios

| Scenario ID | Workflow | Related test cases | Expected outcome | Actual result | Status |
|---|---|---|---|---|---|
| SYS-01 | Staff login and role-based landing page | TC-001, TC-002, TC-006, TC-007 | Each active role reaches its permitted area; unauthorized access is blocked | Username-based Administrator and Delivery Staff login succeeded; role-specific access was enforced by the database-backed HTTP workflow. | Pass — automated CI / isolated MySQL |
| SYS-02 | Register parcel and produce tracking number | TC-009 to TC-017 | Valid parcel is saved with unique tracking number, Booked status, and initial history | Two synthetic parcels were registered; tracking numbers matched PT- plus six digits, were unique, and initial Booked status/history was stored. | Pass — automated CI / isolated MySQL |
| SYS-03 | Quote delivery charge | TC-018 to TC-021 | Configured pricing rule produces the expected charge; invalid/missing configuration is rejected | STANDARD, EXPRESS and SAME_DAY quotes used their seeded test tariffs; missing SAME_DAY rule was rejected. | Pass — automated CI / isolated MySQL |
| SYS-04 | Assign delivery staff and dispatch | TC-022 to TC-025 | Eligible staff assignment is saved; unassigned dispatch is rejected | AVAILABLE assignment succeeded and reserved staff as BUSY; BUSY, OFF_DUTY, inactive, unknown and concurrent duplicate assignment attempts were rejected; unassigned dispatch was rejected. | Pass — automated CI / isolated MySQL |
| SYS-05 | Complete normal delivery workflow | TC-026 to TC-028 | Permitted status progression and timestamped history are preserved | Parcel completed Booked → Assigned → Dispatched → Out for Delivery → Delivered; history timestamps existed and staff availability returned to AVAILABLE. | Pass — automated CI / isolated MySQL |
| SYS-06 | Record failed delivery and attempts | TC-029 to TC-032 | Failure reason is required; count is maintained; attempt limit is enforced | Blank failure reason was rejected; three attempts were recorded in order; fourth failure was rejected without incrementing the count. | Pass — automated CI / isolated MySQL |
| SYS-07 | Initiate and complete a return | TC-033 to TC-035 | Return progression is valid and completed_at is stored upon completion | Return Initiated → Return in Transit → Returned to Sender completed through the normal endpoint; `completed_at` was non-NULL. | Pass — automated CI / isolated MySQL |
| SYS-08 | Customer tracking and privacy | TC-036 to TC-041 | Public tracking works without login and exposes only permitted information | Public tracking returned an existing parcel without login, excluded personal/contact/address/charge data, rejected mutation, and handled malformed/unknown numbers. | Pass — automated CI / isolated MySQL |
| SYS-09 | Error and non-functional behavior | TC-042 to TC-047 | Performance, concurrency, database errors, password storage, input safety, and browser usability are evaluated | Concurrent assignment protection passed; 20 sequential public tracking requests produced p95 4.56 ms. This is only a low-load baseline; broad load, DB outage and browser compatibility tests remain pending. | Partial Pass — CI low-load baseline only |

## 4. Execution Summary

| Metric | Count |
|---|---:|
| System scenarios planned | 9 |
| Passed (automated criteria) | 8 |
| Partially passed | 1 (SYS-09) |
| Failed | 0 |
| Not Run | 0 for automated scenario checks; manual visual/NFR follow-up remains |

## 5. Known Test Dependencies / Risks

- The repository seed still does not define production pricing tariffs; CI supplied synthetic values only to the isolated `parcel_db_test` database. Do not interpret them as company rates.
- Username/email authentication, availability enforcement, and return completion were fixed and passed regression tests on PR #27; merge to `main` is pending.
- SYS-09 includes a single-rider concurrency race check and a 20-request sequential tracking p95 sample only; it does not fully establish load/performance targets.
- Browser viewport/responsive behavior and visual usability still require manual inspection.
- Database-outage recovery and broader concurrent-use targets still require explicit test design and execution.

## 6. Defect and Evidence Log

| Defect ID | Related test case | Summary | Severity | Evidence / link | State |
|---|---|---|---|---|---|
| #23 | TC-024 | Availability filtering and transactional reservation | To be assessed | PR #27 CI run 46161259201 | Retested Pass on PR branch; awaiting merge |
| #24 | TC-035 | Return completion timestamp in normal status workflow | To be assessed | PR #27 CI run 46161259201 | Retested Pass on PR branch; awaiting merge |
| #22 | FR-01 / TC-001 | Username login support | To be assessed | PR #27 CI run 46161259201 | Retested Pass on PR branch; awaiting merge |
| To be assigned | TC-020 | Fresh seed does not include pricing rules | Test environment dependency | database/seed.sql | Pending |

Create or link GitHub defect issues only after confirming the observed failure through reproducible execution, except where a source-level implementation gap is explicitly being tracked separately.

## 7. Conclusion

The automated system workflow checks SYS-01 through SYS-08 passed in CI using synthetic records and isolated MySQL; SYS-09 partially passed with concurrency and a limited sequential response-time sample. These results do not replace browser-based visual inspection, full load/stress testing, database outage testing, or human UAT. See the CI evidence and keep the remaining manual work open.


---

## 8. Deliverable 6 — Automated Test Run Context

A separate local automated run executed `npm test` and reported:

| Metric | Result |
|---|---:|
| Automated suites | 6 passed / 6 total |
| Automated tests | 31 passed / 31 total |
| Failed tests | 0 |
| Execution time | 9.582 seconds |
| Line coverage | 35.30% |

This run covered unit tests and selected HTTP routes/smoke checks. It did **not** execute the nine end-to-end system scenarios above. Therefore the System Test Scenario status remains:

| Metric | Count |
|---|---:|
| System scenarios planned | 9 |
| System scenarios passed | 0 |
| System scenarios failed | 0 |
| System scenarios blocked | 0 |
| System scenarios not run | 9 |

Do not combine unit/integration suite totals with system-scenario totals. Database-backed parcel workflows, full role-based journeys, performance/concurrency checks, and privacy inspection still require separate execution. See `test-execution-report.md` and `evidence/automated-test-run.md`.



---

## 10. Additional Database-Backed System Workflow Tests

PR #27 adds `test/database/parcelWorkflow.integration.test.js` and `npm run test:db`. The suite is designed to verify:

| Scenario | Planned database-backed checks | Current status |
|---|---|---|
| SYS-01 | Username login and administrator/delivery-staff route boundaries | Pass — CI |
| SYS-02 | Parcel registration, unique tracking number, Booked status and initial history | Pass — CI |
| SYS-03 | STANDARD/EXPRESS/SAME_DAY quotes and missing pricing rejection | Pass — CI |
| SYS-04 | AVAILABLE-only assignment, BUSY/OFF_DUTY/inactive/unknown rejection, reservation and concurrency guard | Pass — CI |
| SYS-05 | Normal delivery statuses, shipment history and release of staff availability | Pass — CI |
| SYS-06 | Failure reason, delivery-attempt history and rejection of attempt four | Pass — CI |
| SYS-07 | Return initiation/progression and persisted `completed_at` | Pass — CI |
| SYS-08 | Public tracking without login, privacy, read-only behavior, malformed/unknown numbers | Pass — CI |
| SYS-09 | Concurrent assignment and 20-request sequential tracking response baseline | Partial Pass — full stress/load, DB outage and browser tests pending |

The test runner creates or updates only the guarded `parcel_db_test` database. Run it with `npm run test:db` after configuring local MySQL. Do not point it at `parcel_db` or production data.

The CI job configured in [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27) runs both the standard automated tests and the database workflow suite. No system scenario is recorded as Passed until the run output is available and reviewed.


### CI evidence details

- Workflow: [GitHub Actions run 46161259201](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/actions/runs/46161259201)
- Standard suite: 38 passed, 0 failed; 9 database tests are skipped here because the separate DB command runs them.
- Isolated database suite: 9 passed, 0 failed.
- Total executed in the CI job: 47 tests passed, 0 failed.
- Tracking performance sample: p95 4.56 ms for 20 sequential requests in this CI runner. This is not a representative load test or a formal NFR acceptance result.
