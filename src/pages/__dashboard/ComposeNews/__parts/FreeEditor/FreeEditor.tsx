import { debounce } from '@mui/material';
import { FigureProps } from 'components/compose/Figure';
import { Frame } from 'components/compose/Frame/Frame';
import { QuoteProps } from 'components/compose/Quote';
import { TextProps } from 'components/compose/Text';
import { ConfirmDialog } from 'pages/__dashboard/__parts/ConfirmDialog/ConfirmDialog';
import React, { useCallback, useEffect, useState } from 'react';
import { useComponent } from 'shared/hooks/useComponent';
import { ComponentModel, ComponentType } from 'shared/types/api-type';

import { AddComponent } from '../AddComponent/AddComponent';
import style from './FreeEditor.module.scss';

export type ComponentProps = FigureProps | QuoteProps | TextProps;

export type ComponentEditProps = {
  onComponentsOpen?: (opened: boolean) => void;
  editMode?: boolean;
  onChange?: (components?: ComponentModel[]) => void;
  components?: ComponentModel[];
  newsId?: number;
};

export const FreeEditor: React.FC<ComponentEditProps> = (
  props: ComponentEditProps
) => {
  const [components, setCompoenents] = useState<ComponentModel[]>();
  const [selectedPosition, setSelectedPosition] = useState<number>();
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(!!props.editMode);
  const [deletingComponent, setDeletingComponent] = useState<ComponentModel>();
  const { getComponentByType } = useComponent();
  const __debouce = useCallback(
    debounce(() => setSelectedPosition(undefined), 1000),
    []
  );
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

  const onMoveUp = (component: ComponentModel) => {
    moveComponent(component, false);
  };

  const onMoveDown = (component: ComponentModel) => {
    moveComponent(component, true);
  };

  const moveComponent = (component: ComponentModel, moveDown: boolean) => {
    if (component.position !== undefined) {
      const newPosition = component.position + (moveDown ? 1 : -1);
      components?.splice(component.position, 1);
      components?.splice(newPosition, 0, component);

      setSelectedPosition(newPosition);
      __debouce();
      props.onChange && props.onChange(components);
    }
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
    setCompoenents(comps);
  }, [props.components]);

  useEffect(() => {
    setEditMode(!!props.editMode);
  }, [props.editMode]);

  return (
    <>
      <div className={style['free-editor']}>
        <div className={style['wrapper']}>
          {editMode && (
            <AddComponent
              onOpen={onOpen}
              position={0}
              onAddComponent={onAddComponent}
              showTooltip={components?.length == 0}
            />
          )}
          {components?.map((comp, index) => {
            const node = getComponentByType(comp.type);
            const element = React.createElement(node, comp);

            return (
              <div key={comp.position}>
                <Frame
                  component={comp}
                  onDelete={onDelete}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  isFirst={index == 0}
                  isLast={index == components.length - 1}
                  selectedPosition={selectedPosition}
                  editMode={editMode}
                >
                  {element}
                </Frame>

                {editMode && (
                  <AddComponent
                    onOpen={onOpen}
                    position={index + 1}
                    onAddComponent={onAddComponent}
                  />
                )}
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
