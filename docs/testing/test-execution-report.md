# ParcelTrack Test Execution Report

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 6 — Test Execution and Defect Report  
**Execution type:** Automated unit and HTTP integration/smoke tests  
**Execution date:** 27 November 2026 (based on the supplied evidence filenames)  
**Execution status:** Original local baseline and updated PR-branch CI suites passed; UAT and remaining manual/non-functional validation remain pending

## 1. Execution Environment

| Field | Recorded value |
|---|---|
| Operating environment | Windows PowerShell |
| Project directory | `E:\universityMaterial\5thSemester\SoftwareQualityEngineering\Project\Parcel-Dispatch-and-Tracking-System` |
| Command | `npm test` |
| Test runner | Jest (repository-configured command) |
| HTTP test library | Supertest |
| Node.js version | Not shown in captured terminal output |
| npm version | Not shown in captured terminal output |
| Database-backed test environment | Not evidenced in this run |
| Exact commit under test | Not captured at execution time |

The report records only the output visible in the supplied terminal screenshots. Runtime and package versions, database state, and the exact tested commit were not present in the evidence and are therefore not inferred.

## 2. Execution Summary

| Metric | Result |
|---|---:|
| Test suites passed | 6 |
| Test suites failed | 0 |
| Total tests | 31 |
| Tests passed | 31 |
| Tests failed | 0 |
| Snapshots | 0 |
| Execution time | 9.582 seconds |

**Result:** All 31 automated tests passed in the captured run. No automated assertion failure was reported.

## 3. Test Suite Results

| Test file | Tests reported by suite | Result |
|---|---:|---|
| `test/unit/chargeCalculator.test.js` | 5 | Passed |
| `test/unit/statusMachine.test.js` | 5 | Passed |
| `test/unit/validators.test.js` | 7 | Passed |
| `test/unit/trackingNumber.test.js` | 3 | Passed |
| `test/app.test.js` | 4 | Passed |
| `test/integration/app.integration.test.js` | 7 | Passed |
| **Total** | **31** | **31 passed** |

The integration suite includes a parameterized unauthenticated-route check for three protected paths. Jest reports those parameterized cases individually, which contributes to the seven tests in that suite.

## 4. Automated Test Case Results

### 4.1 Unit tests

| Automated test IDs | Area | Actual result | Status |
|---|---|---|---|
| UT-001 to UT-005 | Charge calculation, rounding, invalid weight/distance, missing/invalid pricing configuration | All assertions passed | Pass |
| UT-006 to UT-010 | Permitted/forbidden status transitions and terminal/unknown statuses | All assertions passed | Pass |
| UT-011 to UT-013 | Tracking-number formatting and parcel ID validation | All assertions passed | Pass |
| UT-014 to UT-019 | Parcel validation, required fields, contact boundaries, weight/distance and delivery type | All assertions passed | Pass |
| Unnumbered helper check in `validators.test.js` | `isNonEmpty` accepts non-blank strings and rejects blank/null values | Assertion passed | Pass |

### 4.2 HTTP integration and application smoke tests

| Automated test | Actual result | Status |
|---|---|---|
| IT-001 — render staff login page | HTTP 200; expected page text present | Pass |
| IT-002 — render public tracking page without authentication | HTTP 200; expected page text present | Pass |
| IT-003 — reject malformed tracking number | HTTP 400; expected validation message present | Pass |
| IT-004 — protect `/admin/dashboard`, `/parcels`, and `/staff` | All three unauthenticated requests redirected to `/login` | Pass |
| IT-005 — unauthenticated logout | Request redirected to `/login` | Pass |
| SMK-001 — health endpoint | `GET /health` returned HTTP 200 and status `ok` | Pass |
| SMK-002 — home page | `GET /` returned HTTP 200 and expected page text | Pass |
| SMK-003 and SMK-004 — unknown route handling | Unknown-route checks returned HTTP 404 | Pass |

## 5. Code Coverage

| Coverage metric | Result |
|---|---:|
| Statements | 35.36% |
| Branches | 20.90% |
| Functions | 28.35% |
| Lines | 35.30% |

Selected coverage observations from the captured report:

| Source area | Statements | Branches | Functions | Lines |
|---|---:|---:|---:|---:|
| `src/app.js` | 80.48% | 21.42% | 66.66% | 80.48% |
| `src/controllers` | 15.97% | 4.46% | 8.33% | 16.07% |
| `src/middleware` | 37.50% | 33.33% | 75.00% | 37.50% |
| `src/repositories` | 7.69% | 0.00% | 0.00% | 7.69% |
| `src/routes` | 100.00% | 100.00% | 100.00% | 100.00% |
| `src/services` | 98.07% | 97.61% | 100.00% | 98.03% |

Coverage indicates that the tested service logic and route definitions are covered well, but large parts of the application remain untested. In particular, controller and repository coverage is low. A passing test run does not mean every source path or SRS requirement has been verified.

## 6. Test Case Interpretation

The automated results support the specific unit and HTTP checks listed above. They do not complete the corresponding end-to-end workflows.

- Unit-level validation results do not prove that parcel registration through the browser and database succeeds.
- Charge-calculator tests do not prove that pricing rows are seeded or that quote/registration database flows work.
- Status-machine tests do not prove that controller authorization, database updates, or shipment-history persistence work.
- Rendering the public tracking page does not prove that a real parcel lookup and privacy review succeeds.
- Redirecting unauthenticated routes does not prove every cross-role authorization scenario.
- No full system workflow, live MySQL repository test, performance/concurrency test, browser compatibility test, or UAT sign-off is included in this run.

See the automated execution overlay in `test-scenarios-and-cases.md` for the test-case-level mapping. System testing and UAT statuses remain pending.

## 7. Defects and Follow-up

- Automated test failures in this run: **0**.
- Runtime defects confirmed by these automated test results: **0**.
- Known implementation gaps carried forward from Deliverable 5 source review are recorded separately in `defect-log.md`. They were not reproduced by this automated run.
- Low coverage is a testing gap and not, by itself, a confirmed application defect.

## 8. Evidence

The captured terminal output is represented by the evidence record in `evidence/automated-test-run.md`. The two original screenshots were supplied in the project conversation. They should also be copied into `docs/testing/evidence/` in the repository before final submission if image evidence is required as committed project material.

## 9. Conclusion

The captured automated run is successful: **6 of 6 suites and 31 of 31 tests passed**. The global line coverage is **35.30%**, so additional controller, repository, database, system, security, performance, and UAT testing is still required. Deliverable 6 must not be considered fully complete until those remaining tests are executed or explicitly marked blocked/not run with reasons.


---

## 10. Follow-up Fix Branch and New Test Run

After the original 31-test run recorded above, three source-level gaps were confirmed and corrected in the proposed changes in [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27):

- Login now supports a username or email identifier.
- Assignment now filters and transactionally reserves AVAILABLE staff; staff are released on delivery/return completion or unassignment.
- Normal Returned to Sender status updates route through the transaction that records `parcel_returns.completed_at`.

Regression tests were added under `test/controllers/` and `test/unit/`. An isolated MySQL-backed workflow suite was also added at `test/database/parcelWorkflow.integration.test.js`, run by `npm run test:db`.

**Execution status:** The original 31 passing tests predate these changes. The new regression and database tests must be considered pending until PR #27's CI run and local database execution produce actual results. The supplied screenshots do not evidence execution of the new tests.


---

## 11. Updated CI Execution — PR #27

**CI run:** [46161684598](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/actions/runs/46161684598)  
**Commit:** `fda469d7effa48d5ad20f111821fd917978af1e4`  
**Date:** 28 November 2026  
**Environment:** Ubuntu 26.04.1, Node.js 22.23.5, npm 10.9.9, MySQL 8.0.46  
**Database:** guarded, isolated `parcel_db_test` with synthetic accounts and test-only tariff values

### 11.1 Regular automated suite

Command: `npm test`

| Metric | Result |
|---|---:|
| Passed suites | 10 |
| Skipped suites | 1 (database suite is run separately) |
| Passed tests | 38 |
| Skipped tests | 9 (database suite is run separately) |
| Failed tests | 0 |
| Snapshots | 0 |
| Execution time | 2.692 seconds |
| Statements | 45.66% |
| Branches | 29.41% |
| Functions | 38.23% |
| Lines | 45.64% |

All 10 non-database test suites passed, including the added username/email login, available-staff repository and assignment, and return-completion regression tests.

### 11.2 Isolated MySQL workflow suite

Command: `npm run test:db`

| Metric | Result |
|---|---:|
| Passed suites | 1 |
| Passed tests | 9 |
| Failed tests | 0 |
| Execution time | 1.77 seconds |

The nine tests verified:
- Administrator and Delivery Staff username login, role access boundaries, quote calculation for STANDARD/EXPRESS/SAME_DAY, and missing pricing-rule rejection.
- Parcel registration, unique PT tracking numbers, initial Booked status and history, and rejection of dispatch before assignment.
- Assignment to AVAILABLE staff; rejection of BUSY, OFF_DUTY, inactive and unknown staff; staff reservation as BUSY.
- Normal delivery status progression, history timestamps, and staff availability release after delivery.
- Failed delivery requires a reason; attempts are recorded sequentially and a fourth failure is rejected.
- Return initiation/progression through the normal endpoint and a non-NULL `parcel_returns.completed_at`.
- Public tracking without login, an existing tracking result, privacy of sender/receiver personal information and charges, read-only access, malformed and unknown tracking-number handling.
- Concurrent assignment: two simultaneous parcel assignments competing for one AVAILABLE staff profile resulted in one successful assignment and one HTTP 409; the rider was not double-booked.
- A low-load response-time sample: 20 sequential public tracking requests, p95 **4.21 ms** in this CI environment.

### 11.3 Combined execution interpretation

The latest CI run passed **38 regular automated tests + 9 isolated MySQL workflow tests = 47 executed tests, with 0 failures**. The 9 database tests are listed as skipped in the ordinary `npm test` command because the separate `npm run test:db` command runs them against the isolated MySQL database.

This is automated CI evidence on the PR branch, not proof of human UAT or full visual browser compatibility. The p95 sample is a small, sequential, low-load baseline—not a stress/load test or a substitute for the complete NFR-05/NFR-06 performance assessment. Database-outage behavior, broad concurrency/load targets, manual responsive-browser inspection, and the seven human UAT decisions remain outstanding.

The three source-confirmed defects have passed their regression coverage on PR #27. They remain associated with an open PR and are not yet merged into `main`.
