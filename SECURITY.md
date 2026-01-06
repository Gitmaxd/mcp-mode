# Security Considerations

MCP Mode is under active development. This document outlines known security limitations and design tradeoffs.

## Permission Scope

The skill uses `allowed-tools: Bash(*)` which grants broad bash access without prompting while the skill is active.

**Why**: The skill's core function requires running `cm` CLI commands.

**Tradeoff**: A narrower scope like `Bash(./.claude/skills/claude-mode/bin/cm *)` would be more restrictive but may cause UX friction with path variations.

**Status**: Accepted for v0.x. Will revisit for v1.0.

## Workflow Sandbox

The `cm run` command executes user-provided JavaScript in a "sandbox" that blocks `require`, `import`, and `fetch`. This is a **development convenience**, not a security boundary.

**What it prevents**: Casual mistakes, accidental network calls

**What it does NOT prevent**: Determined bypass attempts

For production use cases requiring true isolation, consider [Daytona](https://daytona.io/) sandboxed environments.

## Reporting Issues

If you discover a security issue, please open a GitHub issue or contact gitmaxd@users.noreply.github.com.
