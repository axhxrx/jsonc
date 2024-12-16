import * as JSONCParser from 'jsonc-parser';
import { DefaultFormattingOptions } from './DefaultFormattingOptions.ts';

/**
 This class implements the JSONC formatter. I'ts just a convenience wrapper around the [Microsoft JSONC parser](https://github.com/microsoft/node-jsonc-parser).
 */
export class JsoncFormatter
{
  /**
   Formats the given JSONC text, returning the formatted text. Doesn't modify the input string.
   */
  format(jsonc: string): string
  {
    const editResult = JSONCParser.format(jsonc, undefined, DefaultFormattingOptions);
    const editedText = JSONCParser.applyEdits(jsonc, editResult);
    return editedText;
  }

  /**
   Formats the given JSONC file, returning the formatted text. Modifies the file if `write` is true **and** the file contents are actually different from the formatted text.
   */
  formatFileSync(filePath: string, options = { write: true }): string
  {
    const fileContent = Deno.readFileSync(filePath);
    const fileText = new TextDecoder().decode(fileContent);
    const formattedText = this.format(fileText);
    const isChanged = fileText !== formattedText;
    if (isChanged && options.write)
    {
      Deno.writeTextFileSync(filePath, formattedText);
    }
    return formattedText;
  }
}
