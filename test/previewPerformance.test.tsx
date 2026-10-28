/**
 * @jest-environment jsdom
 */
import React from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import { createMDEditor } from '../core/src/Editor.factory';
import TextArea from '../core/src/components/TextArea/index.nohighlight';

describe('preview scheduling', () => {
  let clock: number;
  let renderMs: number;
  let Editor: ReturnType<typeof createMDEditor>;

  beforeEach(() => {
    jest.useFakeTimers();
    clock = 0;
    renderMs = 0;
    jest.spyOn(performance, 'now').mockImplementation(() => clock);
    Editor = createMDEditor({
      TextArea,
      MarkdownPreview: ({ source }: { source: string }) => {
        clock += renderMs;
        return <div data-testid="preview">{source}</div>;
      },
    });
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.useRealTimers();
  });

  function Controlled() {
    const [value, setValue] = React.useState('first');
    return <Editor value={value} onChange={(next) => setValue(next || '')} />;
  }

  it('keeps fast previews in sync without a timer', () => {
    const { container, getByTestId } = render(<Controlled />);
    fireEvent.change(container.querySelector('textarea')!, { target: { value: 'latest' } });
    expect(getByTestId('preview').textContent).toEqual('latest');
    expect(jest.getTimerCount()).toEqual(0);
  });

  it('updates the textarea immediately and lets a slow preview catch up to the latest edit', () => {
    renderMs = 100;
    const { container, getByTestId } = render(<Controlled />);
    const textarea = container.querySelector('textarea')!;
    fireEvent.change(textarea, { target: { value: 'second' } });
    expect(textarea.value).toEqual('second');
    expect(getByTestId('preview').textContent).toEqual('first');
    act(() => jest.advanceTimersByTime(90));
    fireEvent.change(textarea, { target: { value: 'latest' } });
    act(() => jest.advanceTimersByTime(90));
    expect(textarea.value).toEqual('latest');
    expect(getByTestId('preview').textContent).toEqual('first');
    act(() => jest.advanceTimersByTime(10));
    expect(getByTestId('preview').textContent).toEqual('latest');
  });

  it('caps the delay and clears pending work on unmount', () => {
    renderMs = 2000;
    const { container, getByTestId, unmount } = render(<Controlled />);
    fireEvent.change(container.querySelector('textarea')!, { target: { value: 'second' } });
    act(() => jest.advanceTimersByTime(499));
    expect(getByTestId('preview').textContent).toEqual('first');
    act(() => jest.advanceTimersByTime(1));
    expect(getByTestId('preview').textContent).toEqual('second');
    fireEvent.change(container.querySelector('textarea')!, { target: { value: 'third' } });
    expect(jest.getTimerCount()).toBeGreaterThan(0);
    unmount();
    expect(jest.getTimerCount()).toEqual(0);
  });
});
