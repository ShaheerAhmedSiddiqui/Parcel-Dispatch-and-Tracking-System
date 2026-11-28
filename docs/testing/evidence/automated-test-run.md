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
