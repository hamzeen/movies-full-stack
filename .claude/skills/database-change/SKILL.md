---
name: Database Change
description: Design, implement, or review MariaDB schema and query changes safely using versioned migrations, constraints, transaction/concurrency analysis, indexes derived from access patterns, and query-plan evidence.
argument-hint: "[schema-or-query task]"
paths:
  - "database/**"
---

# MariaDB change workflow

Target the repository's development MariaDB 10.11 behavior unless repository evidence says otherwise.

## Inspect first

Read:

- Compose configuration and environment;
- existing schema, migrations, seed/init scripts;
- backend entities/models and repository queries;
- constraints and indexes on affected tables;
- tests that exercise persistence.

Use the container shell for inspection when running:

```bash
docker compose exec database mariadb -u root
```

Run from the directory containing the relevant Compose file.

## Plan

State:

- current schema/query behavior;
- desired invariant or access pattern;
- forward migration;
- rollback/mitigation;
- data backfill needs;
- lock duration and deployment risk;
- compatibility with old and new application versions when relevant.

## Schema rules

- Prefer versioned, repeatable project migration mechanisms over undocumented manual edits.
- Use primary keys, foreign keys, unique constraints, `NOT NULL`, and checks where they express real invariants.
- Choose types deliberately; do not use oversized strings or nullable columns by default.
- Preserve existing data.
- Separate destructive cleanup from the initial compatibility migration when practical.

## Query and index rules

- Start from actual query predicates, joins, orderings, grouping, selectivity, and expected cardinality.
- Avoid N+1 query loops.
- Avoid `SELECT *` on broad/hot paths unless justified.
- Bound result sets.
- Use `EXPLAIN` for material query changes and compare access path, rows estimate, and index use.
- Do not add redundant indexes; account for write amplification and storage cost.

## Transactions and concurrency

Identify the invariant and contention point.

Use the database as the final arbiter through one or more of:

- atomic conditional update;
- uniqueness constraint;
- optimistic version check;
- row locking;
- suitable isolation and transaction boundary.

Define deadlock/retry and duplicate-request behavior where relevant.

## Safety

- Never drop/truncate tables, delete broad datasets, or recreate the persistent volume without explicit approval.
- Before destructive actions, show the exact command, impact, backup/recovery plan, and safer alternative.
- Do not assume container recreation removes data; the named volume persists.

## Verify

- apply migration in a disposable or explicitly approved development context;
- verify schema and constraints;
- run persistence/integration tests;
- inspect query plans;
- test rollback or document why it is not safely reversible;
- report exact evidence.

Task: $ARGUMENTS
