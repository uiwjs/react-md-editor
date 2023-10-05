import React from 'react';
import { ICommand, ExecuteState, TextAreaTextApi } from './';
import { selectWord, executeCommand } from '../utils/markdownUtils';

export const hr: ICommand = {
  name: 'hr',
  keyCommand: 'hr',
  shortcuts: 'ctrlcmd+h',
  prefix: '\n\n---\n',
  suffix: '',
  buttonProps: { 'aria-label': 'Insert HR (ctrl + h)', title: 'Insert HR (ctrl + h)' },
  icon: (
    <svg width="12" height="12" viewBox="0 0 175 175">
      <path
        fill="currentColor"
        d="M0,129 L175,129 L175,154 L0,154 L0,129 Z M3,9 L28.2158203,9 L28.2158203,47.9824219 L55.7695313,47.9824219 L55.7695313,9 L81.0966797,9 L81.0966797,107.185547 L55.7695313,107.185547 L55.7695313,68.0214844 L28.2158203,68.0214844 L28.2158203,107.185547 L3,107.185547 L3,9 Z M93.1855469,100.603516 L93.1855469,19 L135.211914,19 C143.004922,19 148.960917,19.6679621 153.080078,21.0039063 C157.199239,22.3398504 160.520495,24.8168764 163.043945,28.4350586 C165.567395,32.0532407 166.829102,36.459935 166.829102,41.6552734 C166.829102,46.1826398 165.864267,50.0883625 163.93457,53.3725586 C162.004873,56.6567547 159.351579,59.3193257 155.974609,61.3603516 C153.822255,62.6591862 150.872089,63.7353473 147.124023,64.5888672 C150.129898,65.5908253 152.319329,66.5927684 153.692383,67.5947266 C154.620122,68.2626987 155.965323,69.6913953 157.728027,71.8808594 C159.490731,74.0703234 160.668942,75.7587831 161.262695,76.9462891 L173,100.603516 L144.953125,100.603516 L131.482422,75.6660156 C129.775382,72.4374839 128.253913,70.3408251 126.917969,69.3759766 C125.0996,68.1142515 123.040051,67.4833984 120.739258,67.4833984 L118.512695,67.4833984 L118.512695,100.603516 L93.1855469,100.603516 Z M118.512695,52.0644531 L129.144531,52.0644531 C130.294928,52.0644531 132.521468,51.6933631 135.824219,50.9511719 C137.494149,50.6171858 138.857905,49.7636787 139.915527,48.390625 C140.97315,47.0175713 141.501953,45.4404386 141.501953,43.6591797 C141.501953,41.0244009 140.667001,39.0019602 138.99707,37.5917969 C137.32714,36.1816336 134.191429,35.4765625 129.589844,35.4765625 L117.512695,35.4765625 L118.512695,52.0644531 Z"
        transform="translate(0 9)"
      />
    </svg>
  ),
  execute: (state: ExecuteState, api: TextAreaTextApi) => {
    const newSelectionRange = selectWord({
      text: state.text,
      selection: state.selection,
      prefix: state.command.prefix!,
      suffix: state.command.suffix,
    });
    let state1 = api.setSelectionRange(newSelectionRange);
    if (
      state1.selectedText.length >= state.command.prefix!.length &&
      state1.selectedText.startsWith(state.command.prefix!)
    ) {
      // Remove
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
        suffix: state.command.suffix,
      });
    } else {
      // Add
      state1 = api.setSelectionRange({ start: state.selection.start, end: state.selection.start });
      executeCommand({
        api,
        selectedText: state1.selectedText,
        selection: state.selection,
        prefix: state.command.prefix!,
        suffix: state.command.suffix,
      });
    }
  },
};
