import { assertEquals } from '@std/assert';

import { getAlphabeticalInsertionIndex } from './getAlphabeticalInsertionIndex.ts';

Deno.test('getAlphabeticalInsertionIndex - case sensitive', () =>
{
  const arr = ['apple', 'banana', 'cherry', 'date'];
  assertEquals(getAlphabeticalInsertionIndex('banana', arr), 1);
  assertEquals(getAlphabeticalInsertionIndex('apricot', arr), 1);
  assertEquals(getAlphabeticalInsertionIndex('zebra', arr), 4);
  assertEquals(getAlphabeticalInsertionIndex('aardvark', arr), 0);
});

Deno.test('getAlphabeticalInsertionIndex - case insensitive', () =>
{
  const arr = ['Apple', 'banana', 'Cherry', 'date'];
  const target = 'BANANA';
  const index = getAlphabeticalInsertionIndex(
    target.toLowerCase(),
    arr.map((s) => s.toLowerCase()),
  );
  assertEquals(index, 1);
});

Deno.test('getAlphabeticalInsertionIndex - mixed case array', () =>
{
  const arr = ['Apple', 'BANANA', 'cherry', 'DATE'];
  const sortedArr = [...arr].sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));

  // Test each word in the array
  for (const word of arr)
  {
    const index = getAlphabeticalInsertionIndex(
      word.toLowerCase(),
      sortedArr.map((s) => s.toLowerCase()),
    );
    const expectedIndex = sortedArr.findIndex(
      (s) => s.toLowerCase() === word.toLowerCase(),
    );
    assertEquals(index, expectedIndex);
  }
});

Deno.test('getAlphabeticalInsertionIndex - empty array', () =>
{
  assertEquals(getAlphabeticalInsertionIndex('test', []), 0);
});
