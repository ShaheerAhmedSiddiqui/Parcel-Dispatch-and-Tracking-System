# ParcelTrack Equivalence Partitioning Analysis

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Technique:** Equivalence Partitioning (EP)  
**Status:** Test design prepared; execution pending

## 1. Purpose

Equivalence Partitioning divides input and workflow conditions into groups expected to behave similarly. One representative value from each class is selected to reduce redundant testing while retaining valid and invalid coverage.

The partitions below reflect the current validators, routes, repository logic, and database schema. A partition is not considered passed until its representative test is executed.

## 2. Input Equivalence Classes

| Input / feature | Valid equivalence class | Invalid equivalence class | Representative values / cases |
|---|---|---|---|
| Sender / receiver name | Non-empty string | Missing, empty, or whitespace-only value | Valid synthetic name; blank value — TC-009, TC-010 |
| Pickup / delivery address | Non-empty string | Missing, empty, or whitespace-only value | Valid synthetic address; blank value — TC-009, TC-010 |
| Contact number | String 7–20 characters using digits, plus, hyphen, spaces, or parentheses | Fewer than 7, more than 20, or unsupported characters | 7-digit contact; 20-character contact; 6/21-character or alphabetic value — TC-011 |
| Parcel weight | Finite numeric value greater than zero | Zero, negative, non-numeric, or non-finite value | 0.01; 0; -0.01; text value — TC-012 |
| Delivery distance | Finite numeric value greater than or equal to zero | Negative, non-numeric, or non-finite value | 0; 0.01; -0.01; text value — TC-013 |
| Delivery type | STANDARD, EXPRESS, SAME_DAY | Missing or unsupported string | Each supported type and an unknown type — TC-014, TC-019 |
| Pricing rule | Rule exists and all rates are finite, numeric, and non-negative | Missing rule or negative/non-finite rate | Controlled valid rule; missing rule; negative rate — TC-018 to TC-021 |
| Login credentials | Active staff account with correct email and password | Missing fields, incorrect password, inactive account, unsupported role | Active Admin, active Staff, wrong password, inactive account — TC-001 to TC-005 |
| Tracking number format | Exactly PT- followed by six digits | Wrong prefix, wrong digit count, letters in digits, blank | PT-000001; malformed representative values — TC-037 to TC-039 |
| Tracking record lookup | Well-formed tracking number exists | Well-formed tracking number does not exist | Existing and unknown PT-format values — TC-037, TC-039 |
| Parcel identifier | Positive integer | Zero, negative, fractional, non-numeric | 1; 0; -1; 1.5 — UT-011 to UT-013 |
| Status transition | Transition is listed in statusMachine.js | Transition is not listed, unknown status, or transition from terminal status | Booked→Assigned; Booked→Delivered; Delivered→Booked — TC-026, TC-027, UT-006 to UT-010 |
| Staff assignment | Active Delivery Staff record in an assignable condition | Unknown, inactive, wrong-role, or unavailable staff | Active/available and inactive/other-availability samples — TC-022 to TC-024 |
| Failed-delivery reason | Non-empty string after trimming | Empty or whitespace-only value | “Recipient unavailable”; empty string; spaces — TC-029, TC-030 |
| Delivery attempt count | New attempt count does not exceed 3 | A new attempt would increase count above 3 | Current count 2 then attempt 3; current count 3 then attempt 4 — TC-031, TC-032 |
| Return request | Eligible Delivery Failed parcel and non-empty reason | Unsupported current status or empty reason | Eligible parcel with reason; wrong status/blank reason — TC-033 |
| Public tracking access | GET request without login | Attempt to use staff/admin mutation path as public visitor | GET /track; POST protected path — TC-036, TC-041 |

## 3. Representative Test Selection

| Test case ID | Partition selected | Reason for selection |
|---|---|---|
| TC-009 | Valid complete parcel | Represents valid registration inputs |
| TC-010 | Missing required field | Represents incomplete parcel data |
| TC-011 | Contact valid/invalid character and length classes | Covers both format and length partitions |
| TC-012 | Positive, zero, negative, non-numeric weight | Covers valid and invalid numeric classes |
| TC-013 | Zero, positive, negative, non-numeric distance | Covers accepted non-negative and rejected distance classes |
| TC-014 | Supported and unsupported delivery types | Covers all current enum classes and invalid class |
| TC-018 to TC-021 | Existing, missing, and invalid pricing rules | Covers charge calculator configuration partitions |
| TC-001 to TC-005 | Active, invalid-credential, and inactive user classes | Covers authentication result classes |
| TC-022 to TC-024 | Active and availability-state staff classes | Covers assignment candidates and known availability behavior |
| TC-026 to TC-027 | Permitted and forbidden state transitions | Covers status-machine partitions |
| TC-029 to TC-032 | Valid/empty reason and attempt-count partitions | Covers failure recording rules |
| TC-033 to TC-035 | Eligible/ineligible returns and completion | Covers return lifecycle classes |
| TC-037 to TC-040 | Valid-format existing, valid-format unknown, malformed tracking | Covers format, lookup, and privacy classes |

## 4. Important Implementation Notes

- The current application accepts three delivery types: STANDARD, EXPRESS, and SAME_DAY.
- The current contact validator accepts only 7–20 characters and the character set specified by its regular expression.
- The current tracking controller validates the exact pattern PT- followed by six digits before querying the database.
- The current login controller uses email lookup only. The SRS requirement that login accept username or email is not fully implemented.
- The staff repository currently returns active staff without filtering availability, and the assignment repository does not reject BUSY or OFF_DUTY availability values. Keep these as explicit negative/role test cases.
- Pricing tests require pricing_rules rows; current seed.sql does not create them.
- Status transitions must follow the table in src/services/statusMachine.js. Do not treat every status as directly reachable from every other status.

## 5. Execution Record

The representative tests are initially **Not Run**. After execution, enter actual results and status in test-scenarios-and-cases.md. Link reproducible failures to defect issues.
