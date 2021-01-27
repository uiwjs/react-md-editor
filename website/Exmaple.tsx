import React, { Fragment } from 'react';
import MDEditor, { MDEditorProps } from '../';

let count = 1;

const Exmaple = (props = {} as { mdStr: string }) => {
  const [state, setVisiable] = React.useState<MDEditorProps>({
    visiableDragbar: true,
    hideToolbar: true,
    value: props.mdStr || '',
    preview: 'live',
  });
  const upDataVisiable = (keyName: string, e: React.ChangeEvent<HTMLInputElement>) => {
    setVisiable({ ...state, [keyName]: e.target.checked });
  };
  const upPreview = (e: React.ChangeEvent<HTMLInputElement>) => {
    setVisiable({ ...state, preview: e.target.value as MDEditorProps['preview'] });
  };
  const updateHandle = (str: string) => {
    setVisiable({ ...state, value: str });
  };
  return (
    <Fragment>
      <MDEditor
        value={state.value}
        height={400}
        hideToolbar={!state.hideToolbar}
        visiableDragbar={state.visiableDragbar}
        preview={state.preview}
        onChange={(newValue) => {
          setVisiable({ ...state, value: newValue || '' });
        }}
      />
      <div className="doc-tools">
        <label>
          <input
            type="checkbox"
            checked={state.visiableDragbar}
            onChange={(e) => upDataVisiable('visiableDragbar', e)}
          />
          {state.visiableDragbar ? 'Show' : 'Hidden'} Drag Bar
        </label>
        <label>
          <input type="checkbox" checked={state.hideToolbar} onChange={(e) => upDataVisiable('hideToolbar', e)} />
          {state.hideToolbar ? 'Show' : 'Hidden'} ToolBar
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
      </div>
    </Fragment>
  );
};

export default Exmaple;
