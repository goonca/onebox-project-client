import React from 'react';
import { FigureFitType } from 'shared/types';

import style from './Figure.module.scss';

export type FigureProps = {
  src?: string;
  caption?: string;
  fitType?: FigureFitType;
  width?: string;
  height?: string;
};

export const Figure: React.FC<FigureProps> = (props: FigureProps) => {
  return (
    <>
      <figure
        data-component="figure"
        className={style['figure']}
        style={{ width: props.width }}
      >
        <img
          src={props.src ?? '/static/default-picture.svg'}
          width="100%"
          height={props.height}
          style={{ objectFit: props.fitType }}
        ></img>
        {props.caption && <figcaption>{props.caption}</figcaption>}
      </figure>
    </>
  );
};
