import type { FormattingOptions } from 'jsonc-parser';

/**
 Default formatting options for JSONC, as preferred by @axhxrx
 */
export const DefaultFormattingOptions: FormattingOptions = {
  tabSize: 2,
  insertSpaces: true,
  insertFinalNewline: true,
  eol: '\n',
  // insertSpaces: true, // NO, this means spaces around braces
  // keepLines: true,
};
