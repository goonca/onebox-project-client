import React, { SyntheticEvent, useEffect } from 'react';
import { ComponentModel } from 'shared/types/api-type';

import style from './Figure.module.scss';

export const Figure: React.FC<ComponentModel> = (props: ComponentModel) => {
  const handleError = (e: SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = '/static/default-picture.svg';
  };

  useEffect(() => {
    console.log('props', props);
  }, [props]);
  return (
    <>
      <div
        style={{
          paddingTop: (props.paddingTop ?? 0) * 5 + 'px',
          paddingBottom: (props.paddingBottom ?? 0) * 5 + 'px'
        }}
      >
        <figure
          data-component="figure"
          className={style['figure']}
          style={{ width: props.width }}
        >
          <img
            src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${props.$key}`}
            onError={handleError}
            width="100%"
            height={props.height}
            style={{ objectFit: props.fitType }}
          ></img>
          {props.caption && <figcaption>{props.caption}</figcaption>}
        </figure>
      </div>
    </>
  );
};
