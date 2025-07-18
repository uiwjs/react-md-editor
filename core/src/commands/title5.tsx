import React from 'react';
import { titleExecute } from '../commands/title';
import { ICommand, ExecuteState, TextAreaTextApi } from './';

export const title5: ICommand = {
  name: 'title5',
  keyCommand: 'title5',
  shortcuts: 'ctrlcmd+5',
  prefix: '##### ',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert Heading 5 (ctrl + 5)', title: 'Insert Heading 5 (ctrl + 5)' },
  icon: <div style={{ fontSize: 12, textAlign: 'left' }}>Heading 5</div>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({ state, api, prefix: state.command.prefix!, suffix: state.command.suffix });
  },
};
