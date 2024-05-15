import React from 'react';
import { ComponentModel } from 'shared/types/api-type';

import style from './Text.module.scss';

export const Text: React.FC<ComponentModel> = (props: ComponentModel) => {
  const defaultText: string = `Text component accepts <strong>markdown</strong> markup language.`;
  return (
    <>
      <div
        style={{
          paddingTop: (props.marginTop ?? 0) * 5 + 'px',
          paddingBottom: (props.marginBottom ?? 0) * 5 + 'px'
        }}
      >
        <div
          className={style['text']}
          data-component="text"
          dangerouslySetInnerHTML={{
            __html: props.longFormattedText ?? defaultText
          }}
        ></div>
      </div>
    </>
  );
};
