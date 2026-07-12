@AGENTS.md
@.claude/PROJECT_CONTEXT.md

# Claude Code Instructions

## Active scope

Work only in these active areas unless the user explicitly expands the scope:

- `backend-kotlin/`
- `frontend/`
- `database/`
- root documentation and shared configuration

Treat `backend-java/` as excluded. Do not read, edit, build, test, compare, or use it as an implementation reference unless the user explicitly asks.

## Start every task with evidence

Before changing code:

1. Read the relevant manifest, build file, configuration, tests, and nearby implementation.
2. Identify the actual framework, package manager, build tool, commands, and conventions.
3. State assumptions when repository evidence is incomplete.
4. For non-trivial work, define acceptance criteria and a test plan before implementation.

Never invent commands, dependencies, environment variables, table names, endpoints, or test results.

## Agentic workflow

For non-trivial features, defects, schema changes, or cross-layer work:

1. Use the `solution-architect` subagent to inspect and propose a bounded plan.
2. Delegate implementation to the matching domain subagent.
3. Use `test-engineer` to verify behavior and failure paths.
4. Use `code-reviewer` for an independent final review.
5. Keep one writer per file area at a time. Parallelize investigation and review, not conflicting edits.

Small, obvious edits may be completed directly, but still require relevant verification.

## Available project skills

- `/bootstrap-project` — discover the real stack and commands, then update project context.
- `/architect-tdd` — design and implement a feature using architecture-first TDD.
- `/kotlin-backend` — backend Kotlin/API/persistence workflow.
- `/frontend-feature` — frontend workflow derived from the actual frontend stack.
- `/database-change` — safe MariaDB schema/query workflow.
- `/verify-change` — evidence-based verification.
- `/review-change` — correctness, security, performance, and test review.

## Change policy

- Make the smallest coherent change that satisfies the requirement.
- Do not perform unrelated refactors or dependency upgrades.
- Do not alter public contracts silently.
- Do not weaken tests, validation, authorization, or database constraints to make checks pass.
- Do not claim a command passed unless it was executed successfully in this session.
- Do not commit, push, delete data, reset Git history, or run destructive database commands unless explicitly requested.

## Completion format

End implementation work with:

1. What changed.
2. Important design decisions.
3. Tests and commands actually run, with outcomes.
4. Remaining risks, assumptions, or unverified items.
