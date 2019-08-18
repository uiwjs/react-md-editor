import * as React from 'react';
import { ICommand } from '../Type';

export const strikethrough: ICommand = {
  name: 'strikethrough',
  keyCommand: 'strikethrough',
  buttonProps: { 'aria-label': 'Add strikethrough text' },
  execute: () => { },
};
