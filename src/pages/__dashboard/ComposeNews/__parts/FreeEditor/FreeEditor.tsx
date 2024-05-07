import { FigureProps } from 'components/compose/Figure';
import { QuoteProps } from 'components/compose/Quote';
import style from './FreeEditor.module.scss';
import React, { useEffect, useState } from 'react';
import { AddComponent } from '../AddComponent/AddComponent';
import { TextProps } from 'components/compose/Text';
import { useComponent } from 'shared/hooks/useComponent';
import { Frame } from 'components/compose/Frame/Frame';
import { ConfirmDialog } from 'pages/__dashboard/__parts/ConfirmDialog/ConfirmDialog';
import {
  ComponentModel,
  ComponentType,
  RequestStatus
} from 'shared/types/api-type';
import { useServices } from 'shared/hooks/useServices';

export type ComponentProps = FigureProps | QuoteProps | TextProps;

export type ComponentEditProps = {
  onComponentsOpen?: (opened: boolean) => void;
  onChange?: (components?: ComponentModel[]) => void;
  components?: ComponentModel[];
  newsId?: number;
};

export const FreeEditor: React.FC<ComponentEditProps> = (
  props: ComponentEditProps
) => {
  const [components, setCompoenents] = useState<ComponentModel[]>();
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);
  const [deletingComponent, setDeletingComponent] = useState<ComponentModel>();
  const { getComponentByType } = useComponent();
  //const { deleteComponent } = useServices();

  const onOpen = (opened: boolean) => {
    props.onComponentsOpen && props.onComponentsOpen(opened);
  };

  const onAddComponent = (position: number, type: ComponentType) => {
    components?.splice(position, 0, { type, position });

    props.onChange && props.onChange(components);
  };

  const onDelete = (component: ComponentModel) => {
    setDeletingComponent(component);
    setDialogOpened(true);
  };

  const confirmDelete = async () => {
    setDialogOpened(false);

    deletingComponent &&
      deletingComponent.position !== undefined &&
      components?.splice(deletingComponent.position, 1);

    props.onChange && props.onChange(components);
  };

  const onCancel = () => {
    setDialogOpened(false);
  };

  useEffect(() => {
    const comps = props.components?.map((component, position) => {
      return { ...component, position };
    });
    console.log(comps);
    setCompoenents(comps);
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
            const element = React.createElement(node, comp);

            return (
              <div key={index}>
                <Frame component={comp} onDelete={onDelete}>
                  {element}
                </Frame>

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
      <ConfirmDialog
        headerText="Delete component"
        bodyText={
          <span>
            Confirm deleting this <b>{deletingComponent?.type}</b>?
          </span>
        }
        confirmText="Delete it!"
        open={dialogOpened}
        onCornfirm={confirmDelete}
        onCancel={onCancel}
      />
    </>
  );
};
