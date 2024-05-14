import { useContext, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { EditorContext } from 'shared/context/EditorContext';

import { Header } from '../Header/Header';
import { Menu } from '../Menu/Menu';
import style from './Layout.module.scss';

export const Layout = () => {
  const path = new URLSearchParams(window.location.search).get('path');

  path && Navigate({ to: '/dashboard/' + path });

  return <LayoutContainer />;
};

//Split this was an workaround to not violate react hooks policies.
// it is impossible to declare [opened, setOpened] before the Navigate() up there
const LayoutContainer = () => {
  const [opened, setOpened] = useState<boolean>(true);

  return (
    <>
      <EditorContext.Provider value={{ maximized: !opened }}>
        <div
          data-component="layout"
          className={`${style['layout']} ${!opened && style['closed']}`}
          id="layoutWrapper"
        >
          <div className={style['left-side']}>
            <div className={style['fix-width']}></div>
            <Menu />
            <div
              className={style['changer']}
              onClick={() => setOpened(!opened)}
            ></div>
          </div>
          <div className={style['right-side']}>
            <Header />
            <Outlet />
          </div>
        </div>
      </EditorContext.Provider>
    </>
  );
};
