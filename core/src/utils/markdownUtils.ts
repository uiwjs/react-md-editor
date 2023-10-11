import { TextRange } from '../commands';
import { TextAreaTextApi, ExecuteState } from '../commands';

export interface TextSection {
  text: string;
  selection: TextRange;
}

export function selectWord({
  text,
  selection,
  prefix,
  suffix = prefix,
}: {
  text: string;
  selection: TextRange;
  prefix: string;
  suffix?: string;
}): TextRange {
  let result = selection;
  if (text && text.length && selection.start === selection.end) {
    result = getSurroundingWord(text, selection.start);
  }
  if (result.start >= prefix.length && result.end <= text.length - suffix.length) {
    const selectedTextContext = text.slice(result.start - prefix.length, result.end + suffix.length);
    if (selectedTextContext.startsWith(prefix) && selectedTextContext.endsWith(suffix)) {
      return { start: result.start - prefix.length, end: result.end + suffix.length };
    }
  }
  return result;
}

export function selectLine({ text, selection }: TextSection): TextRange {
  const start = text.slice(0, selection.start).lastIndexOf('\n') + 1;
  let end = text.slice(selection.end).indexOf('\n') + selection.end;
  if (end === selection.end - 1) {
    end = text.length;
  }
  return { start, end };
}

/**
 *  Gets the number of line-breaks that would have to be inserted before the given 'startPosition'
 *  to make sure there's an empty line between 'startPosition' and the previous text
 */
export function getBreaksNeededForEmptyLineBefore(text = '', startPosition: number): number {
  if (startPosition === 0) return 0;

  // rules:
  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
  //      may need to insert 0, 1 or 2 breaks

  let neededBreaks = 2;
  let isInFirstLine = true;
  for (let i = startPosition - 1; i >= 0 && neededBreaks >= 0; i--) {
    switch (text.charCodeAt(i)) {
      case 32: // blank space
        continue;
      case 10: // line break
        neededBreaks--;
        isInFirstLine = false;
        break;
      default:
        return neededBreaks;
    }
  }
  return isInFirstLine ? 0 : neededBreaks;
}

/**
 *  Gets the number of line-breaks that would have to be inserted after the given 'startPosition'
 *  to make sure there's an empty line between 'startPosition' and the next text
 */
export function getBreaksNeededForEmptyLineAfter(text = '', startPosition: number): number {
  if (startPosition === text.length - 1) return 0;

  // rules:
  // - If we're in the first line, no breaks are needed
  // - Otherwise there must be 2 breaks before the previous character. Depending on how many breaks exist already, we
  //      may need to insert 0, 1 or 2 breaks

  let neededBreaks = 2;
  let isInLastLine = true;
  for (let i = startPosition; i < text.length && neededBreaks >= 0; i++) {
    switch (text.charCodeAt(i)) {
      case 32:
        continue;
      case 10: {
        neededBreaks--;
        isInLastLine = false;
        break;
      }
      default:
        return neededBreaks;
    }
  }
  return isInLastLine ? 0 : neededBreaks;
}

export function getSurroundingWord(text: string, position: number): TextRange {
  if (!text) throw Error("Argument 'text' should be truthy");

  const isWordDelimiter = (c: string) => c === ' ' || c.charCodeAt(0) === 10;

  // leftIndex is initialized to 0 because if selection is 0, it won't even enter the iteration
  let start = 0;
  // rightIndex is initialized to text.length because if selection is equal to text.length it won't even enter the interation
  let end = text.length;

  // iterate to the left
  for (let i = position; i - 1 > -1; i--) {
    if (isWordDelimiter(text[i - 1])) {
      start = i;
      break;
    }
  }

  // iterate to the right
  for (let i = position; i < text.length; i++) {
    if (isWordDelimiter(text[i])) {
      end = i;
      break;
    }
  }

  return { start, end };
}

export function executeCommand({
  api,
  selectedText,
  selection,
  prefix,
  suffix = prefix,
}: {
  api: TextAreaTextApi;
  selectedText: string;
  selection: TextRange;
  prefix: string;
  suffix?: string;
}) {
  if (
    selectedText.length >= prefix.length + suffix.length &&
    selectedText.startsWith(prefix) &&
    selectedText.endsWith(suffix)
  ) {
    api.replaceSelection(selectedText.slice(prefix.length, suffix.length ? -suffix.length : undefined));
    api.setSelectionRange({ start: selection.start - prefix.length, end: selection.end - prefix.length });
  } else {
    api.replaceSelection(`${prefix}${selectedText}${suffix}`);
    api.setSelectionRange({ start: selection.start + prefix.length, end: selection.end + prefix.length });
  }
}

export type AlterLineFunction = (line: string, index: number) => string;

/**
 * Inserts insertionString before each line
 */
export function insertBeforeEachLine(
  selectedText: string,
  insertBefore: string | AlterLineFunction,
): { modifiedText: string; insertionLength: number } {
  const lines = selectedText.split(/\n/);

  let insertionLength = 0;
  const modifiedText = lines
    .map((item, index) => {
      if (typeof insertBefore === 'string') {
        if (item.startsWith(insertBefore)) {
          insertionLength -= insertBefore.length;
          return item.slice(insertBefore.length);
        }
        insertionLength += insertBefore.length;
        return insertBefore + item;
      }
      if (typeof insertBefore === 'function') {
        if (item.startsWith(insertBefore(item, index))) {
          insertionLength -= insertBefore(item, index).length;
          return item.slice(insertBefore(item, index).length);
        }
        const insertionResult = insertBefore(item, index);
        insertionLength += insertionResult.length;
        return insertBefore(item, index) + item;
      }
      throw Error('insertion is expected to be either a string or a function');
    })
    .join('\n');

  return { modifiedText, insertionLength };
}
