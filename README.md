# Claude Mode

Progressive MCP integration for Claude Code. Access MCP tools **without loading them into context**.

## The Problem

MCP tool schemas are loaded into Claude Code's context window at session startup, consuming **30-50%+ of available tokens** before any conversation begins. Real-world reports show 66,000+ tokens consumed at startup (33% of 200k context).

## The Solution

Claude Mode bypasses this entirely by using **separate config files** (`~/.claude/mcp.json`) that Claude Code doesn't see. Servers are connected on-demand via CLI, schemas loaded only when needed, and tool calls executed outside the context window.

**Result:** Near-zero startup token cost, full context available for actual work.

## Installation

```bash
# Initialize in your project
npx claude-mode init

# Or install globally
npm install -g claude-mode
claude-mode init
```

This creates `.claude/skills/claude-mode/` with the skill files.

## Quick Start

```bash
# 1. Discover MCP servers
.claude/skills/claude-mode/bin/cm servers

# 2. Index tools from a server
.claude/skills/claude-mode/bin/cm index --server <name>

# 3. Search for tools
.claude/skills/claude-mode/bin/cm search "query" --server <name>

# 4. Call a tool directly
.claude/skills/claude-mode/bin/cm call <tool> --server <name>
```

## Configuration

**CRITICAL:** Claude Mode uses **SEPARATE** config files from Claude Code's native configs.

| Config | Path | Purpose |
|--------|------|---------|
| User | `~/.claude/mcp.json` | Personal MCP servers |
| Project | `<project>/.claude/mcp.json` | Project-specific servers |

**DO NOT** use Claude Code's native configs (`~/.claude.json`, `.mcp.json`) for servers you want to access via Claude Mode—those will be auto-injected into context.

### Example Config

```json
{
  "mcpServers": {
    "my-server": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "my-mcp-server"]
    }
  }
}
```

## Commands

| Command | Purpose |
|---------|---------|
| `cm servers` | List available MCP servers |
| `cm index --server X` | List tools on a server |
| `cm search "query" --server X` | Find tools by keyword |
| `cm hydrate tool1 tool2 --server X` | Get full schemas |
| `cm call tool --server X` | Execute tool directly |
| `cm run --server X --tools a,b --workflow file.js` | Run multi-tool workflow |
| `cm daemon start/stop/status` | Manage daemon for faster calls |

## Documentation

Full documentation is in the skill directory after installation:
- `.claude/skills/claude-mode/README.md` - Complete usage guide
- `.claude/skills/claude-mode/SKILL.md` - Claude Code skill reference

## Related

- [Droid Mode](https://github.com/Gitmaxd/droid-mode) - The Factory.ai version this was ported from

## License

MIT
