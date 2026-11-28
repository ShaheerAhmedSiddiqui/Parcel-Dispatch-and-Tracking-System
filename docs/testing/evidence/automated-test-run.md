# Automated Test Run Evidence

**Command:** `npm test`  
**Evidence date:** 27 November 2026 (based on the supplied screenshot filenames)  
**Environment visible in evidence:** Windows PowerShell, project directory on drive E:

## Recorded terminal result

- Test suites: **6 passed, 6 total**
- Tests: **31 passed, 31 total**
- Snapshots: **0 total**
- Time: **9.582 s**
- Statement coverage: **35.36%**
- Branch coverage: **20.90%**
- Function coverage: **28.35%**
- Line coverage: **35.30%**

## Screenshot evidence

Two terminal screenshots were supplied in the project conversation:

1. First screenshot: test suite PASS lines, overall totals, and first part of coverage summary.
2. Second screenshot: remaining coverage summary and final Jest totals.

The screenshots are not embedded in this repository commit. Before final submission, copy the two original PNG files into this folder, for example as:

- `automated-test-run-01.png`
- `automated-test-run-02.png`

Do not alter the recorded results. The exact Node.js/npm versions and tested commit SHA were not visible in the captured output.


## Updated regression and database test evidence

[PR #27](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/pull/27) adds regression tests for the three source-confirmed gaps and an isolated MySQL workflow suite. The CI job is configured to run `npm test` and `npm run test:db`.

These are new tests and are not part of the original screenshot evidence. Capture and record their actual CI/local results separately after completion. The original screenshots remain evidence only for the pre-fix baseline of 31 passing tests.


---

## 3. Updated PR #27 CI Evidence — 28 November 2026

**Workflow run:** [46161684598](https://github.com/ShaheerAhmedSiddiqui/Parcel-Dispatch-and-Tracking-System/actions/runs/46161684598)  
**Commit:** `558bff8f71635c3045bb52caf3bb63ab17f5f1a6`  
**Environment:** Ubuntu 26.04.1, Node.js 22.23.5, npm 10.9.9, MySQL 8.0.46

### Standard automated suite (`npm test`)

- 10 test suites passed, 1 database-only suite skipped by design.
- 38 tests passed, 0 failed.
- 9 database tests are executed by the separate `npm run test:db` command.
- Coverage: 45.66% statements, 29.41% branches, 38.23% functions, 45.64% lines.

### Isolated database suite (`npm run test:db`)

- 1 suite passed.
- 9 tests passed, 0 failed.
- Synthetic pricing rows and test accounts were created only in `parcel_db_test`.
- Tested role access, parcel quote/registration, tracking uniqueness, staff availability/assignment, delivery, failure attempts, returns, public privacy/read-only behavior, concurrent assignment, and a low-load tracking response-time sample.
- SYS-09 sample: 20 sequential tracking requests, p95 4.21 ms in this CI environment.

**Combined result:** 47 tests passed, 0 failed. This CI evidence is on PR #27 and does not mean the fixes are merged to `main`.

The original two Windows screenshots above remain evidence for the earlier 31-test local baseline. CI run evidence is linked above; no CI screenshot is represented as a local Windows test.
