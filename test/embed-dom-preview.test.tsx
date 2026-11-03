/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';
import MDEditorNoHighlight from '../core/src/index.nohighlight';

const editors = [
  ['default', MDEditor],
  ['common', MDEditorCommon],
  ['nohighlight', MDEditorNoHighlight],
] as const;

const withEmbed = '<blockquote class="twitter-tweet">Embedded post</blockquote>\n<script type="text/plain"></script>';
const withoutBlockquote = '<script type="text/plain"></script>';
const previewOptions = { skipHtml: false };

describe.each(editors)('%s editor with third-party embeds', (_name, Editor) => {
  it.each(['live', 'preview'] as const)('handles a removed blockquote in %s mode', (mode) => {
    const { container, rerender } = render(
      <Editor value={withEmbed} preview={mode} previewOptions={previewOptions} visibleDragbar={false} />,
    );
    const wrapper = container.querySelector('.w-md-editor-preview') as HTMLDivElement;
    const blockquote = wrapper.querySelector('blockquote');
    expect(blockquote).not.toBeNull();

    // Embed libraries replace the original quote with their own nodes.
    blockquote!.remove();
    wrapper.scrollTop = 32;

    expect(() =>
      rerender(
        <Editor value={withoutBlockquote} preview={mode} previewOptions={previewOptions} visibleDragbar={false} />,
      ),
    ).not.toThrow();
    expect(wrapper.querySelector('blockquote')).toBeNull();
    expect(container.querySelector('.w-md-editor-preview')).toBe(wrapper);
    expect(wrapper.scrollTop).toBe(32);
  });

  it('handles a blockquote moved outside the React preview', () => {
    const { container, rerender } = render(
      <Editor value={withEmbed} previewOptions={previewOptions} visibleDragbar={false} />,
    );
    const blockquote = container.querySelector('.w-md-editor-preview blockquote');
    expect(blockquote).not.toBeNull();
    const externalContainer = document.createElement('div');
    document.body.appendChild(externalContainer);
    externalContainer.appendChild(blockquote!);

    try {
      expect(() =>
        rerender(<Editor value="Ordinary text" previewOptions={previewOptions} visibleDragbar={false} />),
      ).not.toThrow();
      expect(container.querySelector('.w-md-editor-preview')).toHaveTextContent('Ordinary text');
    } finally {
      externalContainer.remove();
    }
  });

  it('keeps the existing preview DOM for ordinary markdown updates', () => {
    const { container, rerender } = render(<Editor value="First" visibleDragbar={false} />);
    const preview = container.querySelector('.w-md-editor-preview .wmde-markdown');
    expect(preview).not.toBeNull();

    rerender(<Editor value="Second" visibleDragbar={false} />);
    expect(container.querySelector('.w-md-editor-preview .wmde-markdown')).toBe(preview);
    expect(preview).toHaveTextContent('Second');
  });
});
