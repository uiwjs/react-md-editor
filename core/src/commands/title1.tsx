import React from 'react';
import { titleExecute } from '../commands/title';
import { ICommand, ExecuteState, TextAreaTextApi } from './';

export const title1: ICommand = {
  name: 'title1',
  keyCommand: 'title1',
  shortcuts: 'ctrlcmd+1',
  prefix: '# ',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert title1 (ctrl + 1)', title: 'Insert title1 (ctrl + 1)' },
  icon: <div style={{ fontSize: 18, textAlign: 'left' }}>Title 1</div>,
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    titleExecute({ state, api, prefix: state.command.prefix!, suffix: state.command.suffix });
  },
};
