//@ts-nocheck
import {
  faArrowsUpDownLeftRight,
  faChevronDown,
  faChevronUp,
  faGear,
  faTrash
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip } from '@mui/material';
import { ReactNode, useEffect, useRef, useState } from 'react';
import { ComponentModel } from 'shared/types/api-type';

import style from './Frame.module.scss';

export type FrameProps = {
  component: ComponentModel;
  children?: ReactNode;
  onDelete?: (component: ComponentModel) => void;
  onMoveUp?: (component: ComponentModel, dontUpdate?: boolean) => void;
  onMoveDown?: (component: ComponentModel, dontUpdate?: boolean) => void;
  onDragStart?: (component: ComponentModel) => void;
  onDragEnd?: (/*component: ComponentModel*/) => void;
  isFirst?: boolean;
  editMode?: boolean;
  isLast?: boolean;
  selectedPosition?: number;
};

export const Frame = ({
  component,
  children,
  onDelete,
  onMoveUp,
  onMoveDown,
  onDragStart,
  onDragEnd,
  isFirst,
  editMode,
  isLast,
  selectedPosition
}: FrameProps) => {
  const [selected, setSelected] = useState<boolean>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const deleteComponent = () => {
    onDelete && onDelete(component);
  };
  const onMoveUpComponent = () => {
    onMoveUp && onMoveUp(component);
  };
  const onMoveDownComponent = () => {
    onMoveDown && onMoveDown(component);
  };

  useEffect(() => {
    if (
      selectedPosition !== undefined &&
      selectedPosition !== component.position
    ) {
      setSelected(false);
    }
    if (
      selectedPosition !== undefined &&
      selectedPosition === component.position
    ) {
      setSelected(true);
    }
  }, [selectedPosition]);

  const classnames = `${style['frame']} ${
    (selected || selectedPosition == component.position) && style['selected']
  } ${selectedPosition !== undefined && style['n-selected']}`;

  const showTooltip = !(
    selectedPosition !== undefined && selectedPosition !== component.position
  );

  const __setSelected = (__selected: boolean) => {
    if (selectedPosition !== undefined || !editMode) {
      return;
    }
    setSelected(__selected);
    //setSelected(true);
  };

  useEffect(() => {
    selectedPosition === undefined && setSelected(false);
  }, [selectedPosition]);

  const moveUpButton = (
    <Button disabled={isFirst} onClick={() => onMoveUpComponent()}>
      <FontAwesomeIcon icon={faChevronUp} />
    </Button>
  );

  const moveDownButton = (
    <Button disabled={isLast} onClick={() => onMoveDownComponent()}>
      <FontAwesomeIcon icon={faChevronDown} />
    </Button>
  );

  const dragButton = (
    <Button onMouseDown={e => dragStart(e)}>
      <FontAwesomeIcon icon={faArrowsUpDownLeftRight} />
    </Button>
  );

  const dragParams = {
    initTop: 0,
    initY: 0,
    curY: 0,
    dragging: false,
    currentHeight: 0,
    position: component.position,
    afterCompMiddlePoint: 0,
    beforeCompMiddlePoint: 0,
    clone: null
  };

  const dragStart = (e: React.MouseEvent<HTMLInputElement>) => {
    const current = wrapperRef.current;
    //console.log('dragStart', current.offsetHeight);
    dragParams.clone = current.cloneNode(true);
    current.style.opacity = 0;
    dragParams.clone.id = 'cloned';
    dragParams.clone.style.position = 'absolute';
    dragParams.clone.style.width = current.offsetWidth + 'px';
    dragParams.clone.style.top = current.offsetTop + 'px';
    dragParams.initTop = current.offsetTop;
    current.parentNode?.appendChild(dragParams.clone);

    const afterComp = document.querySelector(
      '#comp-' + Number((component?.position ?? 0) + 1)
    );

    console.log(afterComp.getBoundingClientRect());

    const beforeComp = document.querySelector(
      '#comp-' + Number((component?.position ?? 0) - 1)
    );

    dragParams.initY = e.pageY;
    dragParams.dragging = true;

    dragParams.beforeCompMiddlePoint = beforeComp
      ? beforeComp.offsetTop + Math.round(afterComp?.offsetHeight / 2)
      : 0;

    dragParams.afterCompMiddlePoint = afterComp
      ? afterComp.offsetTop + Math.round(afterComp?.offsetHeight / 2)
      : 0;

    document.body.addEventListener('mousemove', dragMove);
    document.body.addEventListener('mouseup', dragEnd);
    onDragStart && onDragStart(component);
  };

  const dragMove = (e: MouseEvent) => {
    if (dragParams.dragging) {
      const current = wrapperRef.current;

      dragParams.curY = e.pageY;
      const diff = (dragParams.initY - dragParams.curY) * -1;
      dragParams.clone.style.top = Number(dragParams.initTop + diff) + 'px';

      const currentMiddlePoint =
        dragParams.clone.offsetTop +
        Math.round(dragParams.clone.offsetHeight / 2);

      console.log(diff, currentMiddlePoint, dragParams.afterCompMiddlePoint);

      if (currentMiddlePoint > dragParams.afterCompMiddlePoint) {
        const afterComp = document.querySelector(
          '#comp-' + Number((component?.position ?? 0) + 1)
        );

        afterComp.parentNode?.insertBefore(afterComp, current.parentNode);

        //current.style.top = '-120px';
        //dragStart(e);
      } else if (false) {
      }
    }
  };

  const dragEnd = () => {
    const current = wrapperRef.current;
    document.body.removeEventListener('mousemove', dragMove);
    document.body.removeEventListener('mouseup', dragEnd);
    current.style.opacity = 1;

    dragParams.clone.parentNode.removeChild(dragParams.clone);
    onDragEnd && onDragEnd();
  };

  return (
    <>
      <div
        ref={wrapperRef}
        id={`frame-${component.position}`}
        className={classnames}
        onMouseMove={() => __setSelected(true)}
        onMouseLeave={() => __setSelected(false)}
      >
        {component.position}
        <div className={style['controls']}>
          <div>
            <label>{component?.type}</label>
            <hr />
            <Tooltip title="Edit" arrow>
              <Button>
                <FontAwesomeIcon icon={faGear} />
              </Button>
            </Tooltip>
            <Tooltip title="Delete" arrow>
              <Button onClick={() => deleteComponent()}>
                <FontAwesomeIcon icon={faTrash} />
              </Button>
            </Tooltip>
            <hr />
            {showTooltip ? (
              <>
                <Tooltip title="Move Up" arrow>
                  {moveUpButton}
                </Tooltip>
                <Tooltip title="Move Down" arrow>
                  {moveDownButton}
                </Tooltip>
                <hr />
                <Tooltip title="Drag component" arrow>
                  {dragButton}
                </Tooltip>
              </>
            ) : (
              <>
                {moveUpButton}
                {moveDownButton}
                <hr />
                {dragButton}
              </>
            )}
          </div>
        </div>
        <div className={style['wrapper']}>
          <div>{children}</div>
        </div>
      </div>
    </>
  );
};
