import * as React from 'react';
import { ICommand } from '../Type';

export const code: ICommand = {
  name: 'code',
  keyCommand: 'code',
  buttonProps: { 'aria-label': 'Insert code' },
  execute: () => { },
};
