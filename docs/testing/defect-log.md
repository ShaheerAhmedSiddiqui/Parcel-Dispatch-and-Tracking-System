# ParcelTrack Defect Log

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 6 — Test Execution and Defect Report  
**Status:** Three source-level gaps confirmed; fixes and regression retests passed on PR #27 CI; merge to main is pending

## 1. Defects Found During This Automated Run

| Metric | Result |
|---|---:|
| Latest CI standard tests failed | 0 |
| Latest CI database workflow tests failed | 0 |
| Regression fixes verified on PR branch | 3 |

The three gaps below were confirmed by source inspection on `main`. Their corrections were exercised by targeted regression tests and the isolated MySQL workflow suite on PR #27. The automated CI run passed; however, the fixes remain on the PR branch until the PR is reviewed and merged.

## 2. Open Verification Candidates from Source Review

| Defect ID | Description | Severity | Priority | Status |
|---|---|---|---|---|
| DEF-001 | Username login was not wired although `findByUsername()` exists. | To assess with team | To assess with team | Regression passed on PR #27; awaiting merge |
| DEF-002 | Assignment listing and transaction did not enforce AVAILABLE status. | To assess with team | To assess with team | Regression passed on PR #27; awaiting merge |
| DEF-003 | Normal Returned to Sender updates bypassed `completeReturn()` and could leave `completed_at` NULL. | To assess with team | To assess with team | Regression passed on PR #27; awaiting merge |

These three gaps were confirmed by inspecting the current `main` source. Corrections and regression tests are included in [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27). CI regression and database workflow tests passed on the PR branch. The fixes are verified on that branch, but are not yet in `main` because PR #27 remains open.

### DEF-001 — Username login

- **Related requirement:** FR-01
- **Reproduction steps:** Prepare a controlled staff account with a username distinct from its email; open staff login; enter the username and valid password; submit.
- **Expected result:** Login accepts the username or email with a valid password.
- **Observed result:** Username and email login regression tests passed in CI; the MySQL-backed administrator and Delivery Staff login workflow also passed.
- **Evidence:** PR #27 CI run 46161259201; `test/controllers/authController.test.js` and database workflow.
- **Severity / priority:** To be assessed after reproduction.

### DEF-002 — Staff availability enforcement

- **Related requirement:** FR-16
- **Reproduction steps:** Prepare active staff profiles with AVAILABLE, BUSY, and OFF_DUTY values; open assignment options; attempt assignment to each profile.
- **Expected result:** Only staff that satisfy the approved availability rule are offered and assignable.
- **Observed result:** AVAILABLE assignment and BUSY/OFF_DUTY/inactive/unknown rejection passed in isolated MySQL tests. Concurrent assignment also confirmed that only one parcel can reserve the same AVAILABLE staff member.
- **Evidence:** PR #27 CI run 46161259201; repository regression tests and database workflow. Browser UI review remains pending.
- **Severity / priority:** To be assessed after reproduction.

### DEF-003 — Return completion timestamp

- **Related requirements:** FR-28, NFR-24
- **Reproduction steps:** Prepare a parcel with an initiated return; advance it through the permitted return workflow; complete the return; inspect the corresponding `parcel_returns.completed_at` value.
- **Expected result:** The completion timestamp is stored when the return reaches Returned to Sender.
- **Observed result:** Return initiation, progression, and the normal Returned to Sender status endpoint passed the database workflow; `parcel_returns.completed_at` was verified non-NULL.
- **Evidence:** PR #27 CI run 46161259201; `test/unit/parcelRepository.return.test.js` and MySQL-backed return workflow.
- **Severity / priority:** To be assessed after reproduction.

## 3. Environment and Test Dependencies (Not Product Defects)

| Item | Impact | Action |
|---|---|---|
| Current seed file does not insert `pricing_rules` rows (as noted during Deliverable 5 review) | Fresh-database quote and registration tests may not have required pricing data | Add approved test-only pricing rows to an isolated test database; do not invent production tariffs |
| Database-backed CI execution now exists | Core parcel workflows passed on isolated `parcel_db_test`; local XAMPP run is still useful for environment parity | Retain isolated test DB and run locally before final demonstration |
| Controller/repository coverage is low | Important request and persistence paths are not adequately exercised | Add targeted controller and repository tests |

## 4. Defect Lifecycle

For each candidate, update this log only after reproducing it. Record the confirmed actual result, assign severity and priority with the project team, link the GitHub defect issue or fix PR, and update status to Fixed only after a correction is committed. A defect is not Closed until the relevant retest and regression checks pass.


## 5. GitHub Defect Tracking

- DEF-001 — [Issue #22: username-based staff login](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/issues/22)
- DEF-002 — [Issue #23: staff availability enforcement](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/issues/23)
- DEF-003 — [Issue #24: return completion timestamp](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/issues/24)
- Proposed fixes and regression tests: [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27)

Severity and priority remain for team assessment. The regression fixes passed in PR #27 CI, but issues #22–#24 remain linked to the open PR and should not be closed before the PR is merged.
