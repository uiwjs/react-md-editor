import React, { useContext, useEffect, useMemo } from 'react';
import { IProps } from '../../utils';
import { EditorContext } from '../../Context';
import './index.less';

export interface MarkdownProps extends IProps, React.HTMLAttributes<HTMLPreElement> {}

export default function Markdown(props: MarkdownProps) {
  const { prefixCls, ...other } = props;
  const { markdown, textareaPre, dispatch } = useContext(EditorContext);
  const preRef = React.createRef<HTMLPreElement>();
  useEffect(() => {
    if (preRef.current && dispatch) {
      dispatch({ textareaPre: preRef.current });
    }
  }, []);
  const highlight = () => {
    if (!preRef.current) return;
    // const html = Prism.highlight(markdown as string, Prism.languages.markdown, 'markdown');
    // preRef.current.innerHTML = `${html}<br />`;
    // preRef.current.innerHTML = `${markdown}<br />`;
    preRef.current.innerText = `${markdown}<br />`;
  };
  useEffect(() => {
    highlight();
  }, [markdown, preRef.current]);
  return useMemo(() => <pre {...other} ref={preRef} className={`${prefixCls}-text-pre wmde-markdown-color`} />, [
    other,
    markdown,
  ]);
}
