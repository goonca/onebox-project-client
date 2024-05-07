import { FigureProps } from 'components/compose/Figure';
import { QuoteProps } from 'components/compose/Quote';
import style from './FreeEditor.module.scss';
import React, { useEffect, useState } from 'react';
import { AddComponent } from '../AddComponent/AddComponent';
import { TextProps } from 'components/compose/Text';
import { useComponent } from 'shared/hooks/useComponent';
import { Tooltip } from '@mui/material';
import { Frame } from 'components/compose/Frame/Frame';

export type ComponentProps = FigureProps | QuoteProps | TextProps;
export type ComponentType = 'Figure' | 'Quote' | 'Text';
export type EditorComponentType = {
  type: ComponentType;
  position?: number;
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
  const { getComponentByType } = useComponent();

  const onOpen = (opened: boolean) => {
    props.onComponentsOpen && props.onComponentsOpen(opened);
  };

  const onAddComponent = (position: number, type: ComponentType) => {
    const component = {
      type,
      props: {}
    };
    components?.splice(position, 0, { type, position });
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
            showTooltip={components?.length == 0}
          />
          {components?.map((comp, index) => {
            let node = getComponentByType(comp.type);
            //@ts-ignore
            const element = React.createElement(node, comp.props);
            return (
              <div key={index}>
                <Frame component={comp}>{element}</Frame>

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
