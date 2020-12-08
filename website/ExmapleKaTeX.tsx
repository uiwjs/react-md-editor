import React from 'react';
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

export default () => {
  return (
    <MDEditor
      value={mdKaTeX}
      previewOptions={{
        renderers: {
          inlineCode: ({ children }) => {
            if (/^\$\$(.*)\$\$/.test(children)) {
              const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
                throwOnError: false,
              });
              return <code dangerouslySetInnerHTML={{ __html: html }} />
            }
            return children;
          },
          code: ({ language, value, children }) => {
            if (language && language.toLocaleLowerCase() === 'katex') {
              const html = katex.renderToString(value, {
                throwOnError: false
              });
              return (
                <pre>
                  <code dangerouslySetInnerHTML={{ __html: html }} />
                </pre>
              );
            }
            const props = {
              className: language ? `language-${language}` : '',
            }
            return (
              <pre {...props}>
                <code {...props}>{value}</code>
              </pre>
            );
          }
        }
      }}
    />
  );
}