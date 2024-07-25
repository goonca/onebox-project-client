import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { useContext, useEffect, useState } from 'react';
import { PageContext } from 'shared/context/PageContext';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import { BlockModel, LayoutModel } from 'shared/types/api-type';
import { Block, BlockActionTypeEnum } from '../Block/Block';
import { SpaceAddComponent } from '../SpaceAddComponent/SpaceAddComponent';
import style from './LayoutTemplate.module.scss';

type TemplateProps = {
  layout: LayoutModel;
  onAddComponent: (
    layout: LayoutModel,
    position: { x: number; y: number }
  ) => void;
  onBlockAction: (
    layout: LayoutModel,
    block: BlockModel,
    actionType: BlockActionTypeEnum
  ) => void;
};

export const LayoutTemplate: React.FC<TemplateProps> = (
  props: TemplateProps
) => {
  const pageContext = useContext(PageContext);
  const [layout, setLayout] = useState<LayoutModel>();
  const spaceEditorContext = useContext(SpaceEditorContext);
  const [editMode, setEditMode] = useState<boolean>(
    spaceEditorContext.editMode ?? false
  );

  const handleAddComponent = (x: number, y: number) => {
    layout && props.onAddComponent(layout, { x, y });
  };

  const handleOnAction = (
    block: BlockModel,
    actionType: BlockActionTypeEnum
  ) => {
    layout && props.onBlockAction(layout, block, actionType);
  };

  const handleLeftArrowClick = (columnIndex: number) => {
    const newColumns = layout?.columns?.split(',').map((column, index) => {
      return index == columnIndex - 1
        ? parseInt(column) - 5
        : index == columnIndex
        ? parseInt(column) + 5
        : column;
    });
    const isValid = !!!newColumns?.find(c => parseInt(c as string) < 20);
    isValid && setLayout({ ...layout, columns: newColumns?.join(',') });
  };

  const handleRightArrowClick = (columnIndex: number) => {
    const newColumns = layout?.columns?.split(',').map((column, index) => {
      return index == columnIndex - 1
        ? parseInt(column) + 5
        : index == columnIndex
        ? parseInt(column) - 5
        : column;
    });

    const isValid = !!!newColumns?.find(c => parseInt(c as string) < 20);
    isValid && setLayout({ ...layout, columns: newColumns?.join(',') });
  };

  useEffect(() => {
    setLayout({ ...props.layout });
  }, [props.layout]);

  useEffect(
    () => setEditMode(spaceEditorContext.editMode ?? false),
    [spaceEditorContext.editMode]
  );

  useEffect(() => {
    setLayout({ ...props.layout });
  }, [props, pageContext.editComponent]);

  return (
    <>
      <div
        className={`${style['template']} ${
          spaceEditorContext.editMode && style['edit-mode']
        }`}
      >
        {layout?.columns?.split(',').map((columnWidth, x) => {
          return (
            <div
              className={style['column']}
              style={{ width: `${columnWidth}%` }}
              key={x}
            >
              <div className={style['column-controller']}>
                {x > 0 && (
                  <>
                    <Button>
                      <FontAwesomeIcon
                        icon={faArrowLeft}
                        onClick={() => handleLeftArrowClick(x)}
                      />
                    </Button>
                    <hr />
                    <Button>
                      <FontAwesomeIcon
                        icon={faArrowRight}
                        onClick={() => handleRightArrowClick(x)}
                      />
                    </Button>
                  </>
                )}
                <span>{columnWidth}%</span>
              </div>

              <SpaceAddComponent
                editMode={editMode}
                onClick={() => handleAddComponent(x, 0)}
              />
              {layout?.blocks
                ?.filter(l => l.positionX == x)
                .map((block, y) => {
                  return (
                    <div
                      key={block.id + '-' + block.tempId + '-' + block.columns}
                    >
                      <Block block={block} onAction={handleOnAction} />
                      <SpaceAddComponent
                        editMode={editMode}
                        onClick={() => handleAddComponent(x, y + 1)}
                      />
                    </div>
                  );
                })}
            </div>
          );
        })}
      </div>
    </>
  );
};
