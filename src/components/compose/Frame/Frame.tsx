import { Button } from '@mui/material';
import style from './Frame.module.scss';
import { EditorComponentType } from 'pages/__dashboard/ComposeNews/__parts/FreeEditor/FreeEditor';
import { ReactNode, useEffect, useState } from 'react';
import { faGear, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export type FrameProps = {
  component?: EditorComponentType;
  children?: ReactNode;
};

export const Frame = ({ component, children }: FrameProps) => {
  const [selected, setSelected] = useState<boolean>(false);

  return (
    <>
      <div
        className={`${style['frame']} ${selected && style['selected']}`}
        onMouseEnter={() => setSelected(true)}
        onMouseLeave={() => setSelected(false)}
      >
        <span>{component?.type}</span>
        <div className={style['wrapper']}>
          <div className={style['menu']}>
            <div>
              <Button variant="outlined">
                <FontAwesomeIcon icon={faGear} />
              </Button>
              <div className={style['divider']}>&nbsp;</div>
              <Button variant="outlined">
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </div>
          </div>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
