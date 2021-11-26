import Codesandbox from '@uiw/react-codesandbox';

const code = `import React, { useState } from "react";
import ReactDOM from "react-dom";
import MDEditor from "@uiw/react-md-editor";
import mermaid from "mermaid";

const mdMermaid = \`The following are some examples of the diagrams, charts and graphs that can be made using Mermaid and the Markdown-inspired text specific to it. 

\\\`\\\`\\\`mermaid
graph TD
A[Hard] -->|Text| B(Round)
B --> C{Decision}
C -->|One| D[Result 1]
C -->|Two| E[Result 2]
\\\`\\\`\\\`

\\\`\\\`\\\`mermaid
sequenceDiagram
Alice->>John: Hello John, how are you?
loop Healthcheck
    John->>John: Fight against hypochondria
end
Note right of John: Rational thoughts!
John-->>Alice: Great!
John->>Bob: How about you?
Bob-->>John: Jolly good!
\\\`\\\`\\\`
\`;

const getCode = (arr = []) => arr.map(dt => {
  if (typeof dt === 'string') {
    return dt;
  }
  if (dt.props && dt.props.children) {
    return getCode(dt.props.children);
  }
}).filter(Boolean).join('');

export default function App() {
  const [value, setValue] = useState(mdMermaid)
  return (
    <MDEditor
      onChange={(newValue = '') => setValue(newValue)}
      textareaProps={{
        placeholder: 'Please enter Markdown text',
      }}
      height={500}
      value={value}
      previewOptions={{
        components: {
          code: ({ inline, children = [], className, ...props }) => {
            const code = getCode(children);
            if (
              typeof code === 'string' &&
              typeof className === 'string' &&
              /^language-mermaid/.test(className.toLocaleLowerCase())
            ) {
              const Elm = document.createElement("div");
              Elm.id = "demo";
              const svg = mermaid.render("demo", code);
              return <code dangerouslySetInnerHTML={{ __html: svg }} />
            }
            return <code className={String(className)}>{children}</code>;
          },
        },
      }}
    />
  );
}

ReactDOM.render(<App />, document.getElementById("container"));
`;

export default function ExampleMermaid() {
  return (
    <div style={{ height: 500 }}>
      <Codesandbox
        embed
        query="view=split&hidenavigation=1"
        files={{
          'package.json': {
            content: {
              dependencies: {
                '@uiw/react-md-editor': 'latest',
                react: '17.0.2',
                mermaid: '8.13.3',
                'react-dom': '17.0.2',
              },
            },
          },
          'index.js': {
            content: code,
          },
          'index.html': {
            content: `<div id="container"></div>`,
          },
        }}
      />
    </div>
  );
}
