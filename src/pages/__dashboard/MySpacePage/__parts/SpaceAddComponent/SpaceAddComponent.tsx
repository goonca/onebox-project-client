import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext, useEffect, useState } from 'react';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import style from './SpaceAddComponent.module.scss';

type SpaceAddComponentProps = {
  type?: string;
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
      <div className={style['add-component']}>
        <hr />
        {editMode && (
          <div className={style['circle']}>
            <FontAwesomeIcon icon={faPlus} />
          </div>
        )}
      </div>
    </>
  );
};
