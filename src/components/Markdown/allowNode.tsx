import React from 'react';
import { NodeType, MarkdownAbstractSyntaxTree } from 'react-markdown';

export default function allowNode(node: any, index: number, parent: NodeType) {
  const nodeany: MarkdownAbstractSyntaxTree = node;
  if (nodeany.type === 'html') {
    // filter style
    node.value = node.value.replace(/<style/g, '&lt;style').replace(/<\/style>/g, '&lt;style&gt;');
  }
  return node;
}
