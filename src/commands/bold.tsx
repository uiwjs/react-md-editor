import * as React from 'react';
import { ICommand } from '../Type';

export const bold: ICommand = {
    name: 'bold',
    keyCommand: 'bold',
    buttonProps: {'aria-label': 'Add bold text'},
    execute: () => { },
};
