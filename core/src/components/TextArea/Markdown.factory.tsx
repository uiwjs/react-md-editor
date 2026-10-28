import React, { useContext, useEffect, useMemo, useRef } from 'react';
import { rehype } from 'rehype';
import type rehypePrismPlus from 'rehype-prism-plus';
import { type IProps } from '../../Types';
import { EditorContext } from '../../Context';
import { splitBlocks } from './splitBlocks';

/**
 * Prism's markdown grammar takes quadratic time on long lines, so a single base64 image
 * line can block the editor for minutes. Blocks with such a line are shown uncoloured.
 */
const MAX_HIGHLIGHT_LINE_LENGTH = 1000;

export interface MarkdownProps extends IProps, React.HTMLAttributes<HTMLPreElement> {}

type HighlightedBlock = {
  id: number;
  html: string;
};

function html2Escape(sHtml: string) {
  return sHtml.replace(
    /[<&"]/g,
    (c: string) => (({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }) as Record<string, string>)[c],
  );
}

function hasLongLine(text: string) {
  let lineStart = 0;
  while (lineStart <= text.length) {
    const lineEnd = text.indexOf('\n', lineStart);
    const end = lineEnd === -1 ? text.length : lineEnd;
    if (end - lineStart > MAX_HIGHLIGHT_LINE_LENGTH) {
      return true;
    }
    lineStart = end + 1;
  }
  return false;
}

function getCodeInnerHtml(html: string) {
  const codeStart = html.indexOf('<code');
  const contentStart = html.indexOf('>', codeStart) + 1;
  const contentEnd = html.lastIndexOf('</code>');
  return html.slice(contentStart, contentEnd);
}

const MarkdownBlock = React.memo(function MarkdownBlock(props: { html: string }) {
  return React.createElement('span', { dangerouslySetInnerHTML: { __html: props.html } });
});

export function createMarkdown(rehypePrism: typeof rehypePrismPlus) {
  const processor = rehype()
    .data('settings', { fragment: true })
    // https://github.com/uiwjs/react-md-editor/issues/593
    // @ts-ignore
    .use(rehypePrism, { ignoreMissing: true });

  function highlightBlock(block: string) {
    const escaped = html2Escape(block);
    if (hasLongLine(block)) {
      return escaped;
    }
    try {
      const html = processor.processSync(`<pre><code class="language-markdown">${escaped}</code></pre>`).toString();
      return getCodeInnerHtml(html);
    } catch (error) {
      return escaped;
    }
  }

  /**
   * Highlighting runs per block, and blocks whose text did not change reuse their cached
   * HTML and DOM, so typing in a large document only re-highlights the edited block.
   * https://github.com/uiwjs/react-md-editor/issues/620
   */
  return function Markdown(props: MarkdownProps) {
    const { prefixCls } = props;
    const { markdown = '', highlightEnable, dispatch } = useContext(EditorContext);
    const preRef = useRef<HTMLPreElement>(null);
    const cacheRef = useRef(new Map<string, HighlightedBlock>());
    const nextIdRef = useRef(0);
    useEffect(() => {
      if (preRef.current && dispatch) {
        dispatch({ textareaPre: preRef.current });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const blocks = useMemo(() => {
      if (!highlightEnable) {
        cacheRef.current = new Map();
        return [];
      }
      const cache = new Map<string, HighlightedBlock>();
      const occurrences = new Map<string, number>();
      const result = splitBlocks(markdown).map((block) => {
        let highlighted = cacheRef.current.get(block) || cache.get(block);
        if (!highlighted) {
          highlighted = { id: nextIdRef.current++, html: highlightBlock(block) };
        }
        cache.set(block, highlighted);
        const occurrence = occurrences.get(block) || 0;
        occurrences.set(block, occurrence + 1);
        return { key: `${highlighted.id}-${occurrence}`, html: highlighted.html };
      });
      cacheRef.current = cache;
      return result;
    }, [markdown, highlightEnable]);

    if (!markdown) {
      return <pre ref={preRef} className={`${prefixCls}-text-pre wmde-markdown-color`} />;
    }

    return (
      <div className="wmde-markdown-color">
        <pre ref={preRef} className={`language-markdown ${prefixCls}-text-pre wmde-markdown-color`}>
          {highlightEnable ? (
            <code className="language-markdown code-highlight">
              {blocks.map((block) => (
                <MarkdownBlock key={block.key} html={block.html} />
              ))}
              {'\n'}
            </code>
          ) : (
            <code className="language-markdown">{`${markdown}\n`}</code>
          )}
        </pre>
      </div>
    );
  };
}
