import MarkdownPreview from '@uiw/react-markdown-preview';
import TextArea from './components/TextArea/';
import { createMDEditor } from './Editor.factory';

export type { RefMDEditor } from './Editor.factory';

export default createMDEditor({ MarkdownPreview, TextArea });
