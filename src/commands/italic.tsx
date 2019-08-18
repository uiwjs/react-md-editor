import * as React from 'react';
import { ICommand } from '../Type';

export const italic: ICommand = {
  name: 'italic',
  keyCommand: 'italic',
  buttonProps: { 'aria-label': 'Add italic text' },
  execute: () => { },
};
