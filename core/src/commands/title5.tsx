import React from 'react';
import { headingExecute } from '../commands/title';
import { ICommand, ExecuteState, TextAreaTextApi } from './';

export const heading5: ICommand = {
  name: 'heading5',
  keyCommand: 'heading5',
  shortcuts: 'ctrlcmd+5',
  prefix: '##### ',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert Heading 5 (ctrl + 5)', title: 'Insert Heading 5 (ctrl + 5)' },
  icon: <div style={{ fontSize: 12, textAlign: 'left' }}>Heading 5</div>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    headingExecute({ state, api, prefix: state.command.prefix!, suffix: state.command.suffix });
  },
};

/**
 * @deprecated Use `heading5` instead.
 * This command is now deprecated and will be removed in future versions.
 * Use `title5` for inserting Heading 5.
 */
export const title5: ICommand = heading5;
