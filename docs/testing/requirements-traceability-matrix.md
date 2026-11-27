# ParcelTrack Requirements-to-Test Traceability Matrix

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Status:** Prepared; execution has not yet been recorded

## 1. Purpose

This matrix links SRS requirements and business rules to test cases. A mapping indicates planned test coverage, not proof that the requirement has passed. Test status remains Not Run until execution evidence is recorded.

## 2. Functional Requirements

| Requirement ID | Requirement area | Test case IDs | Testing level / technique | Execution status |
|---|---|---|---|---|
| FR-01 | Staff login using username or email and password | TC-001, TC-002; username gap check | Integration / positive, negative | Not Run; username support is an implementation gap |
| FR-02 | Reject incorrect credentials | TC-003, TC-004, TC-005 | Integration / negative | Not Run |
| FR-03 | Different access permissions by role | TC-001, TC-002, TC-006, TC-007 | Integration / role-based | Not Run |
| FR-04 | Secure staff logout | TC-008 | Integration / security | Not Run |
| FR-05 | Authorized parcel registration | TC-009, TC-010 | System / positive, negative | Not Run |
| FR-06 | Sender/receiver data, contacts, and addresses | TC-009, TC-010, TC-011 | System / EP, BVA | Not Run |
| FR-07 | Record weight and delivery type | TC-009, TC-012, TC-014 | Unit, system / EP, BVA | Not Run |
| FR-08 | Unique tracking number | TC-016, TC-017, UT-011 to UT-013 | Unit, database integration | Not Run |
| FR-09 | Reject missing or invalid parcel data | TC-010 to TC-014, UT-014 to UT-019 | Unit, system / negative, BVA, EP | Not Run |
| FR-10 | Staff search by tracking number | TC-015 | System / positive | Not Run |
| FR-11 | Calculate charges from configured rules | TC-018 to TC-021, UT-001 to UT-005 | Unit, database integration | Not Run; pricing seed rows absent |
| FR-12 | Charge considers weight, distance, and type | TC-018, TC-019, UT-001, UT-002 | Unit / positive, BVA | Not Run |
| FR-13 | Display quote before registration confirmation | TC-009, TC-018 | System / usability | Not Run |
| FR-14 | Reject zero or negative weight | TC-012, UT-003 | Unit, system / BVA, negative | Not Run |
| FR-15 | Admin assigns parcel to delivery staff | TC-022, TC-023 | System / positive, negative | Not Run |
| FR-16 | Display available staff for assignment | TC-024 | System / EP | Not Run; availability filtering is a known implementation gap |
| FR-17 | Store assigned staff details with parcel | TC-022 | Database integration / integrity | Not Run |
| FR-18 | Prevent dispatch of unassigned parcel | TC-025 | System / negative | Not Run |
| FR-19 | Authorized staff update parcel status | TC-026, TC-027 | System / role-based | Not Run |
| FR-20 | Support defined parcel statuses | TC-026, TC-034 | Unit, system | Not Run |
| FR-21 | Timestamp each status update | TC-028 | Database integration / integrity | Not Run |
| FR-22 | Maintain shipment history | TC-017, TC-028, TC-037 | Database integration, system | Not Run |
| FR-23 | Prevent invalid status transitions | TC-026, TC-027, UT-006 to UT-010 | Unit, system / negative | Not Run |
| FR-24 | Delivery Staff record failed delivery | TC-029 | System / role-based | Not Run |
| FR-25 | Failure reason is mandatory | TC-029, TC-030 | System / positive, negative | Not Run |
| FR-26 | Record delivery attempt count | TC-031, TC-032 | Database integration / BVA | Not Run |
| FR-27 | Authorized staff initiate return | TC-032, TC-033 | System / positive, negative | Not Run |
| FR-28 | Update parcel status during return | TC-033, TC-034, TC-035 | System / integrity | Not Run |
| FR-29 | Provide public tracking page | TC-036 | Integration / positive | Not Run |
| FR-30 | Customer searches by tracking number | TC-037, TC-038, TC-039 | Integration, system / EP | Not Run |
| FR-31 | Display current parcel status | TC-037 | System | Not Run |
| FR-32 | Display shipment status history | TC-028, TC-037 | System / integrity | Not Run |
| FR-33 | Display invalid tracking message | TC-038, TC-039 | Integration / negative | Not Run |
| FR-34 | Do not expose staff account information | TC-040 | System / security | Not Run |
| FR-35 | Do not expose unnecessary personal information | TC-040 | System / privacy | Not Run |

## 3. Non-Functional Requirements

| Requirement ID | Quality area | Test case IDs | Verification approach | Execution status |
|---|---|---|---|---|
| NFR-01 | Simple, understandable UI | TC-047 | Browser inspection / UAT | Not Run |
| NFR-02 | Clear validation errors | TC-003, TC-004, TC-010 to TC-014, TC-030, TC-038, TC-039, TC-047 | Functional / usability | Not Run |
| NFR-03 | Clear labels and instructions | TC-047 | Browser inspection / UAT | Not Run |
| NFR-04 | Public tracking without account | TC-036, TC-037 | Integration / system | Not Run |
| NFR-05 | 95% of normal requests within 2 seconds | TC-042 | Defined performance test and timing analysis | Not Run |
| NFR-06 | Acceptable tracking response time | TC-042 | Performance test under agreed load | Not Run |
| NFR-07 | Concurrent staff use | TC-043 | Concurrency test | Not Run |
| NFR-08 | Accurate records; no incomplete saves | TC-009, TC-010, TC-012, TC-013, TC-017 | System / database integration | Not Run |
| NFR-09 | Preserve shipment history | TC-028 | Database integration | Not Run |
| NFR-10 | Appropriate database/service error | TC-044 | Reliability / negative | Not Run |
| NFR-11 | Prevent duplicate tracking numbers | TC-016 | Database integration / uniqueness | Not Run |
| NFR-12 | Staff authentication required | TC-001 to TC-006 | Integration / security | Not Run |
| NFR-13 | Role-based authorization | TC-006, TC-007, TC-041 | Integration / role-based | Not Run |
| NFR-14 | Secure password hashing | TC-045 | Security / database inspection | Not Run |
| NFR-15 | Validate user inputs | TC-010 to TC-014, TC-021, TC-030, TC-038, TC-046 | Unit, integration / BVA, EP | Not Run |
| NFR-16 | Public tracking is read-only | TC-040, TC-041 | Security / role-based | Not Run |
| NFR-17 | Organized, understandable source code | Review of source layout and unit-testability | Code review | Not Run |
| NFR-18 | Separate frontend, backend, and database concerns | Architecture / repository review | Design review | Not Run |
| NFR-19 | Pricing can change without redesign | TC-018, TC-019; change a pricing row in isolated DB | Database integration / regression | Not Run; pricing rows are not seeded |
| NFR-20 | Modern browser compatibility | TC-047 | Cross-browser test | Not Run |
| NFR-21 | Desktop/laptop usability | TC-047 | Responsive/layout review | Not Run |
| NFR-22 | Unique tracking number | TC-016 | Database integration | Not Run |
| NFR-23 | Validate required information | TC-010 to TC-014 | Unit, system | Not Run |
| NFR-24 | Status update linked to correct parcel | TC-028, TC-035 | Database integration / integrity | Not Run |

## 4. Business Rules

| Business Rule | Description | Test case IDs | Execution status |
|---|---|---|---|
| BR-01 | Unique tracking number | TC-016 | Not Run |
| BR-02 | Mandatory parcel information | TC-010 | Not Run |
| BR-03 | Weight greater than zero | TC-012 | Not Run |
| BR-04 | Approved pricing rules | TC-018 to TC-021 | Not Run |
| BR-05 | Assign before dispatch | TC-022, TC-025 | Not Run |
| BR-06 | Delivered parcel cannot regress through ordinary updates | TC-027 | Not Run |
| BR-07 | Failed delivery requires a reason | TC-029, TC-030 | Not Run |
| BR-08 | Timestamped shipment history for each status change | TC-017, TC-028 | Not Run |
| BR-09 | Only authorized staff can change parcel/status data | TC-006, TC-007, TC-041 | Not Run |
| BR-10 | Customers are read-only | TC-040, TC-041 | Not Run |
| BR-11 | Return follows approved company procedure | TC-032 to TC-035 | Not Run |

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

- FR-01 states username or email login. The inspected controller currently calls findByEmail only. Username login needs a test and a tracked implementation correction.
- FR-16 expects available delivery staff. The inspected staff query and assignment repository do not enforce availability values. TC-024 is specifically intended to expose this gap.
- Pricing test cases require rows in pricing_rules. The current seed.sql does not insert them; use approved test-only rates in an isolated test database.
- Return completion must set parcel_returns.completed_at. The repository has a completeReturn function, but the inspected route/controller path does not call it. TC-035 should verify this database field.
- NFR-05 to NFR-07 require an agreed workload and performance/concurrency evidence. Unit and smoke tests do not demonstrate these targets.
- TC-047 needs actual browser/viewport execution evidence.

## 7. Status Legend

- **Not Run:** test is designed but no execution has been recorded.
- **Pass:** actual result satisfies expected result.
- **Fail:** actual result differs from expected result.
- **Blocked:** test cannot proceed because a prerequisite or environment dependency is missing.
