---
name: Review Change
description: Independently review current changes for correctness, security, authorization, concurrency, data integrity, performance, maintainability, and missing tests.
argument-hint: "[optional review focus]"
---

# Independent change review

Review the current diff and the nearby code required to understand it. Do not modify files unless the user asks for fixes after the review.

## Review priorities

1. Correctness and acceptance-criteria gaps.
2. Security, authentication, and per-resource authorization.
3. Data integrity, transaction boundaries, retries, and idempotency.
4. Race conditions and multi-instance behavior.
5. Query behavior, N+1 access, pagination, indexes, and unbounded work.
6. API compatibility and error semantics.
7. Frontend stale state, duplicate actions, loading/error/empty behavior, and accessibility.
8. Test quality and missing failure-path coverage.
9. Material maintainability problems.

Ignore subjective style preferences unless they create a concrete defect or violate an established repository convention.

## Finding format

List findings in severity order:

### [Critical|High|Medium|Low] Concise title

- Location: `path:line`
- Problem: exact behavior or risk.
- Impact: what can fail or be exploited.
- Evidence: code path, query, contract, or missing test.
- Recommended fix: smallest safe correction.

Do not claim a vulnerability, race, or performance issue without a plausible path from code to impact.

## Final verdict

Provide:

- findings;
- assumptions or areas not verified;
- test gaps;
- verdict: `BLOCK`, `CHANGES REQUESTED`, or `APPROVE`.

Review focus: $ARGUMENTS
