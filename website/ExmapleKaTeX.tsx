import { useState } from 'react';
import 'katex/dist/katex.css';
import katex from 'katex';
import MDEditor from '../';

const mdKaTeX = `This is to display the 
\`$$c = \\pm\\sqrt{a^2 + b^2}$$\`
 in one line

\`\`\`KaTeX
c = \\pm\\sqrt{a^2 + b^2}
\`\`\`

\`\`\`KaTeX
\\f\\relax{x} = \\int_{-\\infty}^\\infty
    \\f\\hat\\xi\\,e^{2 \\pi i \\xi x}
    \\,d\\xi
\`\`\`
`;

const ExmapleKaTeX = () => {
  const [value, setValue] = useState(mdKaTeX);
  return (
    <MDEditor
      value={value}
      onChange={(newValue) => setValue(newValue!)}
      textareaProps={{
        placeholder: 'Please enter Markdown text',
      }}
      previewOptions={{
        components: {
          code: ({ inline, children, className, ...props }) => {
            const txt = children[0] || '';
            if (inline) {
              if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                  throwOnError: false,
                });
                return <code dangerouslySetInnerHTML={{ __html: html }} />;
              }
              return <code>{txt}</code>;
            }
            if (
              typeof txt === 'string' &&
              typeof className === 'string' &&
              /^language-katex/.test(className.toLocaleLowerCase())
            ) {
              const html = katex.renderToString(txt, {
                throwOnError: false,
              });
              return <code dangerouslySetInnerHTML={{ __html: html }} />;
            }
            return <code className={String(className)}>{txt}</code>;
          },
        },
      }}
    />
  );
};

export default ExmapleKaTeX;
