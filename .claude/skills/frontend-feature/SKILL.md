---
name: Frontend Feature
description: Implement or review frontend behavior using the actual framework and package manager discovered from the repository, with tests-first development, resilient API state, accessibility, and focused changes.
argument-hint: "[frontend task]"
paths:
  - "frontend/**"
---

# Frontend feature workflow

## Discover the stack

Before editing, inspect:

- `package.json`;
- the lockfile to choose the package manager;
- framework/build configuration;
- application entry points and routing;
- component, state, API-client, styling, and test conventions.

Use existing scripts. Do not replace the package manager, test runner, state library, or styling approach without an explicit requirement.

## Design the behavior

Define:

- user interaction and acceptance criteria;
- component/state ownership;
- API request and response contract;
- loading, empty, success, validation, error, and retry states;
- cancellation or stale-response behavior;
- accessibility expectations;
- responsive behavior when relevant.

Keep server-owned rules on the server. Do not duplicate authorization or integrity guarantees as frontend-only logic.

## Implementation

- Follow the framework's current idioms already used by the project.
- Keep components focused and extract logic only when reuse or testability justifies it.
- Preserve strong typing where available.
- Centralize API concerns according to existing conventions.
- Prevent accidental duplicate submissions while preserving intentional retries.
- Cancel or ignore obsolete requests when dependencies change.
- Do not store secrets in frontend code.
- Treat decoded token claims as display hints only; backend authorization remains authoritative.

## Testing

Write or update the failing test first.

Cover as relevant:

- rendered success state;
- user interaction;
- loading and disabled states;
- validation;
- API error and retry;
- empty data;
- stale/aborted requests;
- duplicate clicks/submissions;
- accessible names, focus, and keyboard behavior.

Prefer behavior-focused tests over implementation-detail assertions.

## Verification

Run the repository's targeted test, lint/type-check, and build scripts as applicable. Verify the frontend-backend contract from both sides for cross-layer changes.

Task: $ARGUMENTS
