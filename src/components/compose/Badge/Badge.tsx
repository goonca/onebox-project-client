import tinycolor from 'tinycolor2';

import style from './Badge.module.scss';

export type BadgeProps = {
  color?: string;
  label?: string;
};

export const Badge = (props: BadgeProps) => {
  const colors = {
    color: props.color,
    backgroundColor: tinycolor(props.color).lighten(40).toString()
  };

  const defaultLabel: string = 'Badge';

  return (
    <>
      <label data-component="badge" className={style['badge']} style={colors}>
        {props.label ?? defaultLabel}
      </label>
    </>
  );
};
