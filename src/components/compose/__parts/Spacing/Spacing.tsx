import { useEffect, useRef } from 'react';
import { ComponentModel } from 'shared/types/api-type';
import style from './Spacing.module.scss';

export type SpacingReturn = {
  marginTop: number;
  marginBottom: number;
};

export type SpacingProps = {
  onChange?: (status: SpacingReturn) => void;
  component: ComponentModel;
};

export const Spacing = (props: SpacingProps) => {
  const topRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLInputElement>(null);

  const changeValue = () => {
    props.onChange &&
      props.onChange({
        marginTop: (topRef.current?.value ?? 0) as number,
        marginBottom: (bottomRef.current?.value ?? 0) as number
      });
  };

  useEffect(() => {
    topRef.current &&
      (topRef.current.value = (
        !!props.component?.marginTop ? props.component?.marginTop : '0'
      ) as string);
    bottomRef.current &&
      (bottomRef.current.value = (
        !!props.component?.marginBottom ? props.component?.marginBottom : '0'
      ) as string);
    //console.log('changed');
  }, [props.component?.id]);

  return (
    <>
      <div className={style['spacing']}>
        <div>
          <label>top</label>
          <input
            type="number"
            min={0}
            max={5}
            ref={topRef}
            onChange={changeValue}
          />
        </div>
        <div className={style['draw']}>
          <div>
            <label>spacing</label>
          </div>
        </div>
        <div>
          <input
            type="number"
            min={0}
            max={5}
            ref={bottomRef}
            onChange={changeValue}
          />
          <label>bottom</label>
        </div>
      </div>
    </>
  );
};
