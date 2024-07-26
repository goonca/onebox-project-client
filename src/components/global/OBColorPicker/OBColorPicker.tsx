import { useEffect, useRef, useState } from 'react';
import { ColorPicker, ColorValue } from 'mui-color';
import { TextField } from '@mui/material';
import style from './OBColorPicker.module.scss';

export type OBColorPickerProps = {
  value?: string;
  onChange?: (e: React.SyntheticEvent) => void;
};

export const OBColorPicker: React.FC<OBColorPickerProps> = (
  props: OBColorPickerProps
) => {
  const [color, setColor] = useState<ColorValue & { hex?: string }>();
  const [value, setValue] = useState<string | undefined>(props.value);
  const inputRef = useRef<HTMLInputElement>();

  useEffect(() => {
    console.log('color', color);
    if (inputRef.current && color?.hex) {
      inputRef.current.value = color?.hex as string;
      inputRef.current.dispatchEvent(new Event('change'));
      setValue(color?.hex);
    }
  }, [color]);

  useEffect(() => {
    setColor(props.value ? '#' + props.value : undefined);
  }, [props.value]);

  return (
    <>
      <div className={style['color-picker']}>
        <ColorPicker
          hideTextfield={true}
          value={color ?? (value ? '#' + value : undefined)}
          onChange={color => {
            setColor(color);
          }}
        />
        <TextField
          inputRef={inputRef}
          defaultValue={value}
          onChange={e => {
            setColor(!!e.target.value ? '#' + e.target.value : undefined);
            props.onChange && props.onChange(e);
          }}
          autoComplete="off"
          size="small"
          inputProps={{
            autoComplete: 'new-password',
            form: {
              autoComplete: 'off'
            }
          }}
        />
      </div>
    </>
  );
};
