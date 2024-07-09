import { useEffect, useState } from 'react';
import { useServices } from 'shared/hooks/useServices';
import { BlockModel, LayoutModel, SpaceModel } from 'shared/types/api-type';
import style from './MySpacePage.module.scss';
import { SpaceEditor } from './__parts/SpaceEditor/SpaceEditor';
import { LayoutTemplate } from './__parts/LayoutTemplate/LayoutTemplate';
import { throttle } from 'lodash';
import {
  addBlockToLayout,
  deleteBlock,
  moveBlockDown,
  moveBlockUp,
  updateLayoutOnSpace
} from 'shared/utils/spaceEditorUtils';
import { BlockActionTypeEnum } from './__parts/Block/Block';

export const MySpacePage: React.FC = () => {
  const { listLayout } = useServices();
  const [mySpace, setMySpace] = useState<SpaceModel>({ layouts: [] });

  const findMySpace = async () => {
    const response = await listLayout();
    setMySpace({ ...mySpace, layouts: response.data });
  };

  const handleOnBlockAction = (
    layout: LayoutModel,
    block: BlockModel,
    actionType: BlockActionTypeEnum
  ) => {
    let newLayout;
    switch (actionType) {
      case BlockActionTypeEnum.MOVE_UP:
        (newLayout = moveBlockUp(layout, block)) &&
          setMySpace(updateLayoutOnSpace(mySpace, newLayout));
        break;

      case BlockActionTypeEnum.MOVE_DOWN:
        (newLayout = moveBlockDown(layout, block)) &&
          setMySpace(updateLayoutOnSpace(mySpace, newLayout));
        break;
      case BlockActionTypeEnum.DELETE:
        (newLayout = deleteBlock(layout, block)) &&
          setMySpace(updateLayoutOnSpace(mySpace, newLayout));
        break;
    }
  };

  const handleAddComponent = throttle(
    (layout: LayoutModel, position: { x: number; y: number }) => {
      setMySpace(
        updateLayoutOnSpace(mySpace, addBlockToLayout(layout, position))
      );
    },
    1000,
    { leading: true, trailing: false }
  );

  useEffect(() => {
    findMySpace();
  }, []);

  return (
    <>
      <div className={style['myspace-page']}>
        <SpaceEditor space={mySpace}>
          {mySpace.layouts &&
            mySpace.layouts.map(layout => {
              return (
                <LayoutTemplate
                  layout={layout}
                  key={layout.id}
                  onBlockAction={handleOnBlockAction}
                  onAddComponent={handleAddComponent}
                />
              );
            })}
        </SpaceEditor>
      </div>
    </>
  );
};
