import style from './ComponentEditorPopup.module.scss';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import React, { FC, ReactNode, useContext, useEffect, useState } from 'react';
import { useEvent } from 'shared/hooks/useEvent';
import { EditorContext } from 'shared/context/EditorContext';

type ComponentEditorPopupProps = {
  title?: string;
  children?: ReactNode;
};

export const ComponentEditorPopup: React.FC<ComponentEditorPopupProps> = (
  props?: ComponentEditorPopupProps
) => {
  const [maximized, setMaximized] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(true);
  const { trigger } = useEvent();
  const editorContext = useContext(EditorContext);
  //const [component, setComponent] = useState<ReactNode>();

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(() => {
    setMaximized(editorContext.maximized);
  }, [editorContext]);

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
          <Button onClick={() => setOpen(false)}>
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </div>
        <div className={style['content']}>
          <div> {props?.children}</div>
        </div>
      </div>
    </>
  );
};
