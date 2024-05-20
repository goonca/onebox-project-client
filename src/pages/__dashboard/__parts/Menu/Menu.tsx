import {
  faHardDrive,
  faHouse,
  faNewspaper,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { useCallback, useEffect, useState } from 'react';

import { MenuButton } from '../MenuButton/MenuButton';
import style from './Menu.module.scss';

export const Menu = () => {
  const [page, setPage] = useState<string>();

  const setCurrentPage = useCallback(() => {
    const pathname = document.location.pathname;
    const currentPage =
      pathname && pathname.length > 2 && pathname.split('/')[2];
    currentPage && setPage(currentPage);
  }, []);

  useEffect(() => {
    setCurrentPage();
  });

  return (
    <>
      <div className={style['menu']} data-component="menu">
        <div className={style['top']}>
          <label>ONEBOX</label>
        </div>
        <MenuButton label="Home" icon={faHouse} preSelected={page} />
        <MenuButton
          label="Profile"
          icon={faUser}
          path="profile"
          preSelected={page}
          onClick={path => setPage(path)}
        />
        <MenuButton
          label="News"
          icon={faNewspaper}
          path="news"
          preSelected={page}
          onClick={path => setPage(path)}
        />
        <MenuButton
          label="Files"
          icon={faHardDrive}
          path="files"
          preSelected={page}
          onClick={path => setPage(path)}
        />
      </div>
    </>
  );
};
