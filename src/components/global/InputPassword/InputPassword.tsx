import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import { FormControl, InputLabel, TextField } from '@mui/material';

export type InputPasswordProps = {
  defaultlValue?: string;
  label?: string;
};

export const InputPassword = forwardRef(function InputPassword(
  props: InputPasswordProps,
  ref
) {
  useImperativeHandle(
    ref,
    () => {
      return refInput.current;
    },
    []
  );

  const [showPassword, setShowPassword] = useState(false);
  const refInput = useRef<HTMLInputElement>();

  const handleClickShowPassword = () => setShowPassword(show => !show);

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <FormControl sx={{ m: 1, width: '25ch' }} variant="outlined">
      <InputLabel>{props.label}</InputLabel>
      <OutlinedInput
        type={showPassword ? 'text' : 'password'}
        inputRef={refInput}
        defaultValue={props.defaultlValue}
        endAdornment={
          <InputAdornment position="end">
            <IconButton
              onClick={handleClickShowPassword}
              onMouseDown={handleMouseDownPassword}
              edge="end"
            >
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        }
        label={props.label}
      />
    </FormControl>
  );
});
