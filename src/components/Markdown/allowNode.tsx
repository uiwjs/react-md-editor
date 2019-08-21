import React from 'react';
import { NodeType, MarkdownAbstractSyntaxTree } from 'react-markdown';

export default function allowNode(node: any, index: number, parent: NodeType) {
  const nodeany: MarkdownAbstractSyntaxTree = node;
  if (nodeany.type === 'html') {
    // filter style
    node.value = node.value.replace(/<((style|script|link|input|form)|\/(style|script|link|input|form))(\s?[^\>]*\>)/g, (a: string) => {
      return a.replace(/[<>]/g, (e: string) => (({ '<': '&lt;', '>': '&gt;' } as { [key: string]: string })[e]))
    });
  }
  return true;
}
