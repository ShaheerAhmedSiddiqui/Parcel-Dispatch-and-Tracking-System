# ParcelTrack System Testing Report

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Report status:** Prepared template — execution pending

## 1. Objective

Record the results of testing complete ParcelTrack workflows from the perspective of the Administrator / Courier Clerk, Delivery Staff, and public Customer.

## 2. Environment Record

| Field | Execution detail |
|---|---|
| Branch / commit under test | To be recorded |
| Test date | To be recorded |
| Tester | To be recorded |
| Operating system | To be recorded |
| Browser and version | To be recorded |
| Node.js version | To be recorded |
| MySQL version / database | To be recorded |
| Test data source | Synthetic test data only |
| Application configuration | Local test configuration; secrets must not be recorded |

## 3. System Test Scenarios

| Scenario ID | Workflow | Related test cases | Expected outcome | Actual result | Status |
|---|---|---|---|---|---|
| SYS-01 | Staff login and role-based landing page | TC-001, TC-002, TC-006, TC-007 | Each active role reaches its permitted area; unauthorized access is blocked | Not Run | Not Run |
| SYS-02 | Register parcel and produce tracking number | TC-009 to TC-017 | Valid parcel is saved with unique tracking number, Booked status, and initial history | Not Run | Not Run |
| SYS-03 | Quote delivery charge | TC-018 to TC-021 | Configured pricing rule produces the expected charge; invalid/missing configuration is rejected | Not Run | Not Run |
| SYS-04 | Assign delivery staff and dispatch | TC-022 to TC-025 | Eligible staff assignment is saved; unassigned dispatch is rejected | Not Run | Not Run |
| SYS-05 | Complete normal delivery workflow | TC-026 to TC-028 | Permitted status progression and timestamped history are preserved | Not Run | Not Run |
| SYS-06 | Record failed delivery and attempts | TC-029 to TC-032 | Failure reason is required; count is maintained; attempt limit is enforced | Not Run | Not Run |
| SYS-07 | Initiate and complete a return | TC-033 to TC-035 | Return progression is valid and completed_at is stored upon completion | Not Run | Not Run |
| SYS-08 | Customer tracking and privacy | TC-036 to TC-041 | Public tracking works without login and exposes only permitted information | Not Run | Not Run |
| SYS-09 | Error and non-functional behavior | TC-042 to TC-047 | Performance, concurrency, database errors, password storage, input safety, and browser usability are evaluated | Not Run | Not Run |

## 4. Execution Summary

| Metric | Count |
|---|---:|
| System scenarios planned | 9 |
| Passed | 0 |
| Failed | 0 |
| Blocked | 0 |
| Not Run | 9 |

These counts describe the initial, unexecuted report template. Update them after execution; do not present them as test results.

## 5. Known Test Dependencies / Risks

- The current seed.sql does not insert pricing rows. Configure approved test-only rules in a separate test database before running parcel quote/registration workflows.
- The current login controller authenticates using email only, although FR-01 describes username or email.
- Staff availability values are not currently used consistently in staff listing and assignment.
- Return completion must be checked at the database level because the inspected route/controller does not invoke the repository completeReturn method.
- Performance and concurrency targets require an agreed test workload, environment, and measurement evidence.

## 6. Defect and Evidence Log

| Defect ID | Related test case | Summary | Severity | Evidence / link | State |
|---|---|---|---|---|---|
| To be assigned | TC-024 | Availability filtering / assignment behavior needs verification | To be assessed | To be added after execution | Open / Pending |
| To be assigned | TC-035 | Return completion timestamp needs verification | To be assessed | To be added after execution | Open / Pending |
| To be assigned | FR-01 / TC-001 | Username login requirement is not supported by the inspected login controller | To be assessed | Source review; confirm with test | Open / Pending |
| To be assigned | TC-020 | Fresh seed does not include pricing rules | Test environment dependency | database/seed.sql | Pending |

Create or link GitHub defect issues only after confirming the observed failure through reproducible execution, except where a source-level implementation gap is explicitly being tracked separately.

## 7. Conclusion

System testing has been planned but not executed in this report. Update this section after the complete workflows are run in a controlled environment, and attach test evidence and defect references.


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

