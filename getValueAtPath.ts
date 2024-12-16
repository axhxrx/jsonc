/**
 Given an unknown object and a path, returns the value at the specified path. Returns undefined if the path doesn't lead to a value.

 Example:
 ```ts
 const obj = {
   name: 'John',
   age: 25,
   address: {
     street: '123 Main St',
     city: 'Anytown',
   },
 };
 const name = getValueAtPath(obj, ['name']); // 'John'
 const age = getValueAtPath(obj, ['age']); // 25
 const street = getValueAtPath(obj, ['address', 'street']); // '123 Main St'
 ```
 */
export function getValueAtPath<T = unknown>(obj: unknown, path: ReadonlyArray<string | number>): T | undefined
{
  let current: unknown = obj;

  for (const key of path)
  {
    if (current === null || current === undefined)
    {
      return undefined;
    }

    if (typeof key === 'number')
    {
      if (!Array.isArray(current))
      {
        return undefined;
      }
      current = current[key];
    }
    else
    {
      if (typeof current !== 'object' || current === null)
      {
        return undefined;
      }
      current = (current as Record<string, unknown>)[key];
    }
  }

  return current as T;
}
