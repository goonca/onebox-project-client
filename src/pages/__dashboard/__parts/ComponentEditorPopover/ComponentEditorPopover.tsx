import style from './ComponentEditorPopover.module.scss';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { PageContext } from 'shared/context/PageContext';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import { ModelObject } from 'shared/types/api-type';

type ComponentEditorPopoverProps = {
  title?: string;
  children?: ReactNode;
};

export const ComponentEditorPopover: React.FC<ComponentEditorPopoverProps> = (
  props?: ComponentEditorPopoverProps
) => {
  const [maximized, setMaximized] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);
  const pageContext = useContext(PageContext);
  const [editComponent, setEditComponent] = useState<{
    model: ModelObject;
    editor: ReactNode;
  }>();
  const { trigger } = useEvent();
  //const [component, setComponent] = useState<ReactNode>();

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleEditComponent = (editComponent?: {
    model: ModelObject;
    editor: ReactNode;
  }) => {
    setEditComponent(editComponent);
    editComponent && trigger(EventType.OPEN_EDIT_POPOVER, true);
  };

  const handleClosePopover = () => {
    trigger(EventType.OPEN_EDIT_POPOVER, false);
  };

  useEffect(() => {
    setMaximized(pageContext.menuOpen);
  }, [pageContext.menuOpen]);

  useEffect(() => {
    handleEditComponent(pageContext.editComponent);
  }, [pageContext.editComponent]);

  useEffect(() => {
    document.body.style.paddingBottom = pageContext.popoverOpen ? '350px' : '0';
    setOpen(pageContext.popoverOpen);
  }, [pageContext.popoverOpen]);

  return (
    <>
      <div
        onClick={handleEditorClick}
        onMouseDown={handleEditorClick}
        className={`
        ${style['component-editor-popup']}
        ${maximized && style['maximized']}
        ${open && style['open']}`}
      >
        <div className={style['header']}>
          <h1>{props?.title}</h1>
          <Button onClick={() => handleClosePopover()}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
        <div className={style['content']}>
          <div> {editComponent?.editor}</div>
        </div>
      </div>
    </>
  );
};
