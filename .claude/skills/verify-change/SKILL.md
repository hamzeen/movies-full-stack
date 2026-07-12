---
name: Verify Change
description: Verify current repository changes with repository-derived commands and report evidence without fabricating results. Use before completion or after implementation.
argument-hint: "[optional scope]"
---

# Verify the current change

## 1. Establish scope

Inspect:

- `git status`;
- `git diff --stat`;
- relevant diff content;
- affected manifests, tests, API contracts, and migrations.

Do not inspect or verify `backend-java/` unless explicitly requested.

## 2. Select commands from evidence

Derive commands from wrappers, manifests, package scripts, README instructions, and `.claude/PROJECT_CONTEXT.md`.

Prefer this order:

1. the narrowest affected test;
2. affected module tests;
3. lint/static analysis/type checking;
4. build/package;
5. broader relevant tests;
6. runtime or integration verification when safe and available.

Do not install or upgrade dependencies merely to make verification possible without reporting and approval.

## 3. Cross-cutting checks

For relevant changes verify:

- API request/response compatibility;
- validation and error behavior;
- authentication and resource authorization;
- transaction rollback;
- concurrency/idempotency behavior;
- query count/plan and indexes;
- frontend loading/error/stale-request states;
- migration safety;
- no secrets or generated artifacts in the diff.

## 4. Report evidence

Use a table:

| Check | Command or inspection | Result | Evidence/notes |
|---|---|---|---|

Use only these result labels:

- PASS — executed successfully;
- FAIL — executed and failed;
- NOT RUN — not executed, with reason;
- MANUAL — inspected manually, with exact evidence.

Do not convert NOT RUN into PASS. Include the key failure message for failed checks without dumping irrelevant logs.

Requested scope: $ARGUMENTS
