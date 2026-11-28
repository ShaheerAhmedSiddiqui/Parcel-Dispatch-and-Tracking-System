# ParcelTrack Requirements-to-Test Traceability Matrix

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Status:** Prepared; execution has not yet been recorded

## 1. Purpose

This matrix links SRS requirements and business rules to test cases. A mapping indicates planned test coverage, not proof that the requirement has passed. Test status remains Not Run until execution evidence is recorded.

## 2. Functional Requirements

| Requirement ID | Requirement area | Test case IDs | Testing level / technique | Execution status |
|---|---|---|---|---|
| FR-01 | Staff login using username or email and password | TC-001, TC-002; username gap check | Integration / positive, negative | Pass — username/email login regression and DB role login passed on PR #27 |
| FR-02 | Reject incorrect credentials | TC-003, TC-004, TC-005 | Integration / negative | Not Run |
| FR-03 | Different access permissions by role | TC-001, TC-002, TC-006, TC-007 | Integration / role-based | Pass — admin/staff route boundaries and unauthenticated protections passed |
| FR-04 | Secure staff logout | TC-008 | Integration / security | Not Run |
| FR-05 | Authorized parcel registration | TC-009, TC-010 | System / positive, negative | Pass — parcel creation route persisted synthetic parcel in isolated MySQL |
| FR-06 | Sender/receiver data, contacts, and addresses | TC-009, TC-010, TC-011 | System / EP, BVA | Partial Pass — validator units and synthetic parcel route; manual form/browser checks pending |
| FR-07 | Record weight and delivery type | TC-009, TC-012, TC-014 | Unit, system / EP, BVA | Partial Pass — weight/delivery-type validator tests and DB parcel creation passed |
| FR-08 | Unique tracking number | TC-016, TC-017, UT-011 to UT-013 | Unit, database integration | Pass — PT-###### format and uniqueness verified with two persisted parcels |
| FR-09 | Reject missing or invalid parcel data | TC-010 to TC-014, UT-014 to UT-019 | Unit, system / negative, BVA, EP | Partial Pass — unit validation and registration workflow passed; full negative form matrix remains |
| FR-10 | Staff search by tracking number | TC-015 | System / positive | Not Run |
| FR-11 | Calculate charges from configured rules | TC-018 to TC-021, UT-001 to UT-005 | Unit, database integration | Pass — all three synthetic test tariffs and missing tariff rejection verified in isolated DB |
| FR-12 | Charge considers weight, distance, and type | TC-018, TC-019, UT-001, UT-002 | Unit / positive, BVA | Pass — each supported delivery type quote verified with controlled synthetic rates |
| FR-13 | Display quote before registration confirmation | TC-009, TC-018 | System / usability | Not Run |
| FR-14 | Reject zero or negative weight | TC-012, UT-003 | Unit, system / BVA, negative | Pass — invalid weight rejected by validator tests |
| FR-15 | Admin assigns parcel to delivery staff | TC-022, TC-023 | System / positive, negative | Pass — assignment to AVAILABLE Delivery Staff persisted |
| FR-16 | Display available staff for assignment | TC-024 | System / EP | Pass — AVAILABLE accepted; BUSY/OFF_DUTY/inactive/unknown and duplicate concurrent assignment rejected |
| FR-17 | Store assigned staff details with parcel | TC-022 | Database integration / integrity | Pass — assignment stored and parcel retrieved with staff assignment in DB workflow |
| FR-18 | Prevent dispatch of unassigned parcel | TC-025 | System / negative | Pass — dispatch before assignment rejected; parcel remained Booked |
| FR-19 | Authorized staff update parcel status | TC-026, TC-027 | System / role-based | Pass — Administrator/Delivery Staff role boundaries and status update workflow checked |
| FR-20 | Support defined parcel statuses | TC-026, TC-034 | Unit, system | Pass — normal delivery and return status workflow exercised |
| FR-21 | Timestamp each status update | TC-028 | Database integration / integrity | Pass — shipment history entries have timestamps in workflow assertions |
| FR-22 | Maintain shipment history | TC-017, TC-028, TC-037 | Database integration, system | Pass — initial and successive shipment history records persisted and retrieved |
| FR-23 | Prevent invalid status transitions | TC-026, TC-027, UT-006 to UT-010 | Unit, system / negative | Partial Pass — status-machine invalid transition unit checks; not all endpoint transition permutations tested |
| FR-24 | Delivery Staff record failed delivery | TC-029 | System / role-based | Pass — valid failed delivery recorded |
| FR-25 | Failure reason is mandatory | TC-029, TC-030 | System / positive, negative | Pass — whitespace failure reason rejected; valid failure reason accepted |
| FR-26 | Record delivery attempt count | TC-031, TC-032 | Database integration / BVA | Pass — three sequential attempts persisted with attempt numbers |
| FR-27 | Authorized staff initiate return | TC-032, TC-033 | System / positive, negative | Pass — return initiated through the authorized administrative workflow |
| FR-28 | Update parcel status during return | TC-033, TC-034, TC-035 | System / integrity | Pass — return completed using normal status endpoint; completed_at verified non-NULL |
| FR-29 | Provide public tracking page | TC-036 | Integration / positive | Pass — public tracking page and record lookup work without authentication |
| FR-30 | Customer searches by tracking number | TC-037, TC-038, TC-039 | Integration, system / EP | Pass — existing tracking number lookup returned public parcel details |
| FR-31 | Display current parcel status | TC-037 | System | Pass — public tracking result displayed current status in tested workflow |
| FR-32 | Display shipment status history | TC-028, TC-037 | System / integrity | Pass — public tracking rendered shipment history for saved parcel |
| FR-33 | Display invalid tracking message | TC-038, TC-039 | Integration / negative | Pass — malformed and unknown tracking numbers returned expected errors |
| FR-34 | Do not expose staff account information | TC-040 | System / security | Pass — public view omitted staff/account details in checked response |
| FR-35 | Do not expose unnecessary personal information | TC-040 | System / privacy | Pass — sender/receiver names, contacts, addresses and charge omitted from checked public response |

## 3. Non-Functional Requirements

| Requirement ID | Quality area | Test case IDs | Verification approach | Execution status |
|---|---|---|---|---|
| NFR-01 | Simple, understandable UI | TC-047 | Browser inspection / UAT | Not Run |
| NFR-02 | Clear validation errors | TC-003, TC-004, TC-010 to TC-014, TC-030, TC-038, TC-039, TC-047 | Functional / usability | Not Run |
| NFR-03 | Clear labels and instructions | TC-047 | Browser inspection / UAT | Not Run |
| NFR-04 | Public tracking without account | TC-036, TC-037 | Integration / system | Not Run |
| NFR-05 | 95% of normal requests within 2 seconds | TC-042 | Partial Pass — 20 sequential tracking requests measured p95 4.56 ms; representative load test not run | Not Run |
| NFR-06 | Acceptable tracking response time | TC-042 | Partial Pass — same limited tracking p95 baseline; agreed acceptance workload remains untested | Not Run |
| NFR-07 | Concurrent staff use | TC-043 | Partial Pass — two concurrent assignments to one staff member resulted in one success/one conflict; broad concurrent staff load not run | Not Run |
| NFR-08 | Accurate records; no incomplete saves | TC-009, TC-010, TC-012, TC-013, TC-017 | Partial Pass — valid parcel insert and persisted status/history verified; full interrupted-save scenarios not run | Not Run |
| NFR-09 | Preserve shipment history | TC-028 | Pass — status history retained and timestamped in database workflow | Not Run |
| NFR-10 | Appropriate database/service error | TC-044 | Not Run — database outage/error recovery not exercised | Not Run |
| NFR-11 | Prevent duplicate tracking numbers | TC-016 | Pass — unique tracking constraint and format verified for two records in test DB | Not Run |
| NFR-12 | Staff authentication required | TC-001 to TC-006 | Pass — login and unauthenticated route checks passed in CI | Not Run |
| NFR-13 | Role-based authorization | TC-006, TC-007, TC-041 | Pass — cross-role access checks passed in DB workflow | Not Run |
| NFR-14 | Secure password hashing | TC-045 | Pass — password hash differs from plaintext and bcrypt verification succeeds | Not Run |
| NFR-15 | Validate user inputs | TC-010 to TC-014, TC-021, TC-030, TC-038, TC-046 | Partial Pass — validator and malformed input checks passed; broader injection test TC-046 not run | Not Run |
| NFR-16 | Public tracking is read-only | TC-040, TC-041 | Pass — public tracking mutation was rejected and no parcel update occurred | Not Run |
| NFR-17 | Organized, understandable source code | Review of source layout and unit-testability | Code review | Not Run |
| NFR-18 | Separate frontend, backend, and database concerns | Architecture / repository review | Design review | Not Run |
| NFR-19 | Pricing can change without redesign | TC-018, TC-019; change a pricing row in isolated DB | Database integration / regression | Not Run; pricing rows are not seeded |
| NFR-20 | Modern browser compatibility | TC-047 | Cross-browser test | Not Run |
| NFR-21 | Desktop/laptop usability | TC-047 | Responsive/layout review | Not Run |
| NFR-22 | Unique tracking number | TC-016 | Pass — generated tracking numbers matched required format | Not Run |
| NFR-23 | Validate required information | TC-010 to TC-014 | Unit, system | Not Run |
| NFR-24 | Status update linked to correct parcel | TC-028, TC-035 | Pass — return completion timestamp and associated parcel status persisted | Not Run |

## 4. Business Rules

| Business Rule | Description | Test case IDs | Execution status |
|---|---|---|---|
| BR-01 | Unique tracking number | TC-016 | Pass — two generated identifiers were unique and format-correct |
| BR-02 | Mandatory parcel information | TC-010 | Not Run |
| BR-03 | Weight greater than zero | TC-012 | Pass — validator unit tests reject invalid weight |
| BR-04 | Approved pricing rules | TC-018 to TC-021 | Pass — three synthetic pricing classes and missing-rule rejection tested |
| BR-05 | Assign before dispatch | TC-022, TC-025 | Pass — pre-assignment dispatch attempt rejected |
| BR-06 | Delivered parcel cannot regress through ordinary updates | TC-027 | Not Run |
| BR-07 | Failed delivery requires a reason | TC-029, TC-030 | Pass — failure reason mandatory and attempts recorded; fourth rejected |
| BR-08 | Timestamped shipment history for each status change | TC-017, TC-028 | Pass — initial and successive shipment history timestamps verified |
| BR-09 | Only authorized staff can change parcel/status data | TC-006, TC-007, TC-041 | Pass — role boundaries and protected route behavior verified |
| BR-10 | Customers are read-only | TC-040, TC-041 | Pass — customer mutation blocked and public tracking data minimized |
| BR-11 | Return follows approved company procedure | TC-032 to TC-035 | Pass — return workflow and completion persistence verified |

## 5. Use-Case Coverage

| Use case | Description | Test case IDs |
|---|---|---|
| UC-01 | Log in | TC-001 to TC-008 |
| UC-02 | Register parcel | TC-009 to TC-017 |
| UC-03 | Calculate delivery charge | TC-018 to TC-021 |
| UC-04 | Assign delivery staff | TC-022 to TC-025 |
| UC-05 | Search parcel | TC-015 |
| UC-06 | View assigned parcels | TC-007, TC-024 |
| UC-07 | Update parcel status | TC-026 to TC-028 |
| UC-08 | Record failed delivery | TC-029 to TC-032 |
| UC-09 | Manage parcel return | TC-033 to TC-035 |
| UC-10 | Track parcel | TC-036 to TC-040 |
| UC-11 | View shipment history | TC-028, TC-037 |

## 6. Coverage Notes and Known Gaps

- FR-01, FR-16 and FR-28 source-level gaps were corrected on PR #27 and their regression / MySQL checks passed in CI run 46161259201. The changes are not yet merged to main.
- The repository seed does not insert company pricing tariffs. CI used synthetic values only in the isolated parcel_db_test database; these are not proposed as production prices.
- NFR-05/NFR-06 performance evidence remains partial: the CI run captured a 20-request sequential tracking p95 sample, not a full load test.
- NFR-07 evidence remains partial: concurrent assignment protection was tested, but broad concurrent staff usage has not been measured.
- NFR-10 database-outage recovery, TC-046 broader injection testing, and TC-047 browser/viewport review remain not run.

## 7. Status Legend

- **Not Run:** test is designed but no execution has been recorded.
- **Pass:** actual result satisfies expected result.
- **Fail:** actual result differs from expected result.
- **Blocked:** test cannot proceed because a prerequisite or environment dependency is missing.


---

## 8. Deliverable 6 — Automated Execution Overlay

The initial overlay below records the 27 November Windows baseline. The latest 28 November CI outcomes and requirement-by-requirement statuses are recorded in Section 10 and supersede any earlier Not Run status where updated.

| Requirement / rule | Automated evidence | Execution interpretation |
|---|---|---|
| FR-06 / FR-09 / NFR-15 / NFR-23 / BR-02 | UT-014 to UT-019 | Partially verified at validator unit level; form and database flows pending |
| FR-07 / FR-09 / FR-14 / BR-03 | UT-017 to UT-019 | Partially verified at validator unit level; full parcel registration pending |
| FR-11 / FR-12 / BR-04 | UT-001 to UT-005 | Charge-calculator unit behavior passed; pricing database and quote workflow pending |
| FR-16 | TC-024 and database assignment workflow | Pass on PR #27 CI; awaiting merge to main |
| FR-19 / FR-20 / FR-23 / BR-06 | UT-006 to UT-010 | Status-machine unit checks passed; controller permissions and persistence pending |
| FR-01 / NFR-12 / NFR-13 | IT-001, IT-004, IT-005 | Login page and unauthenticated redirect checks passed; successful credential login and cross-role checks pending |
| FR-29 / FR-30 | IT-002 | Public tracking page renders without login; real parcel lookup pending |
| FR-33 / NFR-15 | IT-003 | Malformed tracking-number request was rejected as expected |
| All other requirements | No matching automated execution evidence in this run | Remain Not Run / pending system or database testing |

The initial Windows baseline recorded 35.30% line coverage. The later CI run improved the measured line coverage to 45.64%; see Section 10. Automated CI checks do not substitute for human UAT or visual browser inspection.



---

## 9. Follow-up Regression Coverage

| Requirement | New test coverage | Current execution status |
|---|---|---|
| FR-01 — username or email login | `test/controllers/authController.test.js`; database-backed role login | Pass — CI run 46161259201; awaiting merge |
| FR-16 — available staff assignment | `test/unit/userRepository.test.js`, `test/unit/parcelRepository.assignment.test.js`; MySQL assignment workflow | Pass — CI run 46161259201; awaiting merge |
| FR-28 / NFR-24 — return completion timestamp | `test/unit/parcelRepository.return.test.js`; MySQL return workflow | Pass — CI run 46161259201; awaiting merge |

The new tests do not count as passed until the updated suite completes successfully. Database workflow evidence is reported separately from the original 31-test baseline.


## 10. CI Execution Reference

The above statuses are based on PR #27 CI run [46161259201](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/actions/runs/46161259201). The run passed 38 regular automated tests and 9 isolated MySQL workflow tests. These statuses apply to the PR branch; code fixes are not yet merged to `main`.

Requirements that depend on browser visual inspection, database outage, broad performance/load, all negative input permutations and the seven human UAT decisions remain Not Run or Partial Pass as indicated above.
