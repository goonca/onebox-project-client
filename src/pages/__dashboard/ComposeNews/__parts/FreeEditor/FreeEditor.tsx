import { FigureProps } from 'components/compose/Figure';
import style from './FreeEditor.module.scss';

type CoponentEdit = {
  component: FigureProps;
};

export const FreeEditor = () => {
  return (
    <>
      <div className={style['free-editor']}>
        <div className={style['wrapper']}>&nbsp;</div>
      </div>
    </>
  );
};
