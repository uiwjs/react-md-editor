import React from 'react';
import { NodeType, MarkdownAbstractSyntaxTree } from 'react-markdown';

export default function allowNode(node: any, index: number, parent: NodeType) {
  const nodeany: MarkdownAbstractSyntaxTree = node;
  if (nodeany.type === 'html') {
    // filter style
    node.value = node.value.replace(/<(style|script|link|input|form)(.*)>/g, '&lt;$1$2&gt')
      .replace(/<\/(.*)(style|script|link|input|form)(.*)>/g, '&lt;/$1$2$3&gt')
  }
  return node;
}
