import { useEffect, useState } from 'react';
import { useServices } from 'shared/hooks/useServices';
import { BlockModel, LayoutModel, SpaceModel } from 'shared/types/api-type';
import style from './MySpacePage.module.scss';
import { SpaceEditor } from './__parts/SpaceEditor/SpaceEditor';
import { ThreeEqualColumns } from './__parts/__templates/ThreeEqualColumns/ThreeEqualColumns';
import { throttle } from 'lodash';

export const MySpacePage: React.FC = () => {
  const { listLayout } = useServices();
  const [mySpace, setMySpace] = useState<SpaceModel>({ layouts: [] });

  const findMySpace = async () => {
    const response = await listLayout();
    setMySpace({ ...mySpace, layouts: response.data });
  };

  const addBlockToLayout = throttle(
    (layout: LayoutModel, position: { x: number; y: number }) => {
      const rndInt = Math.floor(Math.random() * 600) + 1;

      layout.blocks = layout.blocks ?? [];

      let allColumns = layout.columns?.split(',').map((column, index) => {
        return layout.blocks?.filter(block => block.positionX == index);
      });

      allColumns &&
        allColumns[position.x]?.splice(position.y, 0, {
          id: rndInt,
          positionX: position.x,
          positionY: position.y
        });

      allColumns = allColumns?.map(blocks => {
        return blocks
          ?.map((block, index) => ({ ...block, positionY: index }))
          .sort((a, b) => a.positionY - b.positionY);
      });

      const newBlocks: BlockModel[] =
        allColumns?.reduce((flattenedArray, element) => {
          return flattenedArray?.concat(element ?? []);
        }) ?? [];

      /*layout.blocks.splice(position.y, 0, {
        id: rndInt,
        positionX: position.x,
        positionY: position.y
      });*/
      /*let positionY: number = 0;

      for (let i = 0; i < layout.blocks.length; i++) {
        if (layout.blocks[i].positionX != position.x) {
          newBlocks.push(layout.blocks[i]);
        } else {
          debugger;
          console.log(i);
          if (i <= position.y) {
            newBlocks.push({
              ...layout.blocks[i],
              positionY: positionY++
            });
          }
          if (i == position.y || (position.y == 0 && positionY == 0)) {
            newBlocks.push({
              id: rndInt,
              positionX: position.x,
              positionY: positionY++
            });
          }
          if (i > position.y) {
            newBlocks.push({
              ...layout.blocks[i],
              positionY: positionY++
            });
          }
        }
      }*/

      console.log(newBlocks);

      layout.blocks = newBlocks;

      const layouts = mySpace.layouts?.map(_layout => {
        return _layout.id == layout.id ? layout : _layout;
      });

      setMySpace({ ...mySpace, layouts });
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
                <ThreeEqualColumns
                  layout={layout}
                  key={layout.id}
                  onAddComponent={addBlockToLayout}
                />
              );
            })}
        </SpaceEditor>
      </div>
    </>
  );
};
