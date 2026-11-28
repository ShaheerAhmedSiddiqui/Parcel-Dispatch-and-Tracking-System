# ParcelTrack Defect Log

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 6 — Test Execution and Defect Report  
**Status:** Three source-level gaps confirmed; code corrections and regression tests are proposed in PR #27; runtime retesting is pending

## 1. Defects Found During This Automated Run

| Metric | Result |
|---|---:|
| Automated tests failed | 0 |
| Runtime defects confirmed by this run | 0 |
| Fixes verified in this run | 0 |

No failing assertion or reproducible runtime defect was reported by the captured `npm test` execution. The following items are carried forward from the Deliverable 5 source review; they are not presented as defects reproduced by the current automated run.

## 2. Open Verification Candidates from Source Review

| Defect ID | Description | Severity | Priority | Status |
|---|---|---|---|---|
| DEF-001 | Username login was not wired although `findByUsername()` exists. | To assess with team | To assess with team | Fix proposed in PR #27; tests pending |
| DEF-002 | Assignment listing and transaction did not enforce AVAILABLE status. | To assess with team | To assess with team | Fix proposed in PR #27; tests pending |
| DEF-003 | Normal Returned to Sender updates bypassed `completeReturn()` and could leave `completed_at` NULL. | To assess with team | To assess with team | Fix proposed in PR #27; tests pending |

These three gaps were confirmed by inspecting the current `main` source. Corrections and regression tests are now included in [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27). They are not marked fixed or retested until CI/database execution passes and the PR is merged.

### DEF-001 — Username login

- **Related requirement:** FR-01
- **Reproduction steps:** Prepare a controlled staff account with a username distinct from its email; open staff login; enter the username and valid password; submit.
- **Expected result:** Login accepts the username or email with a valid password.
- **Observed result:** Not executed in this test cycle. Deliverable 5 source review noted email-only lookup.
- **Evidence required:** Login response and relevant controller/repository behavior.
- **Severity / priority:** To be assessed after reproduction.

### DEF-002 — Staff availability enforcement

- **Related requirement:** FR-16
- **Reproduction steps:** Prepare active staff profiles with AVAILABLE, BUSY, and OFF_DUTY values; open assignment options; attempt assignment to each profile.
- **Expected result:** Only staff that satisfy the approved availability rule are offered and assignable.
- **Observed result:** Not executed in this test cycle. Deliverable 5 source review noted that availability was not consistently filtered/enforced.
- **Evidence required:** Assignment UI/API result and persisted assignment state.
- **Severity / priority:** To be assessed after reproduction.

### DEF-003 — Return completion timestamp

- **Related requirements:** FR-28, NFR-24
- **Reproduction steps:** Prepare a parcel with an initiated return; advance it through the permitted return workflow; complete the return; inspect the corresponding `parcel_returns.completed_at` value.
- **Expected result:** The completion timestamp is stored when the return reaches Returned to Sender.
- **Observed result:** Not executed in this test cycle. Deliverable 5 source review noted that the repository completion method was not wired into the ordinary route/controller flow.
- **Evidence required:** Before/after database row and route response.
- **Severity / priority:** To be assessed after reproduction.

## 3. Environment and Test Dependencies (Not Product Defects)

| Item | Impact | Action |
|---|---|---|
| Current seed file does not insert `pricing_rules` rows (as noted during Deliverable 5 review) | Fresh-database quote and registration tests may not have required pricing data | Add approved test-only pricing rows to an isolated test database; do not invent production tariffs |
| No database-backed test execution is evidenced in the supplied run | Repository persistence and transaction behavior remain unverified | Configure a dedicated test database and safe reset procedure |
| Controller/repository coverage is low | Important request and persistence paths are not adequately exercised | Add targeted controller and repository tests |

## 4. Defect Lifecycle

For each candidate, update this log only after reproducing it. Record the confirmed actual result, assign severity and priority with the project team, link the GitHub defect issue or fix PR, and update status to Fixed only after a correction is committed. A defect is not Closed until the relevant retest and regression checks pass.


## 5. GitHub Defect Tracking

- DEF-001 — [Issue #22: username-based staff login](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/issues/22)
- DEF-002 — [Issue #23: staff availability enforcement](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/issues/23)
- DEF-003 — [Issue #24: return completion timestamp](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/issues/24)
- Proposed fixes and regression tests: [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27)

Severity and priority remain for team assessment. All three issues remain open pending CI execution, database verification, review, and merge.
