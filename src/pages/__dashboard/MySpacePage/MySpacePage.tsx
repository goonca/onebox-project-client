import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useServices } from 'shared/hooks/useServices';
import {
  BlockModel,
  FilterModel,
  LayoutModel,
  SpaceModel
} from 'shared/types/api-type';
import style from './MySpacePage.module.scss';
import { SpaceEditor } from './__parts/SpaceEditor/SpaceEditor';
import { LayoutTemplate } from './__parts/LayoutTemplate/LayoutTemplate';
import { throttle } from 'lodash';
import {
  addBlockToLayout,
  deleteBlock,
  findLayoutByBlock,
  moveBlockDown,
  moveBlockUp,
  updateBlockOnLayout,
  updateFilterOnBlock,
  updateLayoutOnSpace
} from 'shared/utils/spaceEditorUtils';
import { BlockActionTypeEnum } from './__parts/Block/Block';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import { PageContext } from 'shared/context/PageContext';
import { BlockEditor } from './__parts/Block/BlockEditor';

export const MySpacePage: React.FC = () => {
  const { listLayout } = useServices();
  const [mySpace, setMySpace] = useState<SpaceModel>({ layouts: [] });
  const mySpaceRef = useRef<SpaceModel>();
  const [editing, setEditing] = useState<boolean>(false);
  const pageContext = useContext(PageContext);
  const { trigger, listen } = useEvent();

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

      case BlockActionTypeEnum.EDIT:
        trigger(EventType.EDIT_COMPONENT, {
          model: block,
          editor: <BlockEditor block={block} />
        });
        break;
    }
  };

  const handleAddComponent = useCallback(
    throttle(
      (layout: LayoutModel, position: { x: number; y: number }) => {
        setMySpace(
          updateLayoutOnSpace(mySpace, addBlockToLayout(layout, position))
        );
      },
      1000,
      { leading: true, trailing: false }
    ),
    []
  );

  const handleUpdateFilterOnBlock = useCallback(
    (block: BlockModel, filter: FilterModel) => {
      const newBlock = updateFilterOnBlock(block, filter);
      const newLayout = updateBlockOnLayout(
        findLayoutByBlock(mySpaceRef.current ?? mySpace, newBlock) ?? {},
        newBlock
      );

      const newSpace = updateLayoutOnSpace(
        mySpaceRef.current ?? mySpace,
        newLayout
      );

      trigger(EventType.EDIT_COMPONENT, {
        model: block,
        editor: <BlockEditor block={block} />
      });

      setMySpace(newSpace);
    },
    []
  );

  const addListeners = () => {
    listen(EventType.UPDATE_FILTER_ON_BLOCK, ({ detail }: any) => {
      //console.log(EventType.UPDATE_FILTER_ON_BLOCK, detail);
      handleUpdateFilterOnBlock(detail.block, detail.filter);
    });

    listen(EventType.UPDATE_BLOCK_ON_LAYOUT, ({ detail }: any) => {
      console.log(EventType.UPDATE_BLOCK_ON_LAYOUT, detail);
    });
  };

  useEffect(() => {
    setEditing(!!pageContext.editComponent);
    //console.log(pageContext.editComponent);
  }, [pageContext.editComponent]);

  useEffect(() => {
    findMySpace();
    addListeners();
  }, []);

  useEffect(() => {
    //addListeners();
    mySpaceRef.current = mySpace;
  }, [mySpace]);

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
