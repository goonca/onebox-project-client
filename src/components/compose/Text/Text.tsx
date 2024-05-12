import React from 'react';
import Markdown from 'react-markdown';

import style from './Text.module.scss';

export type TextProps = {
  text?: string;
};

export const Text: React.FC<TextProps> = (props: TextProps) => {
  const defaultText: string = `Text component accepts ***markdown*** markup language.`;
  return (
    <>
      <div className={style['text']} data-component="text">
        <Markdown>{props.text ?? defaultText}</Markdown>
      </div>
    </>
  );
};
