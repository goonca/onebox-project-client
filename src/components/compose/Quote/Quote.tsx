import React, { useEffect, useState } from 'react';
import { ComponentModel } from 'shared/types/api-type';

import style from './Quote.module.scss';

export const Quote: React.FC<ComponentModel> = (props: ComponentModel) => {
  const defaultText: string = `Quote...`;
  return (
    <>
      <blockquote className={style['quote']} data-component="quote">
        {props.longFormattedText ?? defaultText}
      </blockquote>
    </>
  );
};
