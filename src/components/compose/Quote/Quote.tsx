import React, { useEffect, useState } from 'react';
import { ComponentModel } from 'shared/types/api-type';

import style from './Quote.module.scss';

export const Quote: React.FC<ComponentModel> = (props: ComponentModel) => {
  const defaultText: string = `Quote...`;
  return (
    <>
      <div
        style={{
          paddingTop: (props.paddingTop ?? 0) * 5 + 'px',
          paddingBottom: (props.paddingBottom ?? 0) * 5 + 'px'
        }}
      >
        <div className={style['quote']} data-component="quote">
          <hr />
          <blockquote
            dangerouslySetInnerHTML={{
              __html: props.longFormattedText ?? defaultText
            }}
          ></blockquote>
          <hr />
        </div>
      </div>
    </>
  );
};
