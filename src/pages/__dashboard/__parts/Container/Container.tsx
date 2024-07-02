import { ReactNode } from 'react';
import style from './Container.module.scss';

type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

export const Container: React.FC<ContainerProps> = (props: ContainerProps) => {
  return (
    <>
      <div {...props} className={style['container']}>
        {props.children}
      </div>
    </>
  );
};
