import React, { Fragment } from 'react';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypePrettyCode from 'rehype-pretty-code';
import MDEditor, { MDEditorProps } from '@uiw/react-md-editor';
import styled from 'styled-components';

const Toolbar = styled.div`
  padding-top: 10px;
  text-align: center;
`;

let count = 1;

const Example = (props = {} as { mdStr: string }) => {
  const [state, setVisible] = React.useState<MDEditorProps>({
    visibleDragbar: true,
    hideToolbar: true,
    overflow: true,
    highlightEnable: true,
    enableScroll: true,
    value: props.mdStr || '',
    preview: 'live',
    toolbarBottom: false,
  });
  const upPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisible({ ...state, preview: e.target.value as MDEditorProps['preview'] });
  };
  const updateHandle = (str: string) => {
    setVisible({ ...state, value: str });
  };
  return (
    <Fragment>
      <MDEditor
        autoFocus
        value={state.value}
        overflow={state.overflow}
        previewOptions={{
          rehypePlugins: [
            [
              rehypeSanitize,
              {
                ...defaultSchema,
                attributes: {
                  ...defaultSchema.attributes,
                  span: [
                    // @ts-ignore
                    ...(defaultSchema.attributes.span || []),
                    // List of all allowed tokens:
                    ['className'],
                  ],
                  code: [['className']],
                },
              },
            ],
            rehypePrettyCode,
          ],
        }}
        height={400}
        highlightEnable={state.highlightEnable}
        hideToolbar={!state.hideToolbar}
        enableScroll={state.enableScroll}
        toolbarBottom={state.toolbarBottom}
        visibleDragbar={state.visibleDragbar}
        textareaProps={{
          placeholder: 'Please enter Markdown text',
        }}
        preview={state.preview}
        onChange={(newValue = '') => {
          setVisible({ ...state, value: newValue });
        }}
      />
      <Toolbar>
        <label>
          <input
            type="checkbox"
            checked={state.visibleDragbar}
            onChange={(e) => {
              setVisible({ ...state, visibleDragbar: e.target.checked });
            }}
          />
          {state.visibleDragbar ? 'Show' : 'Hidden'} Drag Bar
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.highlightEnable}
            onChange={(e) => {
              setVisible({ ...state, highlightEnable: e.target.checked });
            }}
          />
          {state.highlightEnable ? 'Enable' : 'Unenable'} highlight
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.enableScroll}
            onChange={(e) => {
              setVisible({ ...state, enableScroll: e.target.checked });
            }}
          />
          {state.enableScroll ? 'Enable' : 'Unenable'} Scroll
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.hideToolbar}
            onChange={(e) => {
              setVisible({ ...state, hideToolbar: e.target.checked });
            }}
          />
          {state.hideToolbar ? 'Show' : 'Hidden'} ToolBar
        </label>
        <label>
          <input
            type="checkbox"
            checked={!state.toolbarBottom}
            onChange={(e) => {
              setVisible({ ...state, toolbarBottom: !e.target.checked });
            }}
          />
          {!state.toolbarBottom ? 'Top' : 'Bottom'} ToolBar
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.overflow}
            onChange={(e) => {
              setVisible({ ...state, overflow: e.target.checked });
            }}
          />
          overflow
        </label>
        <br />
        <label>
          <input type="radio" name="preview" value="edit" checked={state.preview === 'edit'} onChange={upPreview} />
          Edit
        </label>
        <label>
          <input type="radio" name="preview" value="live" checked={state.preview === 'live'} onChange={upPreview} />
          Live Preview
        </label>
        <label>
          <input
            type="radio"
            name="preview"
            value="preview"
            checked={state.preview === 'preview'}
            onChange={upPreview}
          />
          Preview
        </label>
        <button
          type="button"
          style={{ marginLeft: 10 }}
          onClick={() => {
            count += 1;
            updateHandle(`## Test ${count}`);
          }}
        >
          Set Value
        </button>
        <button
          type="button"
          disabled={!state.value}
          style={{ marginLeft: 10 }}
          onClick={() => {
            updateHandle(undefined as any);
          }}
        >
          Clear
        </button>
      </Toolbar>
    </Fragment>
  );
};

export default Example;
