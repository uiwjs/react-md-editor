import * as React from "react";
import { ICommand, TextState, TextApi } from "./";

export const title4: ICommand = {
  name: "title4",
  keyCommand: "title4",
  buttonProps: { "aria-label": "Insert title4" },
  icon: (
    <div style={{ fontSize: 14, textAlign: 'left' }}>
      Title 4
    </div>
  ),
  execute: (state: TextState, api: TextApi) => {
    let modifyText = `#### ${state.selectedText}\n`;
    if (!state.selectedText) {
      modifyText = `#### `;
    }
    api.replaceSelection(modifyText);
  },
};
