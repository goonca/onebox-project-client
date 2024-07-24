import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { useState, useEffect, ReactNode } from 'react';
import { useMediaQuery } from 'shared/hooks/useMediaQuery';
import style from './AddComponentDialog.module.scss';

type AddComponentDialogProps = {
  open: boolean;
  children?: ReactNode;
};

export const AddComponentDialog: React.FC<AddComponentDialogProps> = (
  props?: AddComponentDialogProps
) => {
  const [open, setOpen] = useState<boolean>(props?.open ?? false);
  const { isMobile } = useMediaQuery();

  const handleCancel = () => {
    setOpen(false);
  };

  const handleConfirm = () => {
    setOpen(false);
  };

  useEffect(() => {
    setOpen(!!open);
  }, [open]);

  return (
    <>
      <div className={style['add-component-dialog']}>
        <Dialog
          fullScreen={isMobile()}
          className={style['confirm-dialog']}
          open={!!open}
          onClose={handleCancel}
        >
          <DialogTitle>Add Component</DialogTitle>
          <DialogContent>
            <DialogContentText minWidth={500} minHeight={40}>
              {props?.children}
            </DialogContentText>
          </DialogContent>
          <DialogActions className={style['dialog-actions']}>
            <Button variant="outlined" size="small" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" size="small" onClick={handleConfirm}>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};
