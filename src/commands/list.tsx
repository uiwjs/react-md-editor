import * as React from 'react';
import { ICommand } from '../Type';



export const unorderedListCommand: ICommand = {
  name: 'unordered-list',
  buttonProps: { 'aria-label': 'Add unordered list' },
  execute: () => { },
  keyCommand: 'list',
};

export const orderedListCommand: ICommand = {
  name: 'ordered-list',
  buttonProps: { 'aria-label': 'Add ordered list' },
  execute: () => { },
  keyCommand: 'list',
};

export const checkedListCommand: ICommand = {
  name: 'checked-list',
  buttonProps: { 'aria-label': 'Add checked list' },
  execute: () => { },
  keyCommand: 'list',
};
