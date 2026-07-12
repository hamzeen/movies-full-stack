# Shared Agent Policy

This file is the cross-agent operating contract for the repository. Claude Code loads it through `CLAUDE.md`.

## Repository map

| Path | Role | Status |
|---|---|---|
| `backend-kotlin/` | Active backend implementation | In scope |
| `frontend/` | Active user interface | In scope |
| `database/` | MariaDB container and database assets | In scope |
| `backend-java/` | Alternative backend implementation | Excluded |
| `README.md` | Assignment requirements and usage | Read before broad changes |

## Core working agreement

- Inspect before editing. Derive facts from repository files.
- Separate confirmed facts, assumptions, and recommendations.
- For non-trivial changes, produce a short plan before code.
- Implement in small vertical increments that remain testable.
- Follow red → green → refactor when behavior changes.
- Preserve existing architecture unless a change is justified by the requirement.
- Keep controllers/UI handlers thin and domain logic testable.
- Prefer clear boundaries over speculative abstraction.
- Avoid duplicate implementations across layers.
- Never fabricate command output, test coverage, benchmark results, or database behavior.

## Delegation model

Use domain specialists when the task is substantial:

- `solution-architect`: current-state analysis, boundaries, contracts, trade-offs, failure modes.
- `kotlin-backend-engineer`: Kotlin backend, API, service, persistence, transactions.
- `frontend-engineer`: frontend components, state, API integration, accessibility.
- `database-engineer`: MariaDB schema, migrations, queries, indexes, locking.
- `test-engineer`: test design, failure-path coverage, verification.
- `code-reviewer`: independent correctness/security/performance review.

Parallel work is allowed for independent investigation. Do not let multiple agents edit the same files concurrently.

## Architecture and API rules

- Keep transport, application/domain, and persistence concerns separated where the existing stack permits.
- Validate untrusted input at system boundaries.
- Return consistent errors without leaking internals.
- Preserve backward compatibility unless the requested change explicitly breaks it.
- Authentication identifies the caller; authorization must validate access to each requested resource.
- Scope resource queries to the authenticated principal where ownership applies. Never trust a client-supplied owner ID.
- Apply idempotency to retryable state-changing operations when duplicate execution has business impact.

## Data and concurrency rules

- Use database constraints as the final integrity boundary.
- Use transactions when multiple writes must succeed or fail together.
- Analyze race conditions for limited resources, counters, last-record logic, and check-then-write flows.
- Choose optimistic locking, pessimistic locking, atomic SQL, or uniqueness constraints based on contention and failure semantics.
- Avoid N+1 access patterns; verify query count or generated SQL where practical.
- Add indexes from real query predicates, joins, ordering, and cardinality—not by guesswork.
- Use `EXPLAIN` for material query changes.
- Avoid unbounded reads and writes. Paginate or batch when data can grow.

## Performance rules

- State time and space complexity for non-trivial in-memory algorithms.
- Do not promise a throughput target from code inspection alone.
- For load targets such as 10,000 requests/second, define the endpoint, payload, concurrency, hardware, dataset, warm-up, duration, and success thresholds.
- Benchmark only after correctness checks; report measured evidence and bottlenecks.
- Watch database connections, thread pools, blocking I/O, serialization, logging, and downstream limits.

## Test policy

Tests must cover relevant happy paths and failure paths, including:

- validation and malformed input;
- not found and conflict behavior;
- authentication and authorization;
- duplicate/retry behavior;
- transaction rollback;
- concurrency-sensitive behavior;
- empty, loading, error, and stale-response frontend states;
- database constraints and query behavior where material.

Do not delete or dilute a valid test merely to obtain a green build.

## Database safety

The development database is MariaDB 10.11 in Docker, service name `database`, host port `53306`, container port `3306`, with a persistent named volume.

- Treat the empty root password as local-development-only.
- Prefer migrations or versioned SQL over undocumented manual schema edits.
- Inspect from the container with `mariadb -u root`.
- Never run destructive DDL/DML against persistent data without explicit approval and a recovery plan.
- Never assume recreating the container resets the database; the named volume persists data.

## Git and repository hygiene

- Keep changes focused.
- Never edit generated/build output unless it is intentionally versioned.
- Never commit secrets, local credentials, or machine-specific paths.
- Do not amend, force-push, reset, clean, or discard user changes without explicit permission.
- Review `git diff` before reporting completion.

## Definition of done

A change is complete only when:

- acceptance criteria are satisfied;
- relevant tests were added or updated first when behavior changed;
- targeted checks pass;
- broader build/lint/test checks pass when feasible;
- security, authorization, concurrency, query, and performance risks were considered where relevant;
- documentation/configuration is updated when behavior or setup changed;
- unverified items are clearly reported.
