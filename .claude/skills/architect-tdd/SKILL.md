---
name: Architect TDD
description: Plan and implement non-trivial features or fixes using current-state analysis, architecture decisions, explicit failure analysis, tests-first development, and evidence-based verification.
argument-hint: "[feature-or-problem]"
---

# Architecture-first TDD workflow

Apply this workflow proportionally. Do not over-engineer small changes.

## 1. Establish the requirement

Before code, identify:

- desired user-visible or system behavior;
- acceptance criteria;
- affected layers and contracts;
- explicit non-goals;
- missing information that blocks a correct implementation.

Resolve facts from the repository before asking questions. Ask only for decisions that cannot be derived safely.

## 2. Inspect current state

Read the relevant implementation, tests, build files, API contracts, configuration, and schema/migrations.

Summarize:

- current request/data flow;
- existing patterns to preserve;
- likely change points;
- constraints and compatibility concerns.

Do not inspect `backend-java/`.

## 3. Produce a bounded design

Define:

- component/module responsibilities;
- API and data contracts;
- transaction boundary;
- error semantics;
- migration or rollout needs;
- alternatives considered and why the chosen option is proportionate.

Avoid speculative abstractions and broad rewrites.

## 4. Threat and failure analysis

Check only relevant risks, including:

- authentication versus per-resource authorization;
- IDOR/broken object-level authorization;
- input validation and information leakage;
- retries, duplicate delivery, and idempotency;
- check-then-write races and limited-resource contention;
- transaction rollback and partial failure;
- N+1 queries, unbounded reads, and missing indexes;
- stale frontend responses and duplicate submissions;
- algorithmic time/space complexity;
- dependencies and downstream failure.

For a throughput target, define a measurable load-test contract rather than claiming capacity from inspection.

## 5. Define the test matrix

Map each acceptance criterion and material risk to a test.

Cover as relevant:

- success;
- validation;
- not found;
- forbidden;
- conflict;
- retry/duplicate request;
- rollback;
- concurrency;
- query behavior;
- loading/empty/error frontend states.

Identify the first smallest failing test.

## 6. Red → green → refactor

For each increment:

1. Add or update a test that fails for the expected reason.
2. Run the narrowest relevant test and capture the failure.
3. Implement the minimum production change.
4. Re-run the test and make it pass.
5. Refactor without changing behavior.
6. Run nearby regression tests.

Do not write all implementation first and add cosmetic tests afterward.

## 7. Verify

Use `/verify-change` or equivalent repository commands.

Verify:

- targeted tests;
- broader relevant tests;
- lint/static analysis;
- build/package;
- migration/query behavior;
- frontend-backend contract;
- `git diff`.

Never report a check as passed unless it ran successfully.

## 8. Independent review

Use the `code-reviewer` subagent or `/review-change`.

Address material findings, then repeat affected checks.

## Output

Conclude with:

- requirement and design summary;
- files changed;
- tests added;
- commands and actual outcomes;
- security/concurrency/performance decisions;
- remaining assumptions and risks.

Task: $ARGUMENTS
