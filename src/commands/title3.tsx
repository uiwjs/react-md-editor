import * as React from "react";
import { ICommand, TextState, TextApi } from "./";

export const title3: ICommand = {
  name: "title3",
  keyCommand: "title3",
  buttonProps: { "aria-label": "Insert title3" },
  icon: (
    <div style={{ fontSize: 15, textAlign: 'left' }}>
      Title 3
    </div>
  ),
  execute: (state: TextState, api: TextApi) => {
    let modifyText = `### ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `### `;
    }
    api.replaceSelection(modifyText);
  },
};
