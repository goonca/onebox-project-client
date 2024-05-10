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
  onDragEnd?: (positions: any, lastPosition?: number) => void;
  isFirst?: boolean;
  editMode?: boolean;
  isLast?: boolean;
  selectedPosition?: number;
  draggingPosition?: number;
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
  selectedPosition,
  draggingPosition
}: FrameProps) => {
  const [selected, setSelected] = useState<boolean>(false);
  const [dragging, setDragging] = useState<boolean>(false);
  const [p, setP] = useState({
    initTop: 0,
    initY: 0,
    curY: 0,
    dragging: false,
    currentHeight: 0,
    position: component.position,
    compAfter: {},
    compBefore: {},
    compCur: {},
    afterCompMiddlePoint: 0,
    beforeCompMiddlePoint: 0,
    clone: {},
    lastPosition: 0,
    ignoreDragPosition: false
  });
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

  const classnames = `${style['frame']} ${
    (selected ||
      selectedPosition == component.position ||
      draggingPosition == component.position) &&
    style['selected']
  } ${
    (selectedPosition !== undefined || draggingPosition !== undefined) &&
    style['n-selected']
  }`;

  const showTooltip = !(
    selectedPosition !== undefined && selectedPosition !== component.position
  );

  const __setSelected = (__selected: boolean) => {
    if (
      selectedPosition !== undefined ||
      draggingPosition !== undefined ||
      !editMode
    ) {
      return;
    }
    setSelected(__selected);
    //setSelected(true);
  };

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

  const resetDrag = () => {};

  const dragStart = (e: React.MouseEvent<HTMLInputElement>, reset: boolean) => {
    //const $ = document.querySelector;
    //const current = wrapperRef.current;
    const after = document.querySelector(
      '#comp-' + Number(component.position + 1)
    );
    const before = document.querySelector(
      '#comp-' + Number(component.position - 1)
    );

    p.lastPosition = document.querySelectorAll('[id^="comp-"]').length - 1;

    const current = document.querySelector('#frame-' + component.position);

    !!current &&
      (p.compCur = {
        c: current,
        b: current.getBoundingClientRect()
      });
    !!after &&
      (p.compAfter = {
        c: after,
        b: after.getBoundingClientRect()
      });
    !!before &&
      (p.compBefore = {
        c: before,
        b: before.getBoundingClientRect()
      });

    console.log('component.position', component.position);
    p.initTop = p.compCur.b.top;
    p.initY = e.pageY;

    if (!reset) {
      p.clone.c = p.compCur.c.cloneNode(true);
      p.clone.b = p.clone.c.getBoundingClientRect();

      p.clone.c.id = 'cloned';
      p.clone.c.style.position = 'absolute';
      p.clone.c.style.width = p.compCur.b.width + 'px';
      p.clone.c.style.top = p.initTop + 'px';
      p.clone.c.style.left = p.compCur.b.left + 'px';
      document.getElementById('__next').appendChild(p.clone.c);
      p.compCur.c.style.opacity = 0;
      p.dragging = true;

      document.body.removeEventListener('mousemove', dragMove);
      document.body.removeEventListener('mouseup', dragEnd);
      document.body.addEventListener('mousemove', dragMove);
      document.body.addEventListener('mouseup', dragEnd);
      onDragStart && onDragStart(component);
    }
  };

  const refreshComponents = () => {
    document.querySelectorAll('[id^="comp-"]').forEach((c, i) => {
      c.id = 'comp-' + i;
      c.querySelector('[id^="frame-"]').id = 'frame-' + i;
    });
  };

  const dragMove = (e: MouseEvent) => {
    if (p.dragging) {
      p.clone.b = p.clone.c.getBoundingClientRect();

      p.curY = e.pageY;
      const diff = (p.initY - p.curY) * -1;
      p.clone.c.style.top = Number(p.initTop + diff) + 'px';

      p.clone.middle = p.clone.b.top + Math.round(p.clone.b.height / 2);

      !!p.compAfter.c &&
        (p.compAfter.middle =
          p.compAfter.b.top + Math.round(p.compAfter.b.height / 2));

      !!p.compBefore.c &&
        (p.compBefore.middle =
          p.compBefore.b.top + Math.round(p.compBefore.b.height / 2));

      //if de the middle point passes or the bottom passes the other bottom minus 20% if it
      if (
        component.position < p.lastPosition &&
        (p.clone.middle > p.compAfter.middle ||
          p.clone.b.bottom > p.compAfter.b.bottom - p.compAfter.b.height / 5)
      ) {
        p.compAfter.c.parentNode.insertBefore(
          p.compAfter.c,
          p.compCur.c.parentNode
        );

        refreshComponents();
        component.position++;
        dragStart(e, true);
        //--
      } else if (
        component.position > 0 &&
        p.clone.middle < p.compBefore.middle
      ) {
        p.compBefore.c.parentNode.insertBefore(
          p.compCur.c.parentNode,
          p.compBefore.c
        );

        refreshComponents();
        component.position--;
        dragStart(e, true);
      }
    }
  };

  const dragEnd = () => {
    refreshComponents();
    document.body.removeEventListener('mousemove', dragMove);
    document.body.removeEventListener('mouseup', dragEnd);
    document.getElementById('__next').removeChild(p.clone.c);
    p.compCur.c.style.opacity = 1;

    const positions = [];
    document.querySelectorAll('[id^="comp-"]').forEach((c, i) => {
      positions.push({
        id: c.querySelector('input[name="componentId"]').value,
        position: i
      });
    });
    //console.log('frame', positions);
    onDragEnd && onDragEnd(positions, component.position);
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
      console.log('selected', component.position);
      setSelected(true);
    }
  }, [selectedPosition]);

  useEffect(() => {
    if (
      draggingPosition !== undefined &&
      draggingPosition !== component.position
    ) {
      setDragging(false);
    }
    if (
      draggingPosition !== undefined &&
      draggingPosition === component.position
    ) {
      console.log('dragging', component.position);
      setDragging(true);
    }
  }, [draggingPosition]);

  useEffect(() => {
    selectedPosition === undefined && setSelected(false);
  }, [selectedPosition]);

  return (
    <>
      <div
        ref={wrapperRef}
        id={`frame-${component.position}`}
        className={classnames}
        onMouseMove={() => __setSelected(true)}
        onMouseLeave={() => __setSelected(false)}
      >
        <input type="hidden" value={component.id} name="componentId" />
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
