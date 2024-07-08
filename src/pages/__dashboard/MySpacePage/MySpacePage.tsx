import { useCallback, useEffect, useState } from 'react';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import { useServices } from 'shared/hooks/useServices';
import { LayoutModel, SpaceModel } from 'shared/types/api-type';
import style from './MySpacePage.module.scss';
import { SpaceEditor } from './__parts/SpaceEditor/SpaceEditor';
import { ThreeEqualColumns } from './__parts/__templates/ThreeEqualColumns/ThreeEqualColumns';
import { throttle } from 'lodash';

type MySpacePageProps = {
  type?: string;
};

export const MySpacePage: React.FC<MySpacePageProps> = (
  props?: MySpacePageProps
) => {
  const { listLayout } = useServices();
  const { listen } = useEvent();
  const [mySpace, setMySpace] = useState<SpaceModel>({ layouts: [] });

  const findMySpace = async () => {
    const response = await listLayout();
    setMySpace({ ...mySpace, layouts: response.data });
  };

  const addBlockToLayout = useCallback(
    throttle(
      (layout: LayoutModel, position: { x: number; y: number }) => {
        console.log(layout, position);

        const rndInt = Math.floor(Math.random() * 600) + 1;

        layout.blocks = layout.blocks ?? [];
        layout.blocks.splice(position.y, 0, {
          id: rndInt,
          positionX: position.x,
          positionY: position.y
        });

        const layouts = mySpace.layouts?.map(_layout => {
          return _layout.id == layout.id ? layout : _layout;
        });

        setMySpace({ ...mySpace, layouts });
      },
      1000,
      { leading: true, trailing: false }
    ),
    []
  );

  const addListeners = () => {
    console.log('mySpace', mySpace);
    listen(EventType.ADD_BLOCK_TO_LAYOUT, ({ detail }: any) => {
      console.log('mySpace', mySpace);
      addBlockToLayout(detail.layout, { x: detail.x, y: detail.y });
    });
  };

  useEffect(() => {
    findMySpace();
    //addListeners();
    setTimeout(() => {
      console.log('timeout', mySpace);
      //setMySpace({ ...mySpace });
    }, 5000);
  }, []);

  return (
    <>
      <div className={style['myspace-page']}>
        <SpaceEditor space={mySpace}>
          {mySpace.layouts &&
            mySpace.layouts.map(layout => {
              return <ThreeEqualColumns layout={layout} key={layout.id} />;
            })}
        </SpaceEditor>
      </div>
    </>
  );
};
