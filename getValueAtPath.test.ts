import { assertEquals } from '@std/assert';
import { getValueAtPath } from './getValueAtPath.ts';

Deno.test('getValueAtPath - can get values from simple object', () =>
{
  const obj = {
    name: 'test',
    age: 25,
    nested: {
      key: 'value',
    },
  };

  assertEquals(getValueAtPath(obj, ['name']), 'test');
  assertEquals(getValueAtPath(obj, ['age']), 25);
  assertEquals(getValueAtPath(obj, ['nested', 'key']), 'value');
  assertEquals(getValueAtPath(obj, ['nonexistent']), undefined);
});

Deno.test('getValueAtPath - can get values from arrays', () =>
{
  const obj = {
    items: ['a', 'b', 'c'],
    nested: [
      { id: 1 },
      { id: 2 },
    ],
  };

  assertEquals(getValueAtPath(obj, ['items', 1]), 'b');
  assertEquals(getValueAtPath(obj, ['nested', 0, 'id']), 1);
  assertEquals(getValueAtPath(obj, ['items', 99]), undefined);
});

Deno.test('getValueAtPath - handles null and undefined values', () =>
{
  const obj = {
    nullValue: null,
    undefinedValue: undefined,
    nested: {
      nullValue: null,
    },
  };

  assertEquals(getValueAtPath(obj, ['nullValue']), null);
  assertEquals(getValueAtPath(obj, ['undefinedValue']), undefined);
  assertEquals(getValueAtPath(obj, ['nested', 'nullValue']), null);
  assertEquals(getValueAtPath(obj, ['nullValue', 'anything']), undefined);
});
