import React from 'react';
import MDEditor from '../';
import './App.less';

const mdStr = `# Markdown Editor for React
## 大标题

\`visble?:boolean\` - Shows a preview that will be converted to html.

### 小标题
#### 小标题
##### 小标题
###### 小标题

*斜体文本*    _斜体文本_  
**粗体文本**    __粗体文本__  
***粗斜体文本***    ___粗斜体文本___  

\`\`\`javascript
$(document).ready(function () {
  alert('hello world');
});
\`\`\`


\`\`\`javascript
import React, { Component } from 'react';
import Prism from 'prismjs';
import classnames from 'classnames';
import 'prismjs/components/prism-markdown.min.js';
import { IProps } from '../../Type';
import './index.less';

export interface ITextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange' | 'shouldComponentUpdate'>, IProps {
  onChange?: (value: string) => void;
  height?: React.CSSProperties['height'];
}

export interface ITextAreaState {
  value: ITextAreaProps['value'];
}

export default class TextArea extends Component<ITextAreaProps, ITextAreaState> {
  public preElm = React.createRef<HTMLPreElement>();
  public text = React.createRef<HTMLTextAreaElement>();
  public static defaultProps: ITextAreaProps = {
    height: 200,
  }
  public static state: ITextAreaState;
  public constructor(props: ITextAreaProps) {
    super(props);
    this.state = {
      value: props.value,
    };
  }
  private handleChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const { onChange } = this.props;
    this.setState({ value: e.target.value }, () => {
      this.highlight();
    });
    onChange && onChange(e.target.value);
  }
  public async componentDidMount() {
    this.highlight();
    window && window.addEventListener('mousewheel', (e) => {
      const scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
      this.preElm.current!.scrollTop = scrollTop;
    })
  }
  public UNSAFE_componentWillReceiveProps(nextProps: ITextAreaProps) {
    if (nextProps.value !== this.props.value) {
      this.highlight();
    }
  }
  public shouldComponentUpdate(nextProps: ITextAreaProps, nextState: ITextAreaState) {
    return nextState.value !== this.state.value;
  }
  private handleScroll(e: React.UIEvent<HTMLTextAreaElement>) {
    const scrollTop = (e.target as HTMLTextAreaElement).scrollTop;
    this.preElm.current!.scrollTop = scrollTop;
  }
  public async highlight() {
    const { value } = this.state;
    const pre = this.preElm.current;
    const html = Prism.highlight(value as string, Prism.languages.markdown, 'markdown');
    pre!.innerHTML = html;
  }
  render() {
    const { prefixCls, className, onChange, autoFocus, style, height, ...otherProps } = this.props;
    return (
      <div className={classnames(\`\${prefixCls}-text\`, className)}>
        <pre ref={this.preElm} className={\`\${prefixCls}-text-pre\`} />
        <textarea
          spellCheck={false}
          {...otherProps}
          autoFocus={autoFocus}
          onScroll={this.handleScroll.bind(this)}
          style={{ ...style, height, fontFamily: 'sans-serif' }}
          className={\`\${prefixCls}-text-input\`}
          value={this.state.value}
          onChange={this.handleChange.bind(this)}
        />
      </div>
    );
  }
}
\`\`\`

\`\`\`python
def g(x):
    yield from range(x, 0, -1)
    yield from range(x)
\`\`\`

    def g(x):
        yield from range(x, 0, -1)
        yield from range(x)

文字链接 [链接名称](http://链接网址)
网址链接 <http://链接网址>

在当前行的结尾加 2 个空格  

- [x] 我的任务
- [x] 我的任务

1. ssss
2. 3333

---

| 表头 | 表头 |
| --- | --- |
| 事实上 | 事实上 |

这个链接用 1 作为网址变量 [Google][1].
这个链接用 yahoo 作为网址变量 [Yahoo!][yahoo].
然后在文档的结尾为变量赋值（网址）

  [1]: http://www.google.com/
  [yahoo]: http://www.yahoo.com/
`;


export default function App() {
  const [state, setVisiable] = React.useState({
    visiableDragbar: true,
    visiablePreview: true,
  });
  return (
    <div className="warpper">
      <MDEditor
        value={mdStr}
        height={200}
        visiableDragbar={state.visiableDragbar}
        visiablePreview={state.visiablePreview}
        onChange={(e) => {
          console.log('3')
        }}
      />
      <div className="doc-tools">
        <label>
          <input
            type="checkbox"
            checked={state.visiableDragbar}
            onChange={(e) => setVisiable({ ...state, visiableDragbar: e.target.checked })}
          />
          是否显示拖拽工具
        </label>
        <label>
          <input
            type="checkbox"
            checked={state.visiablePreview}
            onChange={(e) => setVisiable({ ...state, visiablePreview: e.target.checked })}
          />
          是否显示预览界面
        </label>
      </div>
    </div>
  )
}