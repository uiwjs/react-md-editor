import Markdown from './Markdown.common';
import { createTextArea } from './factory';

export type { ITextAreaProps, RenderTextareaHandle, TextAreaRef } from './factory';

export default createTextArea({ Markdown, useMinHeight: true });
