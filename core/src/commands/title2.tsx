import React from 'react';
import { titleExecute } from '../commands/title';
import { ICommand, ExecuteState, TextAreaTextApi } from './';

export const title2: ICommand = {
  name: 'title2',
  keyCommand: 'title2',
  shortcuts: 'ctrlcmd+2',
  prefix: '## ',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert Heading 2 (ctrl + 2)', title: 'Insert Heading 2 (ctrl + 2)' },
  icon: <div style={{ fontSize: 16, textAlign: 'left' }}>Heading 2</div>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({ state, api, prefix: state.command.prefix!, suffix: state.command.suffix });
  },
};
