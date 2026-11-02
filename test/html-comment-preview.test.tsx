/**
 * @jest-environment jsdom
 */
import React from 'react';
import { render } from '@testing-library/react';
import rehypeSanitize from 'rehype-sanitize';
import MDEditor from '../core/src';
import MDEditorCommon from '../core/src/index.common';
import MDEditorNoHighlight from '../core/src/index.nohighlight';

const cases = [
  ['doctype and unfinished HTML comment', '<!DOCTYPE html><!-- <html>\n  <head>\n'],
  ['other tags inside an unfinished comment', '<!DOCTYPE html><!-- <div>\n  <span>\n'],
  ['unfinished comment without doctype', '<!-- <html>\n  <head>\n'],
] as const;

const editors = [
  ['default', MDEditor],
  ['common', MDEditorCommon],
  ['nohighlight', MDEditorNoHighlight],
] as const;

describe.each(editors)('%s Markdown preview', (_name, Editor) => {
  it.each(cases)('renders %s without crashing', (_label, source) => {
    expect(() => render(<Editor.Markdown source={source} />)).not.toThrow();
  });
  it.each(cases)('renders %s with rehype-sanitize', (_label, source) => {
    expect(() => render(<Editor.Markdown source={source} rehypePlugins={[rehypeSanitize]} />)).not.toThrow();
  });
});
