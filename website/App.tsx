import React from 'react';
import MDEditor from '../';
import './App.less';

const mdStr = `# Markdown Editor for React
## 大标题

\`visble?:boolean\` - Shows a preview that will be converted to html.converted to html.

### 小标题
#### 小标题
##### 小标题
###### 小标题

*斜体文本*    _斜体文本_  `;

export default class App extends React.PureComponent {
  render () {
    return (
      <div className="warpper">
        <MDEditor value={mdStr} height={300} />
      </div>
    )
  }
}