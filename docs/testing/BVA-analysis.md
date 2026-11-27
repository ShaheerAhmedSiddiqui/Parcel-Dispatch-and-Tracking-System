# ParcelTrack Boundary Value Analysis (BVA)

**Project:** Parcel Dispatch and Tracking System (ParcelTrack)  
**Deliverable:** 5 — Test Plan and Test Cases  
**Technique:** Boundary Value Analysis  
**Status:** Test design prepared; execution pending

## 1. Purpose

Boundary Value Analysis selects test values at, immediately below, and immediately above known input limits. The boundaries below are taken from the current service validation, repository logic, and MySQL schema. Where the application has no explicit upper bound, this document does not invent one.

## 2. Identified Boundaries

| Input / rule | Boundary source | Lower / permitted boundary | Upper / permitted boundary | Notes |
|---|---|---|---|---|
| Parcel weight | chargeCalculator.js, validators.js, schema.sql | Greater than 0 | Database column DECIMAL(8,2) | Application validator has no configured maximum; DECIMAL(8,2) storage has a maximum of 999999.99 |
| Delivery distance | chargeCalculator.js, validators.js, schema.sql | 0 or greater | Database column DECIMAL(8,2) | Application validator has no configured maximum; DECIMAL(8,2) storage has a maximum of 999999.99 |
| Contact number | validators.js regular expression | 7 characters | 20 characters | Only digits, plus, hyphen, whitespace, and parentheses are allowed |
| Sender / receiver name | schema.sql VARCHAR(100); required-field validator | Non-empty string | 100 characters at database column | Application service checks non-empty but does not explicitly enforce 100 characters |
| Pickup / delivery address | schema.sql VARCHAR(255); required-field validator | Non-empty string | 255 characters at database column | Application service checks non-empty but does not explicitly enforce 255 characters |
| Failed delivery attempts | parcelRepository.js constant MAX_DELIVERY_ATTEMPTS = 3 | 0 recorded attempts | 3 recorded attempts | A fourth failed attempt is rejected by the current repository implementation |
| Tracking number | trackingController.js regular expression | Exact format PT- plus six digits | Exact format PT- plus six digits | No variable-length range; test exact valid format and lengths outside the pattern |
| Parcel ID for tracking generation | trackingNumber.js | Positive integer greater than 0 | No explicit upper bound in generator | Generated format pads to at least six digits; generator does not enforce a six-digit maximum |

## 3. Boundary Test Values

| Test case ID | Field / rule | Values to test | Expected result |
|---|---|---|---|
| TC-012 | Weight > 0 | -0.01, 0, 0.01 | -0.01 and 0 rejected; 0.01 accepted by application validation |
| TC-012 | Weight database precision | 999999.99, 1000000.00 | 999999.99 is within DECIMAL(8,2); 1000000.00 exceeds that column's representable range |
| TC-013 | Distance >= 0 | -0.01, 0, 0.01 | -0.01 rejected; 0 and 0.01 accepted by application validation |
| TC-013 | Distance database precision | 999999.99, 1000000.00 | 999999.99 is within DECIMAL(8,2); 1000000.00 exceeds that column's representable range |
| TC-011 | Contact length | 6, 7, 20, 21 characters | 6 and 21 rejected; 7 and 20 accepted if all characters are allowed |
| TC-010 / TC-011 | Required name/address | Empty, one character, schema maximum, one over schema maximum | Empty rejected; one character accepted; storage boundary requires database test |
| TC-032 | Delivery attempts | Current count 2, current count 3, next attempted count 4 | Third attempt may be recorded; fourth attempt is rejected |
| TC-038 | Tracking format length | PT- plus 5 digits; PT- plus 6 digits; PT- plus 7 digits | Only exact six-digit format passes format validation |
| UT-011 to UT-013 | Parcel ID | -1, 0, 1, 999999, 1000000, 1.5, non-numeric | Only positive integer values are accepted; generator pads to six digits but may output more than six digits for IDs above 999999 |

## 4. Interpretation and Limitations

- Do not infer a business maximum for parcel weight or delivery distance; none is configured in the inspected application validation.
- DECIMAL(8,2) represents values up to 999999.99. Database behavior for out-of-range values depends on MySQL SQL mode and must be verified in the isolated test environment.
- Contact length is explicitly limited by the application regex to 7–20 characters.
- Names and addresses are required by the application validator and have schema storage widths, but application-level maximum-length validation is not explicitly implemented.
- The maximum of three delivery attempts is hard-coded in the repository, not sourced from a configurable policy setting. The test documents current behavior, not an independently approved courier policy.
- Tracking search uses an exact six-digit pattern. The tracking-number generator pads to six digits but does not itself reject parcel IDs greater than 999999; this edge should be tested and reviewed.

## 5. Execution Record

All BVA tests are **Not Run** until executed. Record actual values, observed results, and defects in test-scenarios-and-cases.md and link any failures to GitHub issues.
