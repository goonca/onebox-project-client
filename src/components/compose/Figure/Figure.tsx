import { FigureFitType } from 'shared/types';
import style from './Figure.module.scss';

export type FigureProps = {
  src: string;
  caption?: string;
  fitType?: FigureFitType;
  width?: string;
};

export const Figure = (props: FigureProps) => {
  return (
    <>
      <figure
        data-component="figure"
        className={style['figure']}
        style={{ width: props.width }}
      >
        <img
          src={props.src}
          width="100%"
          style={{ objectFit: props.fitType }}
        ></img>
        {props.caption && <figcaption>{props.caption}</figcaption>}
      </figure>
    </>
  );
};
