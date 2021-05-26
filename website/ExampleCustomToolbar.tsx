import React from 'react';
import MDEditor, { commands, ICommand } from '../';

const ExampleCustomToolbar = () => {
  const title: ICommand<string> = {
    name: 'title3',
    keyCommand: 'title3',
    buttonProps: null,
    icon: <span style={{ padding: '0 5px' }}>Custom Toolbar</span>,
  };

  return (
    <MDEditor
      value="Hello Markdown!"
      textareaProps={{
        placeholder: 'Please enter Markdown text',
      }}
      extraCommands={[
        commands.group(
          [commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6],
          {
            name: 'title',
            groupName: 'title',
            buttonProps: { 'aria-label': 'Insert title' },
          },
        ),
        commands.group(
          [commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6],
          {
            name: 'title',
            groupName: 'title',
            buttonProps: { 'aria-label': 'Insert title' },
          },
        ),
      ]}
      commands={[
        title,
        commands.group(
          [commands.title1, commands.title2, commands.title3, commands.title4, commands.title5, commands.title6],
          {
            name: 'title',
            groupName: 'title',
            buttonProps: { 'aria-label': 'Insert title' },
          },
        ),
        // commands.bold, commands.hr, commands.italic, commands.divider,
        commands.group([], {
          name: 'update',
          groupName: 'update',
          icon: (
            <svg viewBox="0 0 1024 1024" width="12" height="12">
              <path
                fill="currentColor"
                d="M716.8 921.6a51.2 51.2 0 1 1 0 102.4H307.2a51.2 51.2 0 1 1 0-102.4h409.6zM475.8016 382.1568a51.2 51.2 0 0 1 72.3968 0l144.8448 144.8448a51.2 51.2 0 0 1-72.448 72.3968L563.2 541.952V768a51.2 51.2 0 0 1-45.2096 50.8416L512 819.2a51.2 51.2 0 0 1-51.2-51.2v-226.048l-57.3952 57.4464a51.2 51.2 0 0 1-67.584 4.2496l-4.864-4.2496a51.2 51.2 0 0 1 0-72.3968zM512 0c138.6496 0 253.4912 102.144 277.1456 236.288l10.752 0.3072C924.928 242.688 1024 348.0576 1024 476.5696 1024 608.9728 918.8352 716.8 788.48 716.8a51.2 51.2 0 1 1 0-102.4l8.3968-0.256C866.2016 609.6384 921.6 550.0416 921.6 476.5696c0-76.4416-59.904-137.8816-133.12-137.8816h-97.28v-51.2C691.2 184.9856 610.6624 102.4 512 102.4S332.8 184.9856 332.8 287.488v51.2H235.52c-73.216 0-133.12 61.44-133.12 137.8816C102.4 552.96 162.304 614.4 235.52 614.4l5.9904 0.3584A51.2 51.2 0 0 1 235.52 716.8C105.1648 716.8 0 608.9728 0 476.5696c0-132.1984 104.8064-239.872 234.8544-240.2816C258.5088 102.144 373.3504 0 512 0z"
              />
            </svg>
          ),
          children: (handle) => {
            return (
              <div style={{ width: 120, padding: 10 }}>
                <div>My Custom Toolbar</div>
                <button type="button" onClick={() => console.log('> execute: >>>>>', handle.getState!())}>
                  State
                </button>
                <button type="button" onClick={() => handle.close()}>
                  Close
                </button>
                <button type="button" onClick={() => handle.execute()}>
                  Execute
                </button>
              </div>
            );
          },
          execute: (state: commands.TextState, api: commands.TextApi) => {
            console.log('> execute: >>>>>', state);
          },
          buttonProps: { 'aria-label': 'Insert title' },
        }),
        // commands.divider,
        // commands.codeEdit, commands.codeLive, commands.codePreview, commands.divider,
        // commands.fullscreen,
      ]}
    />
  );
};
export default ExampleCustomToolbar;
