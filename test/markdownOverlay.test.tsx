/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';

const base64Image = `![big](data:image/png;base64,${'iVBORw0KGgo'.repeat(20000)})`;
const markdown = `# Title\n\nSome **bold** text\n\n${base64Image}\n\n- item\n`;

describe.each([
  ['default', MDEditor],
  ['common', MDEditorCommon],
] as const)('%s highlighted overlay', (_name, Editor) => {
  function getOverlay(container: HTMLElement) {
    return container.querySelector('.w-md-editor-text-pre') as HTMLPreElement;
  }

  it('mirrors the textarea text and skips colouring blocks with very long lines', () => {
    const { container } = render(<Editor value={markdown} preview="edit" />);
    const overlay = getOverlay(container);
    expect(overlay.textContent).toEqual(`${markdown}\n`);
    expect(overlay.querySelector('.token.title')).not.toBeNull();
    expect(overlay.querySelector('.token.url')).toBeNull();
  });

  it('only replaces the edited block', () => {
    const Controlled = () => {
      const [value, setValue] = React.useState(markdown);
      return <Editor value={value} preview="edit" onChange={(next) => setValue(next || '')} />;
    };
    const { container } = render(<Controlled />);
    const overlay = getOverlay(container);
    const blocks = Array.from(overlay.querySelectorAll('code > span'));
    const edited = markdown.replace('Some **bold**', 'Some **bolder**');
    fireEvent.change(container.querySelector('textarea')!, { target: { value: edited } });
    const nextBlocks = Array.from(overlay.querySelectorAll('code > span'));
    expect(overlay.textContent).toEqual(`${edited}\n`);
    expect(nextBlocks[0]).toBe(blocks[0]);
    expect(nextBlocks[1]).not.toBe(blocks[1]);
    expect(nextBlocks[2]).toBe(blocks[2]);
  });

  it('keeps repeated blocks separate and preserves literal HTML as text', () => {
    const value = 'same **text**\n\nsame **text**\n\n<img src=x onerror="alert(1)">';
    const { container, rerender } = render(<Editor value={value} preview="edit" />);
    const overlay = getOverlay(container);
    expect(overlay.textContent).toEqual(`${value}\n`);
    expect(overlay.querySelector('img')).toBeNull();
    rerender(<Editor value={value.replace('same', 'changed')} preview="edit" />);
    expect(overlay.textContent).toEqual(`${value.replace('same', 'changed')}\n`);
  });

  it('updates the overlay when an initially empty editor receives content', () => {
    const { container, rerender } = render(<Editor value="" preview="edit" />);
    rerender(<Editor value={markdown} preview="edit" />);
    expect(getOverlay(container).textContent).toEqual(`${markdown}\n`);
    rerender(<Editor value="" preview="edit" />);
    expect(getOverlay(container).textContent).toEqual('');
  });
});
