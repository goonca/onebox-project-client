import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { useEffect, useState } from 'react';

import style from './ConfirmDialog.module.scss';

export type ConfirmDialogProps = {
  open?: boolean;
  onCornfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
  headerText?: any;
  bodyText?: any;
};

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  open,
  onCornfirm,
  onCancel,
  cancelText,
  confirmText,
  headerText,
  bodyText
}: ConfirmDialogProps) => {
  const [opened, setOpened] = useState<boolean>(false);

  const handleCancel = () => {
    setOpened(false);
    onCancel && onCancel();
  };

  const handleConfirm = () => {
    setOpened(false);
    onCornfirm && onCornfirm();
  };

  useEffect(() => {
    console.log('changed');
    setOpened(!!open);
  }, [open]);

  return (
    <Dialog
      fullScreen={false}
      className={style['confirm-dialog']}
      open={!!opened}
      onClose={onCancel}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{headerText}</DialogTitle>
      <DialogContent>
        <DialogContentText minWidth={500} minHeight={40}>
          {bodyText}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style['dialog-actions']}>
        <Button variant="outlined" size="small" onClick={handleCancel}>
          {cancelText ?? 'Cancel'}
        </Button>
        <Button variant="contained" size="small" onClick={handleConfirm}>
          {confirmText ?? 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
