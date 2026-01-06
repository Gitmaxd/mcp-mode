import { defineCommand, runMain } from 'citty';
import { copy, pathExists, ensureDir } from 'fs-extra';
import { resolve, join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { stat, readFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

const MCP_MODE_ASCII = `
  ███╗   ███╗ ██████╗██████╗     ███╗   ███╗ ██████╗ ██████╗ ███████╗
  ████╗ ████║██╔════╝██╔══██╗    ████╗ ████║██╔═══██╗██╔══██╗██╔════╝
  ██╔████╔██║██║     ██████╔╝    ██╔████╔██║██║   ██║██║  ██║█████╗
  ██║╚██╔╝██║██║     ██╔═══╝     ██║╚██╔╝██║██║   ██║██║  ██║██╔══╝
  ██║ ╚═╝ ██║╚██████╗██║         ██║ ╚═╝ ██║╚██████╔╝██████╔╝███████╗
  ╚═╝     ╚═╝ ╚═════╝╚═╝         ╚═╝     ╚═╝ ╚═════╝ ╚═════╝ ╚══════╝`;

const DIVIDER = '────────────────────────────────────────────────────────────────────────────────';
const DIVIDER_THIN = '────────────────────────────────────────────────────────────';

async function getPackageVersion(): Promise<string> {
  try {
    const pkgPath = resolve(__dirname, '..', 'package.json');
    const content = await readFile(pkgPath, 'utf-8');
    const pkg = JSON.parse(content);
    return pkg.version || '0.0.0';
  } catch {
    return '0.0.0';
  }
}

function printSuccessScreen(copied: number, skipped: number, version: string): void {
  console.log(`\n${DIVIDER}\n`);
  console.log(MCP_MODE_ASCII);
  console.log(`${''.padStart(56)}v${version}\n`);
  console.log('                   Progressive MCP for Claude Code\n');
  console.log(DIVIDER);

  const status = skipped > 0
    ? `  ✓ Updated successfully       ${copied} created  ·  ${skipped} skipped (existing)`
    : `  ✓ Initialized successfully   ${copied} files created`;
  console.log(`\n${status}\n`);
  console.log(DIVIDER_THIN);

  console.log('\n  QUICK START\n');
  console.log('  1. Discover MCP servers        cm servers');
  console.log('  2. Index tools from server     cm index --server <name>');
  console.log('  3. Search for tools            cm search "query" --server <name>');
  console.log('  4. Call a tool                 cm call <tool> --server <name>\n');
  console.log(DIVIDER_THIN);

  console.log('\n  ⚡ KEY INSIGHT\n');
  console.log('  MCP Mode uses SEPARATE config files (~/.claude/mcp.json)');
  console.log('  from Claude Code\'s native configs. This prevents MCP schemas');
  console.log('  from being auto-injected into context at startup.\n');
  console.log(DIVIDER_THIN);

  console.log('\n  RESOURCES\n');
  console.log('  📦 NPM       https://npmjs.com/package/mcp-mode');
  console.log('  🐙 GitHub    https://github.com/Gitmaxd/mcp-mode\n');
  console.log(DIVIDER);
  console.log('');
}

const init = defineCommand({
  meta: {
    name: 'init',
    description: 'Initialize MCP Mode skill in your project',
  },
  args: {
    force: {
      type: 'boolean',
      description: 'Skip existing file checks (still never overwrites)',
      default: false,
    },
    path: {
      type: 'string',
      description: 'Target directory (defaults to current directory)',
      default: '.',
    },
  },
  async run({ args }) {
    const targetDir = resolve(args.path);
    const skillDir = join(targetDir, '.claude', 'skills', 'mcp-mode');
    const templatesDir = resolve(__dirname, '..', 'templates', 'skills', 'mcp-mode');

    console.log('\n🤖 MCP Mode Initializer\n');

    // Check if templates exist
    if (!(await pathExists(templatesDir))) {
      console.error('❌ Templates directory not found. Package may be corrupted.');
      process.exit(1);
    }

    // Check if skill already exists
    if (await pathExists(skillDir) && !args.force) {
      console.log('⚠️  .claude/skills/mcp-mode already exists');
      console.log('   Scaffolding new files only (existing files will NOT be overwritten)\n');
    }

    // Ensure skill directory exists
    await ensureDir(skillDir);

    // Track copied and skipped files
    let copied = 0;
    let skipped = 0;

    try {
      await copy(templatesDir, skillDir, {
        overwrite: false,
        errorOnExist: false,
        filter: async (src, dest) => {
          // Always allow directories
          const srcStat = await stat(src);
          if (srcStat.isDirectory()) {
            return true;
          }

          // Check if destination file exists
          if (await pathExists(dest)) {
            if (!args.force) {
              const relativePath = dest.replace(targetDir, '.');
              console.log(`⏭️  Skipped: ${relativePath} (already exists)`);
            }
            skipped++;
            return false;
          }

          const relativePath = dest.replace(targetDir, '.');
          console.log(`✅ Created: ${relativePath}`);
          copied++;
          return true;
        },
      });
    } catch (error) {
      console.error('❌ Error during scaffolding:', error);
      process.exit(1);
    }

    const version = await getPackageVersion();
    printSuccessScreen(copied, skipped, version);
  },
});

const main = defineCommand({
  meta: {
    name: 'mcp-mode',
    version: '0.1.0',
    description: 'Progressive MCP integration for Claude Code',
  },
  subCommands: {
    init,
  },
  async run() {
    const version = await getPackageVersion();
    console.log(`\n🤖 MCP Mode v${version}\n`);
    console.log('Usage:  npx mcp-mode init [--path <dir>]\n');
    console.log('Scaffold MCP integration for Claude Code.');
    console.log('Learn more: https://github.com/Gitmaxd/mcp-mode\n');
  },
});

runMain(main);
