import React, { Fragment } from "react";
import { ICommand, TextState, TextApi } from "./";

export const title1: ICommand = {
  name: "title1",
  keyCommand: "title1",
  buttonProps: { "aria-label": "Insert title 1" },
  icon: (
    <div style={{ fontSize: 18, textAlign: 'left' }}>
      Title 1
    </div>
  ),
  execute: (state: TextState, api: TextApi) => {
    let modifyText = `# ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `# `;
    }
    api.replaceSelection(modifyText);
  },
};
