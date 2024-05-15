import React, { useEffect, useState } from 'react';
import { ComponentModel } from 'shared/types/api-type';

import style from './Quote.module.scss';

export const Quote: React.FC<ComponentModel> = (props: ComponentModel) => {
  const defaultText: string = `Quote...`;
  return (
    <>
      <div
        style={{
          paddingTop: (props.marginTop ?? 0) * 5 + 'px',
          paddingBottom: (props.marginBottom ?? 0) * 5 + 'px'
        }}
      >
        <blockquote
          className={style['quote']}
          data-component="quote"
          dangerouslySetInnerHTML={{
            __html: props.longFormattedText ?? defaultText
          }}
        ></blockquote>
      </div>
    </>
  );
};
