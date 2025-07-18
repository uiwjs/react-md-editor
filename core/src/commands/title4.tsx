import React from 'react';
import { headingExecute } from '../commands/title';
import { ICommand, ExecuteState, TextAreaTextApi } from './';

export const heading4: ICommand = {
  name: 'heading4',
  keyCommand: 'heading4',
  shortcuts: 'ctrlcmd+4',
  prefix: '#### ',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert Heading 4 (ctrl + 4)', title: 'Insert Heading 4 (ctrl + 4)' },
  icon: <div style={{ fontSize: 14, textAlign: 'left' }}>Heading 4</div>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    headingExecute({ state, api, prefix: state.command.prefix!, suffix: state.command.suffix });
  },
};

/**
 * @deprecated Use `heading4` instead.
 * This command is now deprecated and will be removed in future versions.
 * Use `title4` for inserting Heading 4.
 */
export const title4: ICommand = heading4;
