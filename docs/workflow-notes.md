# Development Workflow Notes

## Purpose
This document records a repeatable GitHub and Software Quality Engineering workflow for the Parcel Dispatch and Tracking System. It supports the course requirements for collaborative source control, issue tracking, reviews, testing, and quality evidence.

## Repository and branch policy
- Keep main as the stable release/integration branch.
- Use backend as the current backend integration branch.
- Create a short-lived task branch from the latest agreed base; backend tasks branch from backend.
- Use descriptive names: feature/<name>, fix/<name>, test/<name>, docs/<name>.
- Do not commit directly to main, force-push, or overwrite another member's work.
- Keep each PR focused and reasonably small.

## Issue-first workflow
1. Create an Issue before starting a non-trivial feature, defect fix, or quality task.
2. Use the Bug report template for defects and Feature or requirement proposal for feature work.
3. Link the issue to the relevant SRS requirement, use case, business rule, or acceptance criterion.
4. During triage, agree on assignee, priority, and (for defects) severity.
5. Keep discussion updated with reproduction details, decisions, and evidence.

Suggested labels (create them in GitHub if absent):
- Type: bug, enhancement, documentation, testing
- Workflow: needs-triage, in-progress, blocked
- Priority: priority:P0, priority:P1, priority:P2, priority:P3
- Severity: severity:critical, severity:high, severity:medium, severity:low

## Commit conventions
Use Conventional Commit-style messages:
- feat: add parcel registration service
- fix: reject dispatch for unassigned parcels
- test: cover invalid parcel weights
- docs: document MVC repository structure
- refactor: isolate parcel SQL queries

Each commit should represent one logical change. Avoid vague messages such as update or final work.

## Pull request workflow
1. Update your task branch from the agreed base.
2. Implement the change and write/update tests.
3. Run relevant tests locally and record exact commands and results.
4. Open a PR using .github/pull_request_template.md.
5. Reference the issue using Closes #<number> when the PR completes it.
6. Request review from another team member; authors should not approve their own PRs.
7. Address review feedback and push follow-up commits.
8. Merge only after required review and checks pass.
9. Update related issues, documentation, RTM, and evidence.

## MVC and backend layering convention
Request flow:

Browser / EJS views
       |
       v
Routes -> Middleware -> Controllers
                           |
                           v
                        Services
                           |
                           v
                      Repositories
                           |
                           v
                         MySQL

- Models represent persisted/domain entities and their relationships.
- Views are EJS templates and reusable partials; presentation only.
- Controllers translate HTTP input to service calls and select render/redirect/JSON responses.
- Routes map URL + HTTP method and attach authentication/role middleware.
- Services own business rules and workflows (charge calculation, tracking numbers, assignments, state transitions, delivery attempts and returns).
- Repositories own SQL and database transactions.
- Middleware handles authentication, authorization, validation, and errors.
- Config contains environment configuration, database pool, and configurable business parameters.

Do not put SQL in controllers or business rules in EJS templates. Services should not depend on Express request/response objects.

## Roles and access
Keep SRS terminology:
- Administrator / Courier Clerk: authenticated staff; register parcels, calculate charges, assign staff, search and manage parcels/returns as authorized.
- Delivery Staff: authenticated staff; view assigned parcels and update permitted delivery information.
- Customer: public tracking by tracking number; no customer login is required.

Customer tracking is read-only and must not expose private staff account information or unnecessary personal data.

## SRS workflow and integrity controls
SRS FR-20 defines these parcel statuses:
- Booked
- Assigned
- Dispatched
- Out for Delivery
- Delivered
- Delivery Failed
- Return Initiated
- Return in Transit
- Returned to Sender

Implement and test status transitions against the SRS and approved operational policy. Key constraints:
- A parcel cannot be dispatched before assignment (FR-18 / BR-05).
- Invalid status transitions must be rejected (FR-23).
- A failed delivery attempt needs a reason and the attempt count is recorded (FR-24 to FR-26).
- Every status change is recorded in timestamped shipment history (FR-21 / FR-22 / BR-08).
- An ordinary update cannot move a Delivered parcel back to an earlier delivery state (BR-06).
- Tracking numbers are unique (FR-08 / BR-01 / NFR-11 / NFR-22).

Known discrepancy to reconcile: the existing docs/BACKEND.md draft describes a shortened status flow and includes CANCELLED, which is not among the nine statuses in SRS FR-20. Treat the SRS as authoritative unless the team formally revises and versions it.

## Test and quality workflow
- Derive tests from requirements and acceptance criteria; maintain the Requirements Traceability Matrix.
- Apply Equivalence Partitioning and Boundary Value Analysis to suitable inputs such as weight, distance, tracking number, and failed-delivery reason.
- Write unit tests using Arrange–Act–Assert.
- Use Jest for unit tests and Supertest for HTTP/integration tests; fixtures/mocks should make tests reproducible.
- Apply TDD where appropriate: Red (failing test), Green (minimum implementation), Refactor (improve design while keeping tests green).
- Perform code reviews and regression tests after fixes.
- QA records actual test results, defect states, and metrics. Never invent pass rates, coverage, or performance figures.

## Team responsibilities
- Shaheer Ahmed Siddiqui — Development: backend functionality, routes, business logic, database integration, and frontend integration.
- Lakesh Kumar — Testing and Evaluation (QA): test planning/cases, test execution, defect tracking, regression testing, and quality metrics.
- Safeer Ahmed Mirani — Documentation: proposal, SRS, design, QA/testing documentation, final report, and presentation materials.

All members participate in requirements discussions, reviews, GitHub collaboration, defect resolution, and demonstration.

## Evidence to preserve
Keep relevant Issue/PR links, meaningful commit history, actual test commands/output with execution environment, sanitized screenshots/logs, defect correction/retest evidence, updated RTM, and quality metrics calculated from collected project data.
