import MarkdownPreview from '@uiw/react-markdown-preview/nohighlight';
import TextArea from './components/TextArea/index.nohighlight';
import { createMDEditor } from './Editor.factory';

export type { RefMDEditor } from './Editor.factory';

export default createMDEditor({ MarkdownPreview, TextArea });
