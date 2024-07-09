import { useContext, useEffect, useState } from 'react';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import { EventType, useEvent } from 'shared/hooks/useEvent';
import { LayoutModel } from 'shared/types/api-type';
import { Block } from '../../Block/Block';
import { SpaceAddComponent } from '../../SpaceAddComponent/SpaceAddComponent';
import style from './ThreeEqualColumns.module.scss';

type TemplateProps = {
  layout: LayoutModel;
  onAddComponent: (
    layout: LayoutModel,
    position: { x: number; y: number }
  ) => void;
};

export const ThreeEqualColumns: React.FC<TemplateProps> = (
  props: TemplateProps
) => {
  const [layout, setlayout] = useState<LayoutModel>();
  const spaceEditorContext = useContext(SpaceEditorContext);
  const { trigger } = useEvent();

  const handleAddComponent = (x: number, y: number) => {
    console.log('trigger');
    layout && props.onAddComponent(layout, { x, y });
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
                    <div key={block.id}>
                      <Block block={block} />
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
