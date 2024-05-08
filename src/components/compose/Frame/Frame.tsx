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
  onMoveUp?: (component: ComponentModel) => void;
  onMoveDown?: (component: ComponentModel) => void;
  isFirst?: boolean;
  editMode?: boolean;
  isLast?: boolean;
  selectedPosition?: number;
};

export const Frame = ({
  component,
  children,
  onDelete,
  onMoveUp,
  onMoveDown,
  isFirst,
  editMode,
  isLast,
  selectedPosition
}: FrameProps) => {
  const [selected, setSelected] = useState<boolean>(false);
  const deleteComponent = () => {
    onDelete && onDelete(component);
  };
  const onMoveUpComponent = () => {
    onMoveUp && onMoveUp(component);
  };
  const onMoveDownComponent = () => {
    onMoveDown && onMoveDown(component);
  };

  useEffect(() => {
    if (
      selectedPosition !== undefined &&
      selectedPosition !== component.position
    ) {
      setSelected(false);
    }
    if (
      selectedPosition !== undefined &&
      selectedPosition === component.position
    ) {
      setSelected(true);
    }
  }, [selectedPosition]);

  const classnames = `${style['frame']} ${
    (selected || selectedPosition == component.position) && style['selected']
  } ${selectedPosition !== undefined && style['n-selected']}`;

  const showTooltip = !(
    selectedPosition !== undefined && selectedPosition !== component.position
  );

  const __setSelected = (__selected: boolean) => {
    if (selectedPosition !== undefined || !editMode) {
      return;
    }
    setSelected(__selected);
  };

  useEffect(() => {
    selectedPosition === undefined && setSelected(false);
  }, [selectedPosition]);

  return (
    <>
      <div
        className={classnames}
        onMouseMove={() => __setSelected(true)}
        onMouseLeave={() => __setSelected(false)}
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
            {showTooltip ? (
              <>
                <Tooltip title="Move Up" arrow>
                  <Button
                    disabled={isFirst}
                    onClick={() => onMoveUpComponent()}
                  >
                    <FontAwesomeIcon icon={faChevronUp} />
                  </Button>
                </Tooltip>
                <Tooltip title="Move Down" arrow>
                  <Button
                    disabled={isLast}
                    onClick={() => onMoveDownComponent()}
                  >
                    <FontAwesomeIcon icon={faChevronDown} />
                  </Button>
                </Tooltip>
              </>
            ) : (
              <>
                <Button disabled={isFirst} onClick={() => onMoveUpComponent()}>
                  <FontAwesomeIcon icon={faChevronUp} />
                </Button>
                <Button disabled={isLast} onClick={() => onMoveDownComponent()}>
                  <FontAwesomeIcon icon={faChevronDown} />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className={style['wrapper']}>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
