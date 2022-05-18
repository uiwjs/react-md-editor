import React, { Fragment } from 'react';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import MDEditor, { MDEditorProps } from '../';

let count = 1;

const Exmaple = (props = {} as { mdStr: string }) => {
  const [state, setVisiable] = React.useState<MDEditorProps>({
    visiableDragbar: true,
    hideToolbar: true,
    overflow: true,
    highlightEnable: true,
    enableScroll: true,
    value: props.mdStr || '',
    preview: 'live',
    toolbarBottom: false,
  });
  const upPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisiable({ ...state, preview: e.target.value as MDEditorProps['preview'] });
  };
  const updateHandle = (str: string) => {
    setVisiable({ ...state, value: str });
  };
  return (
    <Fragment>
      <MDEditor
        autoFocus
        value={state.value}
        overflow={state.overflow}
        previewOptions={{
          linkTarget: '_blank',
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
          ],
        }}
        height={400}
        highlightEnable={state.highlightEnable}
        hideToolbar={!state.hideToolbar}
        enableScroll={state.enableScroll}
        toolbarBottom={state.toolbarBottom}
        visiableDragbar={state.visiableDragbar}
        textareaProps={{
          placeholder: 'Please enter Markdown text',
        }}
        preview={state.preview}
        onChange={(newValue = '') => {
          setVisiable({ ...state, value: newValue });
        }}
      />
      <div className="doc-tools">
        <label>
          <input
            type="checkbox"
            checked={state.visiableDragbar}
            onChange={(e) => {
              setVisiable({ ...state, visiableDragbar: e.target.checked });
            }}
          />
          {state.visiableDragbar ? 'Show' : 'Hidden'} Drag Bar
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.highlightEnable}
            onChange={(e) => {
              setVisiable({ ...state, highlightEnable: e.target.checked });
            }}
          />
          {state.highlightEnable ? 'Enable' : 'Unenable'} highlight
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.enableScroll}
            onChange={(e) => {
              setVisiable({ ...state, enableScroll: e.target.checked });
            }}
          />
          {state.enableScroll ? 'Enable' : 'Unenable'} Scroll
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.hideToolbar}
            onChange={(e) => {
              setVisiable({ ...state, hideToolbar: e.target.checked });
            }}
          />
          {state.hideToolbar ? 'Show' : 'Hidden'} ToolBar
        </label>
        <label>
          <input
            type="checkbox"
            checked={!state.toolbarBottom}
            onChange={(e) => {
              setVisiable({ ...state, toolbarBottom: !e.target.checked });
            }}
          />
          {!state.toolbarBottom ? 'Top' : 'Bottom'} ToolBar
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.overflow}
            onChange={(e) => {
              setVisiable({ ...state, overflow: e.target.checked });
            }}
          />
          overflow
        </label>
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
      </div>
    </Fragment>
  );
};

export default Exmaple;
