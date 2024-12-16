/**
 Given a target string and an array of strings, returns the index at which the target string should be inserted into the array to maintain case-insensitive alphabetical order. Example:

 ```ts
 const arr = ['ant', 'bee', 'cat', 'dog'];
 const i = getAlphabeticalInsertionIndex('COW', arr); // i = 3
 ```
 */
export function getAlphabeticalInsertionIndex(target: string, arr: ReadonlyArray<string>): number
{
  const targetLower = target.toLowerCase();
  let low = 0;
  let high = arr.length;

  while (low < high)
  {
    const mid = Math.floor((low + high) / 2);
    if (arr[mid].toLowerCase() < targetLower)
    {
      low = mid + 1;
    }
    else
    {
      high = mid;
    }
  }
  return low;
}
