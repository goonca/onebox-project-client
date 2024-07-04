import { useEffect, useState } from 'react';
import { useServices } from 'shared/hooks/useServices';
import { LayoutModel, SpaceModel } from 'shared/types/api-type';
import style from './MySpacePage.module.scss';
import { SpaceEditor } from './__parts/SpaceEditor/SpaceEditor';
import { ThreeEqualColumns } from './__parts/__templates/ThreeEqualColumns/ThreeEqualColumns';

type MySpacePageProps = {
  type?: string;
};

export const MySpacePage: React.FC<MySpacePageProps> = (
  props?: MySpacePageProps
) => {
  const { listLayout } = useServices();
  const [mySpace, setMySpace] = useState<SpaceModel>({ layouts: [] });

  const findMySpace = async () => {
    const response = await listLayout();
    setMySpace({ ...mySpace, layouts: response.data });
  };

  useEffect(() => {
    findMySpace();
  }, []);

  return (
    <>
      <div className={style['myspace-page']}>
        <SpaceEditor space={mySpace}>
          {mySpace.layouts?.length &&
            mySpace.layouts.map(layout => {
              return <ThreeEqualColumns layout={layout} />;
            })}
        </SpaceEditor>
      </div>
    </>
  );
};
