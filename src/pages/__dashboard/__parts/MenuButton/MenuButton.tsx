import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import style from './MenuButton.module.scss';

export type MenuButtonProps = {
  label: string;
  icon: IconProp;
  preSelected?: string;
  path?: string;
  onClick?: (path?: string) => void;
};

export const MenuButton = ({
  preSelected,
  label,
  icon,
  path,
  onClick
}: MenuButtonProps) => {
  const [currentPath, setCurrentPath] = useState<string>();

  const setCurrentPage = (path?: string) => {
    const pathname = document.location.pathname;
    setCurrentPath(
      path ??
        new URLSearchParams(document.location.search).get('path') ??
        ((pathname && pathname.length > 2 && pathname.split('/')[2]) as string)
    );
  };

  useEffect(() => {
    setCurrentPage(preSelected);
  }, [preSelected]);

  return (
    <>
      <Link to={path ?? ''} onClick={() => onClick && onClick(path)}>
        <div
          className={`${style['menu-button']} ${
            currentPath == path && style['selected']
          }`}
        >
          <FontAwesomeIcon icon={icon} />
          <label>{label}</label>
        </div>
      </Link>
    </>
  );
};
