/**
 * @jest-environment jsdom
 */
import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import { createMDEditor } from '../core/src/Editor.factory';
import TextArea from '../core/src/components/TextArea/index.nohighlight';

const Editor = createMDEditor({
  TextArea,
  MarkdownPreview: ({ source, onScroll }: { source: string; onScroll?: React.UIEventHandler<HTMLDivElement> }) => (
    <div data-testid="markdown-preview" onScroll={onScroll}>
      {source}
    </div>
  ),
});

function sizeScrollArea(element: HTMLElement, scrollHeight: number, offsetHeight: number) {
  Object.defineProperty(element, 'scrollHeight', { configurable: true, value: scrollHeight });
  Object.defineProperty(element, 'offsetHeight', { configurable: true, value: offsetHeight });
}

function getScrollAreas(container: HTMLElement) {
  const input = container.querySelector('.w-md-editor-area') as HTMLDivElement;
  const preview = container.querySelector('.w-md-editor-preview') as HTMLDivElement;
  expect(input).not.toBeNull();
  expect(preview).not.toBeNull();
  sizeScrollArea(input, 1000, 200);
  sizeScrollArea(preview, 600, 200);
  return { input, preview };
}

describe('live preview scroll synchronization', () => {
  it('scrolls the input when the preview wrapper scrolls', () => {
    const { container } = render(<Editor value={'# Heading\n\nText'} />);
    const { input, preview } = getScrollAreas(container);
    preview.scrollTop = 200;
    fireEvent.scroll(preview);
    expect(input.scrollTop).toBe(400);
  });

  it('still scrolls the preview when the input scrolls', () => {
    const { container } = render(<Editor value={'# Heading\n\nText'} />);
    const { input, preview } = getScrollAreas(container);
    fireEvent.mouseOver(input);
    input.scrollTop = 600;
    fireEvent.scroll(input);
    expect(preview.scrollTop).toBe(300);
  });

  it('keeps the panes independent when scrolling is disabled', () => {
    const { container } = render(<Editor value="Text" enableScroll={false} />);
    const { input, preview } = getScrollAreas(container);
    preview.scrollTop = 200;
    fireEvent.scroll(preview);
    expect(input.scrollTop).toBe(0);
  });

  it('does not move the input when the preview has no overflow', () => {
    const { container } = render(<Editor value="Text" />);
    const { input, preview } = getScrollAreas(container);
    sizeScrollArea(preview, 200, 200);
    input.scrollTop = 120;
    preview.scrollTop = 0;
    fireEvent.scroll(preview);
    expect(input.scrollTop).toBe(120);
  });
});
