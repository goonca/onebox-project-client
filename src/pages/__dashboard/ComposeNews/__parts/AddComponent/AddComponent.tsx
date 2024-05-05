import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './AddComponent.module.scss';
import { faClose, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import { ComponentsEditor } from '../ComponentsEditor/ComponentsEditor';
import { ComponentName, EditorComponentType } from '../FreeEditor/FreeEditor';

type AddComponentProps = {
  onOpen?: (opened: boolean) => void;
  onAddComponent: (position: number, name: ComponentName) => void;
  position: number;
};

export const AddComponent: React.FC<AddComponentProps> = (
  props?: AddComponentProps
) => {
  const [opened, setOpened] = useState<boolean>(false);
  const toggleOpened = () => {
    setOpened(!opened);
    props?.onOpen && props.onOpen(!opened);
  };

  const addComponent = (name: ComponentName) => {
    toggleOpened();
    props?.onAddComponent(props?.position, name);
  };

  return (
    <>
      <div
        className={`${style['add-component']} ${opened ? style['opened'] : ''}`}
      >
        <div className={style['half-circle']}></div>
        <div className={`${style['half-circle']} ${style['rotate']}`}></div>
        <span className={style['open-button']} onClick={toggleOpened}>
          <FontAwesomeIcon icon={opened ? faClose : faPlus} />
        </span>
        <div className={style['wrapper']}>
          <div className={style['content']}>
            <ComponentsEditor onAddComponent={addComponent}></ComponentsEditor>
          </div>
        </div>
      </div>
    </>
  );
};
