import * as React from 'react';
import { ICommand } from '../Type';

export const link: ICommand = {
  name: 'link',
  keyCommand: 'link',
  buttonProps: { 'aria-label': 'Add a link' },
  execute: () => { },
};
