import { IconProp } from '@fortawesome/fontawesome-svg-core';
import style from './MenuButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type MenuButtonProps = {
  label: string;
  icon: IconProp;
  selected?: boolean;
};

export const MenuButton = (props: MenuButtonProps) => {
  const styles: string[] = [style['menu-button']];
  props.selected && styles.push(style['selected']);
  return (
    <>
      <div className={styles.join(' ')}>
        <FontAwesomeIcon icon={props.icon} />
        <label>{props.label}</label>
      </div>
    </>
  );
};
