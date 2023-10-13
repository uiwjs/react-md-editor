import React from 'react';
import { titleExecute } from '../commands/title';
import { ICommand, ExecuteState, TextAreaTextApi } from './';

export const title6: ICommand = {
  name: 'title6',
  keyCommand: 'title6',
  shortcuts: 'ctrlcmd+6',
  prefix: '###### ',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert title6 (ctrl + 6)', title: 'Insert title6 (ctrl + 6)' },
  icon: <div style={{ fontSize: 12, textAlign: 'left' }}>Title 6</div>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({ state, api, prefix: state.command.prefix!, suffix: state.command.suffix });
  },
};
