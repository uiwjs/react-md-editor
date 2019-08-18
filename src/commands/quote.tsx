import * as React from 'react';
import { ICommand } from '../Type';

export const quote: ICommand = {
  name: 'quote',
  keyCommand: 'quote',
  buttonProps: { 'aria-label': 'Insert a quote' },
  execute: () => { },
};
