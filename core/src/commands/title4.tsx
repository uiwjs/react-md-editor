import React from 'react';
import { titleExecute } from '../commands/title';
import { ICommand, ExecuteState, TextAreaTextApi } from './';

export const title4: ICommand = {
  name: 'title4',
  keyCommand: 'title4',
  shortcuts: 'ctrlcmd+4',
  prefix: '#### ',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert title4 (ctrl + 4)', title: 'Insert title4 (ctrl + 4)' },
  icon: <div style={{ fontSize: 14, textAlign: 'left' }}>Title 4</div>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({ state, api, prefix: state.command.prefix!, suffix: state.command.suffix });
  },
};
