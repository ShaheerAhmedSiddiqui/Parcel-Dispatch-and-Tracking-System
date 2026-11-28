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
