## Summary
Describe what this pull request changes and why.

## Related issue
Closes #

## Change type
- [ ] Feature
- [ ] Bug fix
- [ ] Refactoring
- [ ] Documentation
- [ ] Test / quality improvement
- [ ] Repository configuration

## Requirements and design
- SRS requirement(s) / business rule(s):
- Acceptance criteria addressed:
- Design or database impact:
- UI impact (coordinate with the frontend owner):

## Implementation notes
Explain main implementation decisions and trade-offs.

## Verification
- [ ] Unit tests added or updated
- [ ] Integration tests added or updated
- [ ] Relevant regression tests executed
- [ ] Manual verification completed where appropriate
- [ ] EP / BVA cases considered where applicable
- [ ] Actual commands and results are recorded below

Commands executed and results:
```text
# e.g. npm test
```

## Review checklist
- [ ] Follows agreed MVC + service/repository structure.
- [ ] Routes map requests; controllers handle HTTP concerns.
- [ ] Business rules live in services, not duplicated in views/controllers.
- [ ] SQL is parameterized and isolated in repositories.
- [ ] Input is validated and errors handled consistently.
- [ ] Role permissions match the SRS: Administrator/Courier Clerk, Delivery Staff, public Customer tracking.
- [ ] SRS shipment statuses and transition rules are preserved.
- [ ] Shipment history and delivery-attempt requirements are handled where relevant.
- [ ] No secrets, credentials, or real customer personal data are committed.
- [ ] Documentation, README, and quality evidence are updated where needed.
- [ ] No unrelated frontend work or teammate changes are overwritten.

## Screenshots / evidence
Attach UI screenshots, test output, or relevant evidence. Do not include secrets or personal data.

## Risks, limitations, and follow-up work
List known limitations, migrations, configuration changes, or future tasks.
