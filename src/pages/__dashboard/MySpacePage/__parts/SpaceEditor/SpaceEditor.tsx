import {
  FormControlLabel,
  Slider,
  SliderValueLabelProps,
  Switch,
  Tooltip
} from '@mui/material';
import { ReactNode, useState } from 'react';
import { SpaceEditorContext } from 'shared/context/SpaceEditorContext';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import { SpaceModel } from 'shared/types/api-type';
import style from './SpaceEditor.module.scss';

type SpaceEditorProps = {
  children?: ReactNode;
  space: SpaceModel;
};

export const SpaceEditor: React.FC<SpaceEditorProps> = (
  props: SpaceEditorProps
) => {
  const { setLocalStorage, getLocalStorage } = useLocalStorage<number>(
    'spaceEditorContrast'
  );
  const [editMode, setEditMode] = useState<boolean>(true);
  const [overlayOpen, setOverlayOpen] = useState<boolean>(false);
  const [contrast, setContrast] = useState<number>(
    (getLocalStorage() ?? 50) as number
  );

  const ValueLabelComponent = (props: SliderValueLabelProps) => {
    const { children, value } = props;

    return (
      <Tooltip enterTouchDelay={0} placement="top" title={value}>
        {children}
      </Tooltip>
    );
  };
  const handleChangeContrast = (e: any, value: any) => {
    setLocalStorage(value);
    setContrast(value);
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
                onChange={handleChangeContrast}
                valueLabelDisplay="auto"
                slots={{
                  valueLabel: ValueLabelComponent
                }}
                defaultValue={contrast}
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
