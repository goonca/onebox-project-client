// @ts-nocheck.s
import { Figure, FigureProps } from 'components/compose/Figure';
import { Quote, QuoteProps } from 'components/compose/Quote';
import style from './FreeEditor.module.scss';
import React, { useEffect, useState } from 'react';
import { AddComponent } from '../AddComponent/AddComponent';
import { TextProps } from 'components/compose/Text';
import { useComponent } from 'shared/hooks/useComponent';

export type ComponentProps = FigureProps | QuoteProps | TextProps;
export type ComponentName = 'Figure' | 'Quote' | 'Text';
export type EditorComponentType = {
  name: ComponentName;
  props?: ComponentProps;
};

export type ComponentEditProps = {
  onComponentsOpen?: (opened: boolean) => void;
  onChange?: (components?: EditorComponentType[]) => void;
  components?: EditorComponentType[];
  newsId?: number;
};

export const FreeEditor: React.FC<ComponentEditProps> = (
  props: ComponentEditProps
) => {
  const [components, setCompoenents] = useState<EditorComponentType[]>();
  const { getComponentByName } = useComponent();

  const onOpen = (opened: boolean) => {
    props.onComponentsOpen && props.onComponentsOpen(opened);
  };

  const onAddComponent = (position: number, name: ComponentName) => {
    const component = {
      name,
      props: {}
    };
    components?.splice(position, 0, { name });
    props.onChange && props.onChange(components);

    //console.log(position, name);
  };

  useEffect(() => {
    setCompoenents(props.components);
  }, [props.components]);

  return (
    <>
      <div className={style['free-editor']}>
        <div className={style['wrapper']}>
          <AddComponent
            onOpen={onOpen}
            position={0}
            onAddComponent={onAddComponent}
          />
          {components?.map((c, index) => {
            let node = getComponentByName(c.name);
            //@ts-ignores
            const element = React.createElement(node, c.props);
            return (
              <div key={index}>
                {element}
                <AddComponent
                  onOpen={onOpen}
                  position={index + 1}
                  onAddComponent={onAddComponent}
                />
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};
