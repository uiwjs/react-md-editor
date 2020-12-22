import React from 'react';
import MDEditor, { commands, ICommand } from '../';

const ExampleCustomToolbar = () => {
  const title: ICommand<string> = {
    name: 'title3',
    keyCommand: 'title3',
    buttonProps: null,
    icon: (
      <span style={{ padding: '0 5px' }}>Custom Toolbar</span>
    ),
  };

  return (
    <MDEditor
      value="Hello Markdown!"
      commands={[
        title,
        commands.bold, commands.hr, commands.italic, commands.divider,
        commands.codeEdit, commands.codeLive, commands.codePreview, commands.divider,
        commands.fullscreen, 
      ]}
    />
  )
}
export default ExampleCustomToolbar;