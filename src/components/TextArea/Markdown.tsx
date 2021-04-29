import React, { useContext, useEffect, useMemo } from 'react';
import { IProps } from '../../utils';
import Prism from 'prismjs';
import { EditorContext } from '../../Context';
import './index.less';

export interface MarkdownProps extends IProps, React.HTMLAttributes<HTMLPreElement> {}

export default function Markdown(props: MarkdownProps) {
  const { prefixCls, ...other } = props;
  const { markdown, highlightEnable, dispatch } = useContext(EditorContext);
  const preRef = React.createRef<HTMLPreElement>();
  useEffect(() => {
    if (preRef.current && dispatch) {
      dispatch({ textareaPre: preRef.current });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const highlight = () => {
    if (!preRef.current) return;
    if (highlightEnable) {
      const html = Prism.highlight(markdown as string, Prism.languages.markdown, 'markdown');
      preRef.current.innerHTML = `${html}`;
    } else {
      preRef.current.innerText = `${markdown}`;
    }
  };
  useEffect(() => {
    highlight();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markdown, preRef.current, highlightEnable]);

  return useMemo(() => <pre {...other} ref={preRef} className={`${prefixCls}-text-pre wmde-markdown-color`} />, [
    other,
    preRef,
    prefixCls,
  ]);
}
