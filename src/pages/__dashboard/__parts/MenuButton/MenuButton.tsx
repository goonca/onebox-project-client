import { IconProp } from '@fortawesome/fontawesome-svg-core';
import style from './MenuButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { useState } from 'react';

export type MenuButtonProps = {
  label: string;
  icon: IconProp;
  selected?: boolean;
  path?: string;
};

export const MenuButton = (props: MenuButtonProps) => {
  const styles: string[] = [style['menu-button']];
  props.selected && styles.push(style['selected']);
  return (
    <>
      <Link to={props.path ?? ''}>
        <div className={styles.join(' ')}>
          <FontAwesomeIcon icon={props.icon} />
          <label>{props.label}</label>
        </div>
      </Link>
    </>
  );
};
