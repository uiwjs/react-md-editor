import insertText from '../../utils/InsertTextAtPosition';
import { TextAreaTextApi } from '../../commands';
import { insertBeforeEachLine } from '../../commands/list';


export interface IHotkeyOptions {
  tabSize?: number;
}

/**
 * - `13` - `Enter`
 * - `9` - `Tab`
 */
function stopPropagation(e: React.KeyboardEvent<HTMLTextAreaElement>) {
  e.stopPropagation();
  e.preventDefault();
}

export default (options: IHotkeyOptions, e: React.KeyboardEvent<HTMLTextAreaElement>) => {
  const target = e.target as HTMLTextAreaElement;
  const starVal = target.value.substr(0, target.selectionStart);
  const valArr = starVal.split('\n');
  const currentLineStr = valArr[valArr.length - 1];
  const textArea = new TextAreaTextApi(target);
  if (!options.tabSize) {
    options.tabSize = 2;
  }
  /**
   * `9` - `Tab`
   */
  if (e.keyCode === 9) {
    stopPropagation(e);
    const space = new Array(options.tabSize + 1).join(' ');
    let val = space;
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

      const modifiedTextObj = insertBeforeEachLine(modifiedText, space);
      textArea.replaceSelection(modifiedTextObj.modifiedText);
      textArea.setSelectionRange({
        start: newStarNum + options.tabSize,
        end: newStarNum + oldSelectText.length + (modifiedTextLine.length * options.tabSize),
      });
    } else {
      return insertText(target, val);
    }
  } else if (e.keyCode === 13 && /^-\s/.test(currentLineStr)) {
    /**
     * `13` - `Enter`
     */
    stopPropagation(e);
    return insertText(target, `\n- `);
  }
}