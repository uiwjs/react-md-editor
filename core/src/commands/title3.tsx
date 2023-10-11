import React from 'react';
import { titleExecute } from '../commands/title';
import { ICommand, ExecuteState, TextAreaTextApi } from './';

export const title3: ICommand = {
  name: 'title3',
  keyCommand: 'title3',
  shortcuts: 'ctrlcmd+3',
  prefix: '### ',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert title3 (ctrl + 3)', title: 'Insert title3 (ctrl + 3)' },
  icon: <div style={{ fontSize: 15, textAlign: 'left' }}>Title 3</div>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({ state, api, prefix: state.command.prefix!, suffix: state.command.suffix });
  },
};
