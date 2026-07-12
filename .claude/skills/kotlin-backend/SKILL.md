---
name: Kotlin Backend
description: Implement or review changes in the active Kotlin backend using repository-derived build commands, layered boundaries, secure APIs, transaction safety, and tests-first development.
argument-hint: "[backend task]"
paths:
  - "backend-kotlin/**"
---

# Kotlin backend workflow

## Discover before editing

Read the relevant:

- `build.gradle`, `build.gradle.kts`, `settings.gradle*`, `gradle.properties`, or `pom.xml`;
- wrapper files;
- source layout;
- application configuration;
- existing controller/handler, service/use-case, repository, entity/model, DTO, and test patterns.

Use the repository's wrapper. For Gradle, prefer `./gradlew`; do not rely on a global Gradle installation.

Do not assume Spring Boot, JPA, Hibernate, coroutines, or a test library until the files confirm them.

## Implementation boundaries

When the framework supports these layers:

- transport/controller: HTTP mapping, request validation, response mapping;
- application/service: business use case and transaction orchestration;
- domain: business rules and invariants;
- repository/persistence: data access;
- DTO/mapping: external contract separated from persistence entities.

Keep handlers thin. Do not expose persistence entities as public API contracts unless that is an established deliberate convention.

## API and security

- Use resource-oriented routes and correct HTTP semantics.
- Validate request data at the boundary.
- Return consistent, non-leaky errors.
- Authentication establishes identity; authorization verifies each action/resource.
- Scope ownership-sensitive data access to the authenticated user or authorized tenant in the query itself where possible.
- Never trust a user/owner ID supplied by the client as proof of authorization.

## Persistence and performance

- Make transaction boundaries explicit.
- Prevent partial writes for multi-step state changes.
- Detect N+1 behavior in ORM mappings and repository loops.
- Prefer bounded queries, pagination, projections, joins/fetch plans, or batching as appropriate.
- Base indexes on actual predicates, joins, ordering, uniqueness, and cardinality.
- Inspect generated SQL or query plans for material data-access changes.
- Avoid loading entire tables to filter or aggregate in memory.

## Concurrency and idempotency

For check-then-write flows, limited inventory, last-record logic, counters, and retried commands:

- identify the invariant;
- choose atomic SQL, a unique constraint, optimistic locking, pessimistic locking, or an idempotency record;
- define conflict/retry behavior;
- add a test that can fail under the unsafe design.

Do not use in-process synchronization as the sole protection for invariants shared across application instances.

## Testing

Follow existing test conventions and use red → green → refactor.

Cover as relevant:

- unit tests for business rules;
- controller/HTTP contract tests;
- repository/integration tests against the real database behavior;
- authorization;
- validation;
- rollback;
- conflicts and duplicates;
- concurrency-sensitive paths.

Avoid mocks that merely repeat implementation details.

## Verification

Run the narrowest verified project commands first, then broader relevant checks. Report exact commands and outcomes.

Task: $ARGUMENTS
