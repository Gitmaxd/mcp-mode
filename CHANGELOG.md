# Changelog

All notable changes to MCP Mode will be documented in this file.

## [0.1.0] - 2026-01-05

### Initial Release

MCP Mode is a port of [Droid Mode](https://github.com/Gitmaxd/droid-mode) to Claude Code.

### Key Features

- **Progressive MCP Discovery**: Discover servers → index tools → hydrate schemas → execute
- **Token Efficiency**: MCP tools loaded on-demand, not at session startup
- **Daemon Mode**: Persistent connections for ~5x faster tool calls
- **Workflow Engine**: Multi-tool orchestration with sandboxed JS execution
- **Full Traceability**: Every tool call logged with timing and argument hashes

### Platform Differences from Droid Mode

| Aspect | Droid Mode | Claude Mode |
|--------|-----------|-------------|
| User config | `~/.factory/mcp.json` | `~/.claude/mcp.json` |
| Project config | `.factory/mcp.json` | `.claude/mcp.json` |
| Data directory | `.factory/droid-mode/` | `.claude/mcp-mode/` |
| Daemon sockets | `~/.factory/run/` | `~/.cache/claude/run/` |
| CLI command | `dm` | `cm` |
| Env prefix | `DM_*` | `CM_*` |

### Why Separate Config Files?

MCP Mode uses `~/.claude/mcp.json` (NOT `~/.claude.json`) because:

1. Servers in Claude Code's native configs are auto-injected into context at startup
2. This injection consumes 30-100k+ tokens before any conversation
3. Separate config files keep servers invisible to Claude Code
4. `cm` connects to them on-demand, avoiding context bloat

This is the **core value proposition** of MCP Mode.
