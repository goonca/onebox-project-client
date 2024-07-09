import { useContext, useEffect, useState } from 'react';
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
  const [layout, setlayout] = useState<LayoutModel>();
  const spaceEditorContext = useContext(SpaceEditorContext);

  const handleAddComponent = (x: number, y: number) => {
    layout && props.onAddComponent(layout, { x, y });
  };

  const handleOnAction = (
    block: BlockModel,
    actionType: BlockActionTypeEnum
  ) => {
    layout && props.onBlockAction(layout, block, actionType);
  };

  useEffect(() => {
    setlayout({ ...props.layout });
  }, [props.layout]);

  return (
    <>
      <div
        className={`${style['template']} ${
          spaceEditorContext.editMode && style['edit-mode']
        }`}
      >
        {layout?.columns?.split(',').map((columnWidth, x) => {
          return (
            <div style={{ width: `${columnWidth}%` }} key={x}>
              <SpaceAddComponent onClick={() => handleAddComponent(x, 0)} />
              {layout?.blocks
                ?.filter(l => l.positionX == x)
                .map((block, y) => {
                  return (
                    <div key={block.id + '-' + block.tempId}>
                      <Block block={block} onAction={handleOnAction} />
                      <SpaceAddComponent
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
