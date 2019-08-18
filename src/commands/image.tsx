import * as React from 'react';
import { ICommand } from '../Type';

export const image: ICommand = {
  name: 'image',
  keyCommand: 'image',
  buttonProps: { 'aria-label': 'Add image' },
  execute: () => { },
};
