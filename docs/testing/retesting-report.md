# ParcelTrack Retesting Report

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 6 — Test Execution and Defect Report  
**Status:** Three regression retests passed in PR #27 CI; main-branch merge and local environment verification are pending

## 1. Purpose

This report records verification performed after a defect correction. A passing initial test suite is not retesting; retesting requires a specific defect fix and a repeat execution of the failed scenario.

## 2. Retesting Summary

| Metric | Result |
|---|---:|
| Defect corrections in PR #27 | 3 |
| Defect-specific retests executed in CI | 3 |
| Retests passed | 3 |
| Retests failed | 0 |
| Pending merge/local parity verification | 3 fixes are not yet merged to `main` |

## 3. Retest Records

| Retest ID | Related defect | Fix commit / PR | Retest steps | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| RET-001 | DEF-001 — Username login | [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27) | Run authController regression tests and DB workflow with username/email | Both identifiers authenticate; role redirects work | Unit and DB workflow passed in CI run 46161259201 | Pass — PR branch; awaiting merge |
| RET-002 | DEF-002 — Staff availability enforcement | [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27) | Run repository regression tests and DB assignment workflow with AVAILABLE, BUSY, OFF_DUTY, inactive and concurrent assignments | Only AVAILABLE staff can be assigned; staff reservation is transactional | Regression tests and MySQL scenarios passed, including concurrent single-rider reservation | Pass — PR branch; awaiting merge |
| RET-003 | DEF-003 — Return completion timestamp | [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27) | Run repository regression test and DB return workflow; inspect `parcel_returns.completed_at` | Timestamp is persisted in the normal Returned to Sender flow | Unit regression and database return workflow passed; `completed_at` was non-NULL | Pass — PR branch; awaiting merge |

The three rows record fixes to the gaps confirmed by source inspection. Retesting proves the proposed PR-branch behavior under CI; it does not mean the fixes are already merged to `main`.

## 4. Regression Testing

The original Windows `npm test` run passed 31 tests before the fixes. It is a historical baseline. The later PR #27 CI run passed 38 regular tests and 9 isolated MySQL workflow tests. The three defect-specific regression records above are now Pass on the PR branch; repeat them after merge or against the final main commit before closing the defects.

## 5. Conclusion

All three fixes passed targeted regression coverage on PR #27. Keep the defect issues open until PR #27 is merged and the merged code is confirmed. Local Windows/XAMPP parity testing is still recommended before final project handover.


## 7. Current Retest Execution Link

The proposed regression tests and isolated database workflow suite are in [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27). CI run [46161259201](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/actions/runs/46161259201) completed successfully: 38 regular tests and 9 MySQL workflow tests passed. The retest records above are Pass on the PR branch, pending merge to `main`.
