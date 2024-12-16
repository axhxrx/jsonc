import { applyEdits, modify, parse, type Segment } from 'jsonc-parser';
import type { ParseError } from 'npm:jsonc-parser';
import { DefaultFormattingOptions } from './DefaultFormattingOptions.ts';
import { getAlphabeticalInsertionIndex } from './getAlphabeticalInsertionIndex.ts';
import { getValueAtPath } from './getValueAtPath.ts';

export interface InsertArrayValueOptions
{
  /**
   * If true, the value will only be inserted if it doesn't already exist in the array
   */
  skipIfExists?: boolean;
}

/**
 A convenience class for working with JSONC files — based on the Microsoft JSONC parser (https://github.com/microsoft/node-jsonc-parser) but more convenient to use for certain specific tasks.
 */
export class JSONCTweaker
{
  /**
   Initialize a new tweaker from the given text
   */
  static fromText(input: string): JSONCTweaker
  {
    return new JSONCTweaker(input);
  }

  /**
   Initialize a new tweaker from the given file — this means every change will write back to the file. There are no coalesced writes.
   */
  static fromFile(input: string): JSONCTweaker
  {
    return new JSONCTweaker(input, true);
  }

  private _jsonc: string;
  private _filePath?: string;

  /**
   Returns the current JSONC text
   */
  get jsonc(): string
  {
    return this._jsonc;
  }

  /**
   Initialize a new tweaker from the given text or file. Note that there are no coalesced writes, so every successful edit will write back to the file. (If you need granular control of filesystem writees, then use the text mode and deal with the file yourself.)
   */
  constructor(input: string, isFilePath = false)
  {
    if (isFilePath)
    {
      this._filePath = input;
      this._jsonc = Deno.readTextFileSync(input);
    }
    else
    {
      this._jsonc = input;
    }
  }

  private async _writeIfFile(): Promise<void>
  {
    if (this._filePath)
    {
      await Deno.writeTextFile(this._filePath, this._jsonc);
    }
  }

  /**
   Insert the given value into the array at the given path. If the path does not exist in the receiver's JSONC, a new array will be created. Otherwise, the value will be inserted into the existing array.

   Returns true if the edit succeeded, false otherwise. You can inspect the `outErrors` parameter to find out why the edit failed (maybe) — it may contain errors from the underlying Microsoft JSONC parser, or errors from this module.
   */
  async insertArrayValue(
    pathToArray: Segment[],
    value: string,
    outErrors?: Array<ParseError | Error>,
    options: InsertArrayValueOptions = {},
  ): Promise<boolean>
  {
    const parseErrors: ParseError[] = [];

    const parsed = parse(this._jsonc, parseErrors);
    const existing = getValueAtPath(parsed, pathToArray) as string[] | undefined;
    if (existing === undefined)
    {
      const err = new Error(`Path does not exist: ${pathToArray.join('.')}`);
      if (outErrors)
      {
        outErrors.push(err);
      }
      return false;
    }
    if (!Array.isArray(existing))
    {
      const err = new Error(`Path is not an array: ${pathToArray.join('.')}`);
      if (outErrors)
      {
        outErrors.push(err);
      }
      return false;
    }

    if (options.skipIfExists && existing.includes(value))
    {
      return true;
    }

    const insertionIndex = getAlphabeticalInsertionIndex(value, existing);

    try
    {
      const modifyResult = modify(this._jsonc, [...pathToArray, insertionIndex], value, {
        formattingOptions: DefaultFormattingOptions,
        isArrayInsertion: true,
      });
      this._jsonc = applyEdits(this._jsonc, modifyResult);
      await this._writeIfFile();
      return true;
    }
    catch (error)
    {
      if (outErrors)
      {
        outErrors.push(
          error instanceof Error ? error : new Error(`Edit operation failed for ${pathToArray.join('.')}`),
        );
      }
      return false;
    }
  }

  /**
   Insert the given value into the array at the given path only if it doesn't already exist. This is a convenience wrapper around insertArrayValue with skipIfExists set to true.
   */
  async insertArrayValueIfNotPresent(
    pathToArray: Segment[],
    value: string,
    outErrors?: Array<ParseError | Error>,
  ): Promise<boolean>
  {
    return await this.insertArrayValue(pathToArray, value, outErrors, { skipIfExists: true });
  }

  /**
   Get the value at the specified path in the JSONC document. Returns undefined if the path doesn't lead to a value.
   */
  getValue(path: Segment[]): unknown
  {
    const parseErrors: ParseError[] = [];
    const parsed = parse(this._jsonc, parseErrors);
    return getValueAtPath(parsed, path);
  }
}
