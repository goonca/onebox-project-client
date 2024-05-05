import React from 'react';
import style from './Quote.module.scss';

export type QuoteProps = {
  text?: string;
};

export const Quote: React.FC<QuoteProps> = (props: QuoteProps) => {
  const defaultText: string = `Quote...`;
  return (
    <>
      <blockquote className={style['quote']} data-component="quote">
        {props.text ?? defaultText}
      </blockquote>
    </>
  );
};
