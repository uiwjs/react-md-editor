import { useEffect, useRef } from 'react';
import CodeLayout from 'react-code-preview-layout';
import { getMetaId, isMeta, getURLParameters } from 'markdown-react-code-preview-loader';
import MDEditor from '@uiw/react-md-editor';
import rehypeIgnore from 'rehype-ignore';
import data from '@uiw/react-md-editor/README.md';
import { CodeComponent, ReactMarkdownNames } from 'react-markdown/lib/ast-to-react';

const CodePreview: CodeComponent | ReactMarkdownNames = ({ inline, node, ...props }) => {
  const $dom = useRef<HTMLDivElement>(null);
  const { 'data-meta': meta, ...rest } = props as any;

  useEffect(() => {
    if ($dom.current) {
      const parentElement = $dom.current.parentElement;
      if (parentElement && parentElement.parentElement) {
        parentElement.parentElement.replaceChild($dom.current, parentElement);
      }
    }
  }, [$dom]);

  if (inline || !isMeta(meta)) {
    return <code {...props} />;
  }
  const line = node.position?.start.line;
  const metaId = getMetaId(meta) || String(line);
  const Child = data.components[`${metaId}`];
  if (metaId && typeof Child === 'function') {
    const code = data.data[metaId].value || '';
    const param = getURLParameters(meta);
    return (
      <CodeLayout ref={$dom} toolbar={param.title || 'Example'} code={<pre {...rest} />} text={code}>
        <Child />
      </CodeLayout>
    );
  }
  return <code {...rest} />;
};

export default function Markdown() {
  return (
    <MDEditor.Markdown
      style={{ paddingTop: 30 }}
      disableCopy={true}
      rehypePlugins={[rehypeIgnore]}
      source={data.source}
      components={{
        code: CodePreview,
      }}
    />
  );
}
