import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  OutlinedInput
} from '@mui/material';
import React, { FC, useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'shared/hooks/useMediaQuery';
import { LocationModel } from 'shared/types/api-type';
import style from './ChangeRegionDialog.module.scss';

export type ChangeRegionProps = {
  open: boolean;
  onChange: (location: LocationModel) => void;
};

export const ChangeRegionDialog: React.FC<ChangeRegionProps> = ({
  open,
  onChange
}: ChangeRegionProps) => {
  const { isMobile } = useMediaQuery();
  const [regionDialogOpened, setRegionDialogOpened] = useState<boolean>(false);
  const searchRef = useRef<HTMLInputElement>();

  const searchLocation = useCallback(
    debounce(() => {
      console.log(searchRef.current?.value);
    }, 500),
    []
  );

  const handleChangeRegion = () => {
    onChange && onChange({});
  };

  useEffect(() => {
    setRegionDialogOpened(open);
  }, [open]);

  return (
    <Dialog
      fullScreen={isMobile()}
      open={regionDialogOpened}
      className={style['change-region-dialog']}
    >
      <DialogTitle>Change region</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div className={style['wrapper']}>
            <div className={style['search-input']}>
              <OutlinedInput
                inputRef={searchRef}
                onChange={searchLocation}
                startAdornment={
                  <>
                    &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    &nbsp;&nbsp;
                  </>
                }
              />
            </div>
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style['dialog-actions']}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => setRegionDialogOpened(false)}
        >
          Cancel
        </Button>
        <Button variant="contained" size="small" onClick={handleChangeRegion}>
          Change
        </Button>
      </DialogActions>
    </Dialog>
  );
};
