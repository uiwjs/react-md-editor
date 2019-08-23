import React from 'react';
import classnames from 'classnames';

export type ICode = {
  language: string;
  value: string;
}

export default function Code({ language, value }: ICode) {
  return (
    <pre className={classnames({ [`language-${language}`]: language })}>
      <code data-lang={language} className={classnames({ [`language-${language}`]: language })}>
        {value}
      </code>
    </pre>
  );
}
