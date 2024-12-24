export * from 'jsonc-parser';

export * from './JSONCFormatter.ts';
export * from './JSONCTweaker.ts';

import { main } from './main.ts';

if (import.meta.main)
{
  main();
}
