import { ReactNode, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PageContext } from 'shared/context/PageContext';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import { ModelObject } from 'shared/types/api-type';
import { ComponentEditorPopover } from '../ComponentEditorPopover/ComponentEditorPopover';

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
  const [menuOpen, setMenuOpened] = useState<boolean>(true);
  const [editComponent, setEditComponent] = useState<{
    model: ModelObject;
    editor: ReactNode;
  }>();
  const { listen } = useEvent();

  useEffect(() => {
    listen(EventType.EDIT_COMPONENT, ({ detail }: any) =>
      setEditComponent(detail)
    );
  }, []);

  return (
    <>
      <PageContext.Provider value={{ menuOpen: !menuOpen, editComponent }}>
        <div
          data-component="layout"
          className={`${style['layout']} ${!menuOpen && style['closed']}`}
          id="layoutWrapper"
        >
          <div className={style['left-side']}>
            <div className={style['fix-width']}></div>
            <Menu />
            <div
              className={style['changer']}
              onClick={() => setMenuOpened(!menuOpen)}
            ></div>
          </div>
          <div className={style['right-side']}>
            <div>
              <Header />
              <Outlet />
            </div>
          </div>
        </div>
        <ComponentEditorPopover title="test" />
      </PageContext.Provider>
    </>
  );
};
