---
name: Bootstrap Project
description: Inspect this repository's active Kotlin backend, frontend, and database setup, then record verified stack details and commands. Use during initial setup or after build tooling changes.
argument-hint: "[optional focus]"
disable-model-invocation: true
---

# Bootstrap the project context

Inspect the repository and update only the generated section in `.claude/PROJECT_CONTEXT.md`.

## Scope

Inspect:

- root files relevant to setup;
- `backend-kotlin/`;
- `frontend/`;
- `database/`.

Do not inspect `backend-java/`.

## Discover

Determine from repository evidence:

1. Backend framework, language/JVM versions, build tool, wrapper, modules, application entry point, and configuration profiles.
2. Backend commands for development, tests, static analysis, formatting, packaging, and database integration.
3. Frontend framework, package manager chosen by lockfile, runtime version constraints, development/build/test/lint commands, and API configuration.
4. Database Compose file location, schema/migration mechanism, initialization scripts, database name, and safe inspection commands.
5. Root-level orchestration commands and the correct startup order.
6. Existing architecture, test conventions, and generated directories that must not be edited.

## Rules

- Read manifests and scripts before invoking commands.
- Prefer project wrappers and package scripts.
- Do not install packages, upgrade dependencies, start long-running services, or change application code.
- Non-destructive version/help/list commands are allowed when useful.
- Preserve all content outside the markers:
  `<!-- bootstrap-project:start -->`
  and
  `<!-- bootstrap-project:end -->`.
- Record only verified facts. Label unresolved items as unknown.
- Keep the generated section concise and command-oriented.

## Report

Return:

- files inspected;
- facts recorded;
- ambiguities or missing setup;
- commands not run and why.

Focus requested by the user: $ARGUMENTS
