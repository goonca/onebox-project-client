import { Button, Tooltip } from '@mui/material';
import style from './Frame.module.scss';
import { ReactNode, useEffect, useState } from 'react';
import {
  faChevronDown,
  faChevronUp,
  faGear,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ComponentModel } from 'shared/types/api-type';

export type FrameProps = {
  component: ComponentModel;
  children?: ReactNode;
  onDelete?: (component: ComponentModel) => void;
};

export const Frame = ({ component, children, onDelete }: FrameProps) => {
  const [selected, setSelected] = useState<boolean>(false);
  const deleteComponent = () => {
    onDelete && onDelete(component);
  };

  return (
    <>
      <div
        className={`${style['frame']} ${selected && style['selected']}`}
        onMouseEnter={() => setSelected(true)}
        onMouseLeave={() => setSelected(false)}
      >
        <div className={style['controls']}>
          <div>
            <label>{component?.type}</label>
            <hr />
            <Tooltip title="Edit" arrow>
              <Button>
                <FontAwesomeIcon icon={faGear} />
              </Button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <Button onClick={() => deleteComponent()}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Tooltip>
            <hr />
            <Tooltip title="Move Up" arrow>
              <Button>
                <FontAwesomeIcon icon={faChevronUp} />
              </Button>
            </Tooltip>
            <Tooltip title="Move Down" arrow>
              <Button>
                <FontAwesomeIcon icon={faChevronDown} />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div className={style['wrapper']}>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
