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
import { PageContext } from 'shared/context/PageContext';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import {
  BlockModel,
  BlockTypeEnum,
  NewsPresentationEnum
} from 'shared/types/api-type';
import { compareId } from 'shared/utils/spaceEditorUtils';
import style from './Block.module.scss';

type BlockProps = {
  block: BlockModel;
  onAction: (block: BlockModel, actionType: BlockActionTypeEnum) => void;
};

export enum BlockActionTypeEnum {
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  MOVE_UP = 'MOVE_UP',
  MOVE_DOWN = 'MOVE_DOWN'
}

export const Block: React.FC<BlockProps> = (props?: BlockProps) => {
  const spaceEditorContext = useContext(SpaceEditorContext);
  const pageContext = useContext(PageContext);
  const [block, setBlock] = useState<BlockModel>();
  const [editMode, setEditMode] = useState<boolean>(
    spaceEditorContext.editMode ?? false
  );

  const handleAction = (actionType: BlockActionTypeEnum) => {
    props?.onAction(props.block, actionType);
  };

  const handleHeaderClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  useEffect(
    () => setEditMode(spaceEditorContext.editMode ?? false),
    [spaceEditorContext.editMode]
  );

  useEffect(() => {
    setBlock(props?.block);
  }, [props, pageContext.editComponent]);

  return (
    <>
      <div
        key={`${block?.id}-${block?.columns}`}
        className={`${style['block']} ${
          compareId(pageContext.editComponent?.model ?? {}, block ?? {}) &&
          pageContext.popoverOpen &&
          style['selected']
        } ${editMode && style['edit-mode']}  ${
          !pageContext.popoverOpen && style['hoverable']
        }`}
      >
        <div
          className={style['header']}
          onMouseDown={handleHeaderClick}
          onClick={handleHeaderClick}
        >
          <div>
            <Tooltip title="Properties" arrow>
              <Button onClick={() => handleAction(BlockActionTypeEnum.EDIT)}>
                <FontAwesomeIcon icon={faGear} />
              </Button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <Button onClick={() => handleAction(BlockActionTypeEnum.DELETE)}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Tooltip>
            <hr />
            <Tooltip title="Move Up" arrow>
              <Button onClick={() => handleAction(BlockActionTypeEnum.MOVE_UP)}>
                <FontAwesomeIcon icon={faChevronUp} />
              </Button>
            </Tooltip>
            <Tooltip title="Move Up" arrow>
              <Button
                onClick={() => handleAction(BlockActionTypeEnum.MOVE_DOWN)}
              >
                <FontAwesomeIcon icon={faChevronDown} />
              </Button>
            </Tooltip>
          </div>
        </div>
        {block && (
          <div
            key={`${block.id}-${block.columns}`}
            className={style['wrapper']}
            style={{
              opacity: (spaceEditorContext.contrast ?? 50) / 100,
              gridTemplateColumns: `repeat(${block.columns}, minmax(0, 1fr))`
            }}
          >
            {block.type == BlockTypeEnum.NEWS && !!block.news ? (
              block.news.map((n, i) => (
                <div className={style['content']} key={`${n.id}`}>
                  <>
                    {block.presentation == NewsPresentationEnum.VERTICAL ? (
                      <NewsVertical
                        news={n}
                        customDisplay={block.displays?.find(
                          d => d.position == i
                        )}
                      />
                    ) : (
                      <NewsHorizontal
                        news={n}
                        customDisplay={block.displays?.find(
                          d => d.position == i
                        )}
                      />
                    )}
                  </>
                </div>
              ))
            ) : (
              <div className={style['empty-block']}>empty block</div>
            )}
          </div>
        )}
      </div>
    </>
  );
};
