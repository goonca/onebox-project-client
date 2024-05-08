import { Navigate,Outlet } from 'react-router-dom';

import { Header } from '../Header/Header';
import { Menu } from '../Menu/Menu';
import style from './Layout.module.scss';

const Layout = () => {
  const path = new URLSearchParams(window.location.search).get('path');

  path && Navigate({ to: '/dashboard/' + path });

  //couldn't use state for this
  const toggleClosed = () => {
    const layoutWrapper = document.querySelector('#layoutWrapper');
    layoutWrapper?.classList.toggle(style['closed']);
  };

  return (
    <>
      <div className={style['layout']} id="layoutWrapper">
        <div className={style['left-side']}>
          <div className={style['fix-width']}></div>
          <Menu />
          <div
            className={style['changer']}
            onClick={() => toggleClosed()}
          ></div>
        </div>
        <div className={style['right-side']}>
          <Header />
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
