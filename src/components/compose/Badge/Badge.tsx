import style from './Badge.module.scss';
import tinycolor from 'tinycolor2';

export type BadgeProps = {
  color?: string;
  label: string;
};

export const Badge = (props: BadgeProps) => {
  const colors = {
    color: props.color,
    backgroundColor: tinycolor(props.color).lighten(40).toString()
  };
  return (
    <>
      <label data-component="badge" className={style['badge']} style={colors}>
        {props.label}
      </label>
    </>
  );
};
