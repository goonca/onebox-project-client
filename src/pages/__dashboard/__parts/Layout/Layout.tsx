import { ReactNode, useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { PageContext } from 'shared/context/PageContext';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import { useServices } from 'shared/hooks/useServices';
import { ModelObject, SectionModel } from 'shared/types/api-type';
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
  const [menuOpen, setMenuOpen] = useState<boolean>(true);
  const [editPopoverOpen, setEditPopoverOpen] = useState<boolean>(false);
  const [sections, setSections] = useState<SectionModel[]>([]);
  const [editComponent, setEditComponent] = useState<{
    model: ModelObject;
    editor: ReactNode;
  }>();
  const { listen } = useEvent();
  const { getSections } = useServices();

  useEffect(() => {
    getSections().then(({ data }) => setSections(data));
    listen(EventType.EDIT_COMPONENT, ({ detail }: any) =>
      setEditComponent(detail)
    );
    listen(EventType.OPEN_EDIT_POPOVER, ({ detail }: any) => {
      console.log('OPEN_EDIT_POPOVER', detail);
      setEditPopoverOpen(detail);
    });
  }, []);

  return (
    <>
      <PageContext.Provider
        value={{
          menuOpen: !menuOpen,
          editComponent,
          sections,
          popoverOpen: editPopoverOpen
        }}
      >
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
              onClick={() => setMenuOpen(!menuOpen)}
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
