# ParcelTrack Test Plan

**Document:** Test Plan  
**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Version:** 1.0  
**Status:** Prepared for test execution

## 1. Purpose

This Test Plan defines the approach for verifying ParcelTrack against its Software Requirements Specification (SRS) and the implementation currently present in the repository. It identifies testing scope, levels, techniques, environment, test data, responsibilities, execution controls, and completion criteria.

The plan is based on the Node.js, Express.js, EJS, MySQL application in the repository. It does not assume that every SRS requirement is already implemented or verified.

## 2. Testing Objectives

- Verify the implemented functionality of authentication, role access, parcel registration, charge calculation, staff assignment, shipment status, delivery attempts, returns, and public tracking.
- Check validation and permitted/forbidden workflows using positive and negative tests.
- Apply Boundary Value Analysis (BVA) and Equivalence Partitioning (EP) to inputs with known rules or limits.
- Test isolated business logic using Jest.
- Test HTTP routing, rendered pages, and middleware integration using Jest and Supertest.
- Define full-system and user acceptance scenarios.
- Maintain traceability from SRS requirements and business rules to test cases.
- Record actual outcomes and defects only after execution.

## 3. Scope

### 3.1 In Scope

- Staff authentication, session logout, and role-based route protection.
- Parcel field validation and tracking-number generation.
- Delivery-charge calculations based on configured pricing rows.
- Staff assignment and assignment constraints.
- Valid and invalid status transitions and shipment history.
- Failed-delivery reasons and attempt counting.
- Return initiation, return progression, and completion data.
- Public tracking format validation, result display, and privacy.
- Unit, HTTP integration, system, and user acceptance testing.
- Applicable non-functional checks for usability, reliability, security, compatibility, and performance.

### 3.2 Out of Scope

The current project excludes live GPS tracking and maps, online payments, real-time notifications, external courier APIs, and advanced route optimization. These features must not be included in test execution without formal scope approval.

## 4. Test Strategy

| Test level | Approach | Tools / evidence |
|---|---|---|
| Unit testing | Test independent calculations, status transitions, tracking-number generation, and validators | Jest |
| Integration testing | Exercise Express routes, middleware, sessions, and EJS rendering through HTTP requests | Jest, Supertest |
| Database integration | Verify repository queries, transactions, constraints, and persistence using an isolated test database | Jest, MySQL; execute only after an isolated test database is configured |
| System testing | Execute end-to-end application workflows across admin, delivery staff, and public tracking | Browser, MySQL, test data, execution record |
| User acceptance testing | Validate role-based business scenarios against acceptance criteria | UAT scenarios, reviewer sign-off |

Automated tests must use the repository's configured Jest command. Database-dependent tests must not run against a shared or production database. Use controlled test data and reset it safely between runs.

## 5. Test Design Techniques

- **Positive testing:** valid input and authorized actions should produce the expected result.
- **Negative testing:** missing, invalid, unsupported, or unauthorized operations should be rejected.
- **Boundary Value Analysis:** test values immediately below, at, and above known limits, including weight greater than zero, non-negative distance, contact length of 7–20 characters, database field widths, and the three-attempt implementation limit.
- **Equivalence Partitioning:** group inputs into valid and invalid classes and select representative values from each class.
- **Role-based testing:** verify Administrator, Delivery Staff, and public Customer access boundaries.

See BVA-analysis.md and Equavalance-partitioning.md for the detailed input analysis.

## 6. Test Environment

| Item | Planned / repository value |
|---|---|
| Runtime | Node.js |
| Application framework | Express.js |
| Views | EJS |
| Database | MySQL, database name parcel_db |
| Automated test runner | Jest |
| HTTP test client | Supertest |
| Application entry point | src/app.js for tests; src/server.js to start the server |
| Default application port | 3000, configurable through PORT |
| Database connection | DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME |
| Session configuration | express-session; SESSION_SECRET should be set in the local environment |

The current automated integration tests are designed to exercise routes that do not need database records. Repository and transaction tests require a separate, explicitly configured test database. Do not point destructive test setup at a developer's working database.

## 7. Test Data

Use synthetic data only. Do not use real sender/receiver names, contact numbers, addresses, passwords, cookies, or customer records.

Test data categories include:
- Active Administrator and Delivery Staff accounts from controlled seed data.
- An inactive staff account for negative authentication and assignment checks.
- Valid and invalid sender/receiver names, contacts, and addresses.
- Positive, zero, negative, and non-numeric weight and distance values.
- Each supported delivery type: STANDARD, EXPRESS, and SAME_DAY.
- Pricing rows with approved test-only values in an isolated database.
- Parcels in each valid status needed to test transition paths.
- Delivery-attempt counts from the permitted range through the rejection boundary.
- Valid-format, invalid-format, and unknown tracking numbers.

The current seed.sql file does not insert pricing_rules rows. Charge and parcel-registration integration tests remain blocked until approved test pricing rows are created in the isolated test database. Do not invent production tariffs.

## 8. Entry Criteria

Testing may begin when:
- The source branch under test is identified and dependencies are installed.
- The relevant application files and SRS version are available.
- A controlled test environment and synthetic test data are prepared.
- Database-dependent tests have a dedicated test database and safe reset procedure.
- Test cases have IDs, preconditions, inputs, and expected results.

## 9. Exit Criteria

A test cycle may be reported complete when:
- All planned tests for the cycle have an execution status.
- Passed, failed, blocked, and not-run cases are distinguished.
- Failed tests have reproducible evidence and linked defect records where needed.
- High-severity defects are resolved or explicitly accepted by the project team.
- Regression tests relevant to fixes have been rerun.
- The RTM reflects actual coverage and execution status.

A requirement is not considered verified merely because a test case has been written.

## 10. Execution and Defect Process

1. Select a test case and verify its preconditions.
2. Prepare the stated synthetic inputs.
3. Execute the steps in the documented order.
4. Record the observed behavior in Actual Result.
5. Set Status to Pass, Fail, Blocked, or Not Run.
6. For a failure, record the environment, steps, input, expected result, actual result, and evidence.
7. Create a separate GitHub defect issue for reproducible product defects and reference the test-case ID.
8. Retest the fix and perform relevant regression tests.

## 11. Roles and Responsibilities

| Role | Responsibility |
|---|---|
| Development | Support testability, investigate defects, implement fixes, and review technical test results |
| Testing / QA | Prepare test cases, execute tests, record evidence, maintain RTM, and report defects |
| Documentation | Maintain consistent deliverable documentation and traceability |
| Project team | Review acceptance criteria, resolve scope questions, and participate in UAT |

Project member responsibilities should follow the approved project proposal and current team agreement.

## 12. Risks and Limitations

| Risk / limitation | Impact | Mitigation |
|---|---|---|
| Pricing rules are absent from seed.sql | Quote and registration tests cannot complete on a fresh database | Add agreed test pricing rows in a dedicated test database |
| Login currently searches by email in the controller | The SRS username-or-email requirement is not fully represented by the implementation | Include username login as a gap test and raise/follow a defect |
| Staff availability is not used to filter all assignment choices | FR-16 availability behavior may fail | Test AVAILABLE, BUSY, and OFF_DUTY cases and record results |
| Return completion repository method is not wired into the normal controller/route flow | completed_at may remain NULL after a generic status update | Include an explicit completion-data test |
| Performance and concurrency targets need a defined test load | NFR-05 to NFR-07 cannot be claimed from functional tests | Define load, environment, sample size, and capture timings before execution |
| Default in-memory session store is used | Not suitable as production session infrastructure | Limit conclusions to academic/local test environment |

## 13. Reporting

Test-case execution details are maintained in test-scenarios-and-cases.md. Requirement coverage is maintained in requirements-traceability-matrix.md. System-level execution and UAT outcomes are recorded separately in system-testing-report.md and uat-report.md. BVA and EP design evidence is maintained in the two companion analysis documents.

All actual results in the initial deliverable remain **Not Run** until execution evidence is collected.
