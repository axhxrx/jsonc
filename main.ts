import { assertExists } from '@std/assert/exists';
import { parseArgs } from '@std/cli';
import { yellow } from 'jsr:@std/internal@^1.0.5/styles';
import { JsoncFormatter } from './JSONCFormatter.ts';

const usage = `
Usage: deno run mod.ts [options] <glob_pattern>

Options:
  --write, -w    Write formatted output back to files
  --help, -h     Show this help message

Examples:
  deno run -R mod.ts **/*.jsonc
  deno run -RW mod.ts --write **/*.jsonc
`;

export const main = (): void =>
{
  const { _, help, write } = parseArgs(Deno.args, {
    boolean: ['help', 'write'],
    alias: { h: 'help', w: 'write' },
  });

  if (help || _.length === 0)
  {
    console.log(usage);
    Deno.exit(0);
  }

  const opts = {
    write: write ?? false,
    patterns: _ as string[],
  };

  const changed: string[] = [];
  let changedCount = 0;
  const tookAction = opts.write ? 'UPDATED' : 'SKIPPED';

  for (const path of opts.patterns)
  {
    assertExists(path);

    const formatter = new JsoncFormatter();
    // SOMEDAY: add async variant?
    const _formatted = formatter.formatFileSync(path, { write: opts.write }, changed);
    const wasChanged = changed.length > changedCount;
    changedCount = changed.length;
    if (wasChanged)
    {
      console.log(yellow(`${tookAction}: ${path}`));
    }
    else
    {
      console.log(`CONFIRMED: ${path}`);
    }
  }

  if (changedCount === 0)
  {
    console.log('No changes needed.');
  }
  else
  {
    if (opts.write)
    {
      console.log(`${tookAction} ${changedCount} files.`);
    }
    else
    {
      console.log(`${tookAction} ${changedCount} files.`);
    }
  }
};
