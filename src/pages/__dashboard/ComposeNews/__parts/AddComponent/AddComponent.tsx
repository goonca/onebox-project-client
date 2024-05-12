import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from '@mui/material';
import { useState } from 'react';
import { ComponentType } from 'shared/types/api-type';

import { ComponentsEditor } from '../ComponentsEditor/ComponentsEditor';
import style from './AddComponent.module.scss';

type AddComponentProps = {
  onOpen?: (opened: boolean) => void;
  onAddComponent: (position: number, type: ComponentType) => void;
  position: number;
  showTooltip?: boolean;
};

export const AddComponent: React.FC<AddComponentProps> = (
  props?: AddComponentProps
) => {
  const [opened, setOpened] = useState<boolean>(false);
  const toggleOpened = () => {
    setOpened(!opened);
    props?.onOpen && props.onOpen(!opened);
  };

  const addComponent = (type: ComponentType) => {
    toggleOpened();
    props?.onAddComponent(props?.position, type);
  };

  return (
    <>
      <div
        className={`${style['add-component']} ${opened ? style['opened'] : ''}`}
      >
        <div className={style['half-circle']}></div>
        <div className={`${style['half-circle']} ${style['rotate']}`}></div>
        <Tooltip
          title="Start adding components here"
          open={(props?.showTooltip && !opened) ?? false}
          arrow
        >
          <span className={style['open-button']} onClick={toggleOpened}>
            <FontAwesomeIcon icon={opened ? faClose : faPlus} />
          </span>
        </Tooltip>
        <div className={style['wrapper']}>
          <div className={style['content']}>
            <ComponentsEditor onAddComponent={addComponent}></ComponentsEditor>
          </div>
        </div>
      </div>
    </>
  );
};
