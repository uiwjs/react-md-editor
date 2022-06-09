import * as React from 'react';
import { ICommand } from './';

export const codePreview: ICommand = {
  name: 'preview',
  keyCommand: 'preview',
  value: 'preview',
  buttonProps: { 'aria-label': 'Preview code', title: 'Preview code' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <polygon
        fill="currentColor"
        points="0 71.293 0 122 38.023 123 38.023 398 0 397 0 449.707 91.023 450.413 91.023 72.293"
      />
      <polygon
        fill="currentColor"
        points="148.023 72.293 520 71.293 520 122 200.023 124 200.023 397 520 396 520 449.707 148.023 450.413"
      />
    </svg>
  ),
  execute: () => {},
};

export const codeEdit: ICommand = {
  name: 'edit',
  keyCommand: 'preview',
  value: 'edit',
  buttonProps: { 'aria-label': 'Edit code', title: 'Edit code' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <polygon fill="currentColor" points="0 71.293 0 122 319 122 319 397 0 397 0 449.707 372 449.413 372 71.293" />
      <polygon
        fill="currentColor"
        points="429 71.293 520 71.293 520 122 481 123 481 396 520 396 520 449.707 429 449.413"
      />
    </svg>
  ),
  execute: () => {},
};

export const codeLive: ICommand = {
  name: 'live',
  keyCommand: 'preview',
  value: 'live',
  buttonProps: { 'aria-label': 'Live code', title: 'Live code' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 520 520">
      <polygon fill="currentColor" points="0 71.293 0 122 179 122 179 397 0 397 0 449.707 232 449.413 232 71.293" />
      <polygon
        fill="currentColor"
        points="289 71.293 520 71.293 520 122 341 123 341 396 520 396 520 449.707 289 449.413"
      />
    </svg>
  ),
  execute: () => {},
};
