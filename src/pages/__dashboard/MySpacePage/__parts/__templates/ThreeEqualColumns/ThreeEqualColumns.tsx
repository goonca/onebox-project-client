import { useContext, useEffect, useState } from 'react';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import { LayoutModel } from 'shared/types/api-type';
import { Block } from '../../Block/Block';
import { SpaceAddComponent } from '../../SpaceAddComponent/SpaceAddComponent';
import style from './ThreeEqualColumns.module.scss';

type TemplateProps = {
  layout?: LayoutModel;
};

export const ThreeEqualColumns: React.FC<TemplateProps> = (
  props: TemplateProps
) => {
  const [layout, setlayout] = useState<LayoutModel>();
  const spaceEditorContext = useContext(SpaceEditorContext);

  useEffect(() => {
    setlayout(props.layout);
  }, [props.layout]);

  return (
    <>
      <div
        className={`${style['template']} ${
          spaceEditorContext.editMode && style['edit-mode']
        }`}
      >
        <div className={style['column-1']}>
          <SpaceAddComponent />
          {layout?.blocks
            ?.filter(l => l.positionX == 0)
            .map(block => {
              return (
                <>
                  <Block block={block} />
                  <SpaceAddComponent />
                </>
              );
            })}
        </div>
        <div className={style['column-2']}>
          <SpaceAddComponent />
          {layout?.blocks
            ?.filter(l => l.positionX == 1)
            .map(block => {
              return (
                <>
                  <Block block={block} />
                  <SpaceAddComponent />
                </>
              );
            })}
        </div>
        <div className={style['column-3']}>
          <SpaceAddComponent />
          {layout?.blocks
            ?.filter(l => l.positionX == 0)
            .map(block => {
              return (
                <>
                  <Block block={block} />
                  <SpaceAddComponent />
                </>
              );
            })}
        </div>
      </div>
    </>
  );
};
