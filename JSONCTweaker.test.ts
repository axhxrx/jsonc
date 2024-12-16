import { assertEquals } from '@std/assert';
import type { ParseError } from 'npm:jsonc-parser';
import { JSONCTweaker } from './JSONCTweaker.ts';

const fixture1URL = new URL('./test/fixture1.jsonc', import.meta.url);
const fixture2URL = new URL('./test/fixture2.jsonc', import.meta.url);

// deno-lint-ignore no-explicit-any
type Any = any;

Deno.test('JSONCTweaker - can initialize from text', () =>
{
  const jsonc = '{ "name": "test" }';
  const tweaker = JSONCTweaker.fromText(jsonc);
  assertEquals(tweaker.jsonc, jsonc);
});

Deno.test('JSONCTweaker - can read and parse JSONC files', () =>
{
  const fixture1Content = Deno.readTextFileSync(fixture1URL);
  const tweaker = JSONCTweaker.fromText(fixture1Content);

  // Test getting values
  const fmtOptions = tweaker.getValue(['fmt', 'options']) as {
    useTabs: boolean;
    lineWidth: number;
    indentWidth: number;
  };
  assertEquals(fmtOptions.useTabs, false);
  assertEquals(fmtOptions.lineWidth, 120);
  assertEquals(fmtOptions.indentWidth, 2);

  // Test getting array values
  const workspace = tweaker.getValue(['workspace']) as string[];
  assertEquals(Array.isArray(workspace), true);
  assertEquals(workspace.includes('jsonc-formatter'), true);
});

Deno.test('JSONCTweaker - can handle comments and trailing commas', () =>
{
  const fixture2Content = Deno.readTextFileSync(fixture2URL);
  const tweaker = JSONCTweaker.fromText(fixture2Content);

  // Test getting values with comments present
  const name = tweaker.getValue(['name']);
  assertEquals(name, 'John Doe');

  // Test nested object with trailing comma
  const bethyl = tweaker.getValue(['girlfrends', 'Bethyl']);
  assertEquals((bethyl as Any).age, 20);
  assertEquals(Array.isArray((bethyl as Any).hobbies), true);
  assertEquals((bethyl as Any).hobbies.includes('reading'), true);
});

Deno.test('JSONCTweaker - can insert array values', async () =>
{
  const jsonc = '{ "tags": ["typescript", "deno"] }';
  const tweaker = JSONCTweaker.fromText(jsonc);

  const errors: Array<ParseError | Error> = [];
  const success = await tweaker.insertArrayValue(['tags'], 'test', errors);
  assertEquals(success, true);
  assertEquals(errors.length, 0);

  // Get the actual array and verify its contents
  const tags = tweaker.getValue(['tags']) as string[];
  assertEquals(tags.length, 3);
  assertEquals(tags.includes('typescript'), true);
  assertEquals(tags.includes('deno'), true);
  assertEquals(tags.includes('test'), true);
});

Deno.test('JSONCTweaker - handles non-existent paths', async () =>
{
  const jsonc = '{ "name": "test" }';
  const tweaker = JSONCTweaker.fromText(jsonc);

  const errors: Array<ParseError | Error> = [];
  const success = await tweaker.insertArrayValue(['nonexistent'], 'value', errors);
  assertEquals(success, false);
  assertEquals(errors.length, 1);
  assertEquals((errors[0] as Error).message, 'Path does not exist: nonexistent');
});

Deno.test('JSONCTweaker - can skip existing values', async () =>
{
  const jsonc = '{ "tags": ["typescript", "deno"] }';
  const tweaker = JSONCTweaker.fromText(jsonc);

  const errors: Array<ParseError | Error> = [];
  const success = await tweaker.insertArrayValue(['tags'], 'typescript', errors, { skipIfExists: true });
  assertEquals(success, true);
  assertEquals(errors.length, 0);

  // The array should remain unchanged
  const expectedJson = '{ "tags": ["typescript", "deno"] }';
  assertEquals(tweaker.jsonc.replace(/\s/g, ''), expectedJson.replace(/\s/g, ''));
});

Deno.test('JSONCTweaker - getValue returns undefined for non-existent paths', () =>
{
  const jsonc = '{ "name": "test" }';
  const tweaker = JSONCTweaker.fromText(jsonc);

  const value = tweaker.getValue(['nonexistent', 'path']);
  assertEquals(value, undefined);
});
