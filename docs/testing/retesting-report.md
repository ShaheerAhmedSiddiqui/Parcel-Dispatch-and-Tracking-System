# ParcelTrack Retesting Report

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 6 — Test Execution and Defect Report  
**Status:** Fixes proposed in PR #27; defect-specific execution and retesting are still pending

## 1. Purpose

This report records verification performed after a defect correction. A passing initial test suite is not retesting; retesting requires a specific defect fix and a repeat execution of the failed scenario.

## 2. Retesting Summary

| Metric | Result |
|---|---:|
| Defect corrections proposed in PR #27 | 3 |
| Defect-specific retests executed | 0 |
| Retests passed | 0 |
| Retests failed | 0 |
| Pending retests | 3; CI and local database evidence required |

## 3. Retest Records

| Retest ID | Related defect | Fix commit / PR | Retest steps | Expected result | Actual result | Status |
|---|---|---|---|---|---|---|
| RET-001 | DEF-001 — Username login | [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27) | Run authController regression tests and DB login workflow using username/email | Both identifiers authenticate; invalid credentials remain rejected | Not Run | Pending CI |
| RET-002 | DEF-002 — Staff availability enforcement | [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27) | Run repository regression tests and DB assignment workflow with AVAILABLE, BUSY, and OFF_DUTY profiles | Only AVAILABLE staff can be assigned; assignment reserves them as BUSY | Not Run | Pending CI |
| RET-003 | DEF-003 — Return completion timestamp | [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27) | Run repository regression test and DB return workflow; inspect `parcel_returns.completed_at` | Timestamp is persisted in the normal Returned to Sender flow | Not Run | Pending CI |

The three rows are pending verification candidates from Deliverable 5 source review, not confirmed failures from the current automated run.

## 4. Regression Testing

The captured `npm test` run passed 31 tests before the fixes in PR #27. It is a historical baseline, not a defect-specific retest. PR #27 adds dedicated regression tests and an isolated MySQL workflow suite. Their results must be recorded from the active CI run and, where needed, repeated in the project's local MySQL environment before changing any RET status.

## 5. Conclusion

No defect fix or defect-specific retest was evidenced in this cycle. Do not mark DEF-001, DEF-002, or DEF-003 as fixed or closed until the behavior is reproduced, corrected, and retested successfully.


## 7. Current Retest Execution Link

The proposed regression tests and isolated database workflow suite are in [PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27). The PR's GitHub Actions job is configured to run `npm test` and `npm run test:db`. Until that run completes successfully, the three retest records above remain Not Run/Pending.
