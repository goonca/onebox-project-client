import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton
} from '@mui/material';
import { useState, useEffect, ReactNode } from 'react';
import { useMediaQuery } from 'shared/hooks/useMediaQuery';
import style from './AddComponentDialog.module.scss';

type AddComponentDialogProps = {
  open: boolean;
  children?: ReactNode;
  onCancel?: () => void;
  onConfirm?: () => void;
};

export const AddComponentDialog: React.FC<AddComponentDialogProps> = (
  props: AddComponentDialogProps
) => {
  const [open, setOpen] = useState<boolean>(props?.open ?? false);
  const { isMobile } = useMediaQuery();

  const handleCancel = () => {
    props.onCancel && props.onCancel();
  };

  const handleConfirm = () => {
    props.onConfirm && props.onConfirm();
  };

  useEffect(() => {
    setOpen(props?.open ?? false);
  }, [props?.open]);

  return (
    <Dialog
      fullScreen={isMobile()}
      className={style['add-component-dialog']}
      open={open}
      onClose={handleCancel}
    >
      <DialogTitle>Add Component</DialogTitle>
      <IconButton
        aria-label="close"
        onClick={handleCancel}
        sx={{
          position: 'absolute',
          right: 8,
          top: 8,
          color: theme => theme.palette.grey[800]
        }}
      >
        <FontAwesomeIcon icon={faClose} />
      </IconButton>
      <DialogContent>
        <DialogContentText minWidth={500} minHeight={40}>
          {props?.children}
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style['dialog-actions']}>
        <Button variant="outlined" size="small" onClick={handleCancel}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
