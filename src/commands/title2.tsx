import * as React from "react";
import { ICommand, TextState, TextApi } from "./";

export const title2: ICommand = {
  name: "title2",
  keyCommand: "title2",
  buttonProps: { "aria-label": "Insert title2" },
  icon: (
    <div style={{ fontSize: 16, textAlign: 'left' }}>
      Title 2
    </div>
  ),
  execute: (state: TextState, api: TextApi) => {
    let modifyText = `## ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `## `;
    }
    api.replaceSelection(modifyText);
  },
};
