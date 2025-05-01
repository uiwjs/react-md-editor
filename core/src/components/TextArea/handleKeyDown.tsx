import { insertTextAtPosition } from '../../utils/InsertTextAtPosition';
import { insertBeforeEachLine, selectLine } from '../../utils/markdownUtils';
import { TextAreaTextApi } from '../../commands/';

/**
 * - `13` - `Enter`
 * - `9` - `Tab`
 */
function stopPropagation(e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>) {
  e.stopPropagation();
  e.preventDefault();
}

function handleLineMove(e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>, direction: number) {
  stopPropagation(e);
  const target = e.target as HTMLTextAreaElement;
  const textArea = new TextAreaTextApi(target);
  let selection = { start: target.selectionStart, end: target.selectionEnd };
  selection = selectLine({ text: target.value, selection });
  if ((direction < 0 && selection.start <= 0) || (direction > 0 && selection.end >= target.value.length)) {
    return;
  }

  const blockText = target.value.slice(selection.start, selection.end);
  if (direction < 0) {
    const prevLineSelection = selectLine({
      text: target.value,
      selection: { start: selection.start - 1, end: selection.start - 1 },
    });
    const prevLineText = target.value.slice(prevLineSelection.start, prevLineSelection.end);
    textArea.setSelectionRange({ start: prevLineSelection.start, end: selection.end });
    insertTextAtPosition(target, `${blockText}\n${prevLineText}`);
    textArea.setSelectionRange({ start: prevLineSelection.start, end: prevLineSelection.start + blockText.length });
  } else {
    const nextLineSelection = selectLine({
      text: target.value,
      selection: { start: selection.end + 1, end: selection.end + 1 },
    });
    const nextLineText = target.value.slice(nextLineSelection.start, nextLineSelection.end);
    textArea.setSelectionRange({ start: selection.start, end: nextLineSelection.end });
    insertTextAtPosition(target, `${nextLineText}\n${blockText}`);
    textArea.setSelectionRange({ start: nextLineSelection.end - blockText.length, end: nextLineSelection.end });
  }
}

export default function handleKeyDown(
  e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>,
  tabSize: number = 2,
  defaultTabEnable: boolean = false,
) {
  const target = e.target as HTMLTextAreaElement;
  const starVal = target.value.substr(0, target.selectionStart);
  const valArr = starVal.split('\n');
  const currentLineStr = valArr[valArr.length - 1];
  const textArea = new TextAreaTextApi(target);

  /**
   * `9` - `Tab`
   */
  if (!defaultTabEnable && e.code && e.code.toLowerCase() === 'tab') {
    stopPropagation(e);
    const space = new Array(tabSize + 1).join('  ');
    if (target.selectionStart !== target.selectionEnd) {
      const _star = target.value.substring(0, target.selectionStart).split('\n');
      const _end = target.value.substring(0, target.selectionEnd).split('\n');
      const modifiedTextLine: string[] = [];
      _end.forEach((item, idx) => {
        if (item !== _star[idx]) {
          modifiedTextLine.push(item);
        }
      });
      const modifiedText = modifiedTextLine.join('\n');
      const oldSelectText = target.value.substring(target.selectionStart, target.selectionEnd);
      const newStarNum = target.value.substring(0, target.selectionStart).length;

      textArea.setSelectionRange({
        start: target.value.indexOf(modifiedText),
        end: target.selectionEnd,
      });

      const modifiedTextObj = insertBeforeEachLine(modifiedText, e.shiftKey ? '' : space);

      let text = modifiedTextObj.modifiedText;
      if (e.shiftKey) {
        text = text
          .split('\n')
          .map((item) => item.replace(new RegExp(`^${space}`), ''))
          .join('\n');
      }
      textArea.replaceSelection(text);

      let startTabSize = e.shiftKey ? -tabSize : tabSize;
      let endTabSize = e.shiftKey ? -modifiedTextLine.length * tabSize : modifiedTextLine.length * tabSize;

      textArea.setSelectionRange({
        start: newStarNum + startTabSize,
        end: newStarNum + oldSelectText.length + endTabSize,
      });
    } else {
      return insertTextAtPosition(target, space);
    }
  } else if (
    e.keyCode === 13 &&
    e.code.toLowerCase() === 'enter' &&
    (/^(-|\*)\s/.test(currentLineStr) || /^\d+.\s/.test(currentLineStr)) &&
    !e.shiftKey
  ) {
    /**
     * `13` - `Enter`
     */
    stopPropagation(e);
    let startStr = '\n- ';

    if (currentLineStr.startsWith('*')) {
      startStr = '\n* ';
    }

    if (
      currentLineStr.startsWith('- [ ]') ||
      currentLineStr.startsWith('- [X]') ||
      currentLineStr.startsWith('- [x]')
    ) {
      startStr = '\n- [ ] ';
    }

    if (/^\d+.\s/.test(currentLineStr)) {
      startStr = `\n${parseInt(currentLineStr) + 1}. `;
    }
    return insertTextAtPosition(target, startStr);
  } else if (e.code && e.code.toLowerCase() === 'keyd' && e.ctrlKey) {
    // Duplicate lines
    stopPropagation(e);
    let selection = { start: target.selectionStart, end: target.selectionEnd };
    const savedSelection = selection;
    selection = selectLine({ text: target.value, selection });
    const textToDuplicate = target.value.slice(selection.start, selection.end);
    textArea.setSelectionRange({ start: selection.end, end: selection.end });
    insertTextAtPosition(target, `\n${textToDuplicate}`);
    textArea.setSelectionRange({ start: savedSelection.start, end: savedSelection.end });
  } else if (e.code && e.code.toLowerCase() === 'arrowup' && e.altKey) {
    handleLineMove(e, -1);
  } else if (e.code && e.code.toLowerCase() === 'arrowdown' && e.altKey) {
    handleLineMove(e, 1);
  }
}
