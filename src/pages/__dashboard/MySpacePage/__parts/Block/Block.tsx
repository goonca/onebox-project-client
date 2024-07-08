import {
  faChevronDown,
  faChevronUp,
  faGear,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@mui/material';
import NewsHorizontal from 'components/compose/NewsHorizontal/NewsHorizontal';
import NewsVertical from 'components/compose/NewsVertical/NewsVertical';
import { useContext, useEffect, useState } from 'react';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import { BlockModel } from 'shared/types/api-type';
import style from './Block.module.scss';

type BlockProps = {
  block: BlockModel;
};

export const Block: React.FC<BlockProps> = (props?: BlockProps) => {
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
      <div className={`${style['block']} ${editMode && style['edit-mode']}`}>
        <div className={style['header']}>
          <div>
            <Tooltip title="Properties" arrow>
              <Button onClick={() => {}}>
                <FontAwesomeIcon icon={faGear} />
              </Button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <Button onClick={() => {}}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Tooltip>
            <hr />
            <Tooltip title="Move Up" arrow>
              <Button onClick={() => {}}>
                <FontAwesomeIcon icon={faChevronUp} />
              </Button>
            </Tooltip>
            <Tooltip title="Move Up" arrow>
              <Button onClick={() => {}}>
                <FontAwesomeIcon icon={faChevronDown} />
              </Button>
            </Tooltip>
          </div>
        </div>
        <div
          className={style['wrapper']}
          style={{
            opacity: (spaceEditorContext.contrast ?? 50) / 100,
            gridTemplateColumns: `repeat(${props?.block.columns}, minmax(0, 1fr))`
          }}
        >
          {props?.block.news?.map(n => (
            <div className={style['content']} key={n.id}>
              {props?.block.display == 0 ? (
                <NewsVertical news={n} />
              ) : (
                <NewsHorizontal news={n} />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
