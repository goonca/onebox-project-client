import { debounce } from '@mui/material';
import { Frame } from 'components/compose/Frame/Frame';
import { ConfirmDialog } from 'pages/__dashboard/__parts/ConfirmDialog/ConfirmDialog';
import React, { useCallback, useEffect, useState } from 'react';
import { useComponent } from 'shared/hooks/useComponent';
import { ComponentModel, ComponentType } from 'shared/types/api-type';

import { AddComponent } from '../AddComponent/AddComponent';
import style from './FreeEditor.module.scss';

export type ComponentEditProps = {
  onComponentsOpen?: (opened: boolean) => void;
  editMode?: boolean;
  onChange?: (components?: ComponentModel[]) => void;
  onEdit?: (component?: ComponentModel) => void;
  components?: ComponentModel[];
  newsId?: number;
};

export const FreeEditor: React.FC<ComponentEditProps> = (
  props: ComponentEditProps
) => {
  const [components, setCompoenents] = useState<ComponentModel[]>();
  const [selectedPosition, setSelectedPosition] = useState<number>();
  const [draggingPosition, setDraggingPosition] = useState<number>();
  const [dialogOpened, setDialogOpened] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(!!props.editMode);
  const [deletingComponent, setDeletingComponent] = useState<ComponentModel>();
  const { getComponentByType } = useComponent();
  const __debouce = useCallback(
    debounce(() => {
      setDraggingPosition(undefined);
      setSelectedPosition(undefined);
    }, 1000),
    []
  );

  const onOpen = (opened: boolean) => {
    props.onComponentsOpen && props.onComponentsOpen(opened);
  };

  const onAddComponent = (position: number, type: ComponentType) => {
    components?.splice(position, 0, {
      type,
      position,
      tempId: Math.random().toString(36).substr(2)
    });

    props.onChange && props.onChange(components);
  };

  const handleCoverChange = (component: ComponentModel) => {
    props.onChange &&
      props.onChange(
        components?.map(_component => {
          if (
            (_component.tempId && _component.tempId == component.tempId) ||
            (_component.id && _component.id == component.id)
          ) {
            return component;
          } else {
            return { ..._component, isCover: false };
          }
        })
      );
  };

  const onDelete = (component: ComponentModel) => {
    setDeletingComponent(component);
    setDialogOpened(true);
  };

  const onMoveUp = (component: ComponentModel, dontUpdate?: boolean) => {
    moveComponent(component, false, dontUpdate);
  };

  const onMoveDown = (component: ComponentModel, dontUpdate?: boolean) => {
    moveComponent(component, true, dontUpdate);
  };

  const onDragStart = (component: ComponentModel) => {
    if (component.position !== undefined) {
      //setSelectedPosition(component.position);
      setDraggingPosition(component.position);
    }
  };

  const onDragEnd = (positions: any, lastPosition?: number) => {
    props.onChange && props.onChange(positions);

    setSelectedPosition(lastPosition);
    setDraggingPosition(undefined);
    __debouce();
  };

  const moveComponent = (
    component: ComponentModel,
    moveDown: boolean,
    dontUpdate?: boolean
  ) => {
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
    setCompoenents(props.components);
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
            const element = React.createElement(node, {
              ...comp,
              $key: comp.key
            });

            return (
              <div
                key={(comp.position ?? 0) + '_' + (comp.id ?? comp.tempId ?? 0)}
                id={`comp-${comp.position}`}
                className={
                  draggingPosition == comp.position ? style['dragging'] : ''
                }
              >
                <Frame
                  component={comp}
                  onDelete={onDelete}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onDragStart={onDragStart}
                  onDragEnd={onDragEnd}
                  onEdit={props.onEdit}
                  onCoverChange={handleCoverChange}
                  isFirst={index == 0}
                  isLast={index == components.length - 1}
                  selectedPosition={selectedPosition}
                  draggingPosition={draggingPosition}
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
