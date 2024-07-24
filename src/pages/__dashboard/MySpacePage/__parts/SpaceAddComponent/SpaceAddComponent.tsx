import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import style from './SpaceAddComponent.module.scss';

type SpaceAddComponentProps = {
  onClick?: (param?: any) => any;
  editMode?: boolean;
};

export const SpaceAddComponent: React.FC<SpaceAddComponentProps> = (
  props?: SpaceAddComponentProps
) => {
  const spaceEditorContext = useContext(SpaceEditorContext);
  const [editMode, setEditMode] = useState<boolean>(
    spaceEditorContext.editMode ?? false
  );

  useEffect(
    () => setEditMode(spaceEditorContext.editMode ?? false),
    [spaceEditorContext.editMode]
  );

  return (
    <>
      {editMode && (
        <div className={style['add-component']} onClick={props?.onClick}>
          <hr />

          <div className={style['circle']}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
        </div>
      )}
    </>
  );
};
