import Markdown from './Markdown';
import { createTextArea } from './factory';

export type { ITextAreaProps, RenderTextareaHandle, TextAreaRef } from './factory';

export default createTextArea({ Markdown, useMinHeight: true });
