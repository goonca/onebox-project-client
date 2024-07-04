import {
  FormControlLabel,
  Slider,
  SliderValueLabelProps,
  Switch,
  Tooltip
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import { SpaceModel } from 'shared/types/api-type';
import style from './SpaceEditor.module.scss';

type SpaceEditorProps = {
  children?: ReactNode;
  space: SpaceModel;
};

export const SpaceEditor: React.FC<SpaceEditorProps> = (
  props: SpaceEditorProps
) => {
  const [editMode, setEditMode] = useState<boolean>(true);
  const [overlayOpen, setOverlayOpen] = useState<boolean>(false);
  const [contrast, setContrast] = useState<number>(25);

  const ValueLabelComponent = (props: SliderValueLabelProps) => {
    const { children, value } = props;

    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  };

  return (
    <>
      <SpaceEditorContext.Provider
        value={{ space: props.space, editMode, contrast }}
      >
        <div className={style['editor']}>
          <div className={style['header']}>
            <label className={style['title']}>editor</label>
            <div className={style['slider']}>
              <Slider
                size="medium"
                min={0}
                max={100}
                onChange={(e, value) => setContrast(value as number)}
                valueLabelDisplay="auto"
                slots={{
                  valueLabel: ValueLabelComponent
                }}
                defaultValue={20}
              />
              <label>contrast</label>
            </div>
            <hr />
            <div className={style['switcher']}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    checked={editMode}
                    onChange={() => setEditMode(!editMode)}
                  />
                }
                label="Edit mode"
              />
            </div>
          </div>
          <div
            className={`${style['overlay']} ${overlayOpen && style['visible']}`}
          ></div>
          <div className={style['content']}>{props?.children}</div>
        </div>
      </SpaceEditorContext.Provider>
    </>
  );
};
