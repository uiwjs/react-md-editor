import { createRoot } from 'react-dom/client';
import MarkdownPreviewExample from '@uiw/react-markdown-preview-example';
import data from '@uiw/react-md-editor/README.md';
import ExampleDemo from './Example';
import { ReactComponent as Banner } from './banner.svg';
import { Badges, ProductHunt, Version } from './Button';

const Github = MarkdownPreviewExample.Github;
const Example = MarkdownPreviewExample.Example;

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <MarkdownPreviewExample
    source={data.source}
    components={data.components}
    data={data.data}
    logo={<Banner style={{ maxWidth: 950 }} />}
    description="A simple markdown editor with preview, implemented with React.js and TypeScript."
    version={`v${VERSION}`}
    exampleProps={{
      style: {
        flexDirection: 'column',
      },
    }}
  >
    <Github href="https://github.com/uiwjs/react-md-editor" />
    <Example>
      <Badges />
      <ExampleDemo mdStr={data.source} />
    </Example>
    <Version />
    <ProductHunt />
  </MarkdownPreviewExample>,
);
