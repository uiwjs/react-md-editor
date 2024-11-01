import React, { useContext, useEffect, useState } from 'react';
import { rehype } from 'rehype';
import rehypePrism from 'rehype-prism-plus';
import { IProps } from '../../Types';
import { EditorContext } from '../../Context';

function html2Escape(sHtml: string) {
  return (
    sHtml
      .replace(
        /[<&"]/g,
        (c: string) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }) as Record<string, string>)[c],
      )
  );
}

export interface MarkdownProps extends IProps, React.HTMLAttributes<HTMLPreElement> {}

export default function Markdown(props: MarkdownProps) {
  const { prefixCls } = props;
  const { markdown = '', highlightEnable, dispatch } = useContext(EditorContext);
  const preRef = React.createRef<HTMLPreElement>();
  const [mdStr, setMdStr] = useState('');

  useEffect(() => {
    if (preRef.current && dispatch) {
      dispatch({ textareaPre: preRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    async function processMarkdown() {
      if (!markdown) {
        setMdStr('');
        return;
      }

      let mdStr = `<pre class="language-markdown ${prefixCls}-text-pre wmde-markdown-color"><code class="language-markdown">${html2Escape(
        String.raw`${markdown}`,
      )}\n</code></pre>`;

      if (highlightEnable) {
        try {
          mdStr = await rehype()
            .data('settings', { fragment: true })
            // https://github.com/uiwjs/react-md-editor/issues/593
            // @ts-ignore
            .use(rehypePrism, { ignoreMissing: true })
            .process(mdStr)
            .then((file) => file.toString());
        } catch (error) {}
      }

      setMdStr(mdStr);
    }

    processMarkdown();
  }, [markdown, highlightEnable, prefixCls]);

  return React.createElement('div', {
    className: 'wmde-markdown-color',
    dangerouslySetInnerHTML: { __html: mdStr || '' },
  });
}
