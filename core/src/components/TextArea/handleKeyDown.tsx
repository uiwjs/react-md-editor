import { insertTextAtPosition } from '../../utils/InsertTextAtPosition';
import { TextAreaTextApi } from '../../commands';
import { insertBeforeEachLine } from '../../commands/list';

/**
 * - `13` - `Enter`
 * - `9` - `Tab`
 */
function stopPropagation(e: KeyboardEvent | React.KeyboardEvent<HTMLTextAreaElement>) {
  e.stopPropagation();
  e.preventDefault();
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
    (/^(-|\*)\s/.test(currentLineStr) || /^\d+.\s/.test(currentLineStr))
  ) {
    /**
     * `13` - `Enter`
     */
    stopPropagation(e);
    let startStr = '\n- ';

    if (currentLineStr.startsWith('*')) {
      startStr = '\n* ';
    }

    if (currentLineStr.startsWith('- [ ]')) {
      startStr = '\n- [ ] ';
    } else if (currentLineStr.startsWith('- [X]')) {
      startStr = '\n- [X] ';
    }

    if (/^\d+.\s/.test(currentLineStr)) {
      startStr = `\n${parseInt(currentLineStr) + 1}. `;
    }
    return insertTextAtPosition(target, startStr);
  }
}
