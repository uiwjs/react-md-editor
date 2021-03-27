import './index.less';
import './style/index.less';
import './components/DragBar/index.less';
import './components/TextArea/index.less';
import './components/Toolbar/Child.less';
import './components/Toolbar/index.less';

// We didn't import stylings in Editor.tsx.
import '@uiw/react-markdown-preview';

export * from './unstyled';

import MDEditor from './Editor';

export default MDEditor;
