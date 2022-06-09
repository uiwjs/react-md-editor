import React, { useContext, useEffect, useMemo } from 'react';
import { rehype } from 'rehype';
import rehypePrism from 'rehype-prism-plus';
import { IProps } from '../../Editor';
import { EditorContext } from '../../Context';

export interface MarkdownProps extends IProps, React.HTMLAttributes<HTMLPreElement> {}

export default function Markdown(props: MarkdownProps) {
  const { prefixCls } = props;
  const { markdown = '', dispatch } = useContext(EditorContext);
  const preRef = React.createRef<HTMLPreElement>();
  useEffect(() => {
    if (preRef.current && dispatch) {
      dispatch({ textareaPre: preRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  function html2Escape(sHtml: string) {
    return sHtml
      .replace(/```(tsx?|jsx?|html|xml)(.*)\s+([\s\S]*?)(\s.+)?```/g, (str: string) => {
        return str.replace(
          /[<&"]/g,
          (c: string) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' } as Record<string, string>)[c]),
        );
      })
      .replace(
        /[<&"]/g,
        (c: string) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' } as Record<string, string>)[c]),
      );
  }

  return useMemo(() => {
    if (!markdown) {
      return <pre children={markdown || ''} ref={preRef} className={`${prefixCls}-text-pre wmde-markdown-color`} />;
    }
    const str = rehype()
      .data('settings', { fragment: true })
      .use(rehypePrism, { ignoreMissing: true })
      .processSync(
        `<pre class="language-markdown ${prefixCls}-text-pre wmde-markdown-color"><code class="language-markdown">${html2Escape(
          markdown,
        )}\n</code></pre>`,
      );
    return React.createElement('div', {
      className: 'wmde-markdown-color',
      dangerouslySetInnerHTML: { __html: str.value as string },
    });
  }, [markdown, preRef, prefixCls]);
}
