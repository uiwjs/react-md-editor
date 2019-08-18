import * as React from 'react';
import { ICommand } from '../Type';

export const preview: ICommand = {
  name: 'preview',
  keyCommand: 'preview',
  buttonProps: { 'aria-label': 'Preview code' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 32 32">
      <path fill="currentColor" d="M0 16c3.037-5.864 9.058-9.802 16-9.802s12.963 3.938 15.953 9.703l0.047 0.1c-3.037 5.864-9.058 9.802-16 9.802s-12.963-3.938-15.953-9.703l-0.047-0.1zM16 22.531c3.607 0 6.531-2.924 6.531-6.531s-2.924-6.531-6.531-6.531v0c-3.607 0-6.531 2.924-6.531 6.531s2.924 6.531 6.531 6.531v0zM16 19.265c-1.804 0-3.265-1.461-3.265-3.265s1.461-3.265 3.265-3.265v0c1.804 0 3.265 1.461 3.265 3.265s-1.461 3.265-3.265 3.265v0z" />
    </svg>
  ),
  execute: () => { },
};
