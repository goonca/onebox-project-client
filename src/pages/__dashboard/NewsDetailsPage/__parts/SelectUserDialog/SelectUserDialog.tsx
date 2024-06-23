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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'shared/hooks/useMediaQuery';
import { ResponseType, useServices } from 'shared/hooks/useServices';
import { LocationModel, UserModel } from 'shared/types/api-type';
import style from './SelectUserDialog.module.scss';

export type ChangeRegionProps = {
  open: boolean;
  onChange: (location: LocationModel) => void;
  onClose: () => void;
};

export const SelectUserDialog: React.FC<ChangeRegionProps> = ({
  open,
  onChange,
  onClose
}: ChangeRegionProps) => {
  const { isMobile } = useMediaQuery();

  const { listUsersByNameOrUsername } = useServices();
  const [usersDialogOpened, setUsersDialogOpened] = useState<boolean>(false);
  const [users, setUsers] = useState<UserModel[]>();
  const searchRef = useRef<HTMLInputElement>();

  const searchUsers = useCallback(
    debounce(() => listUsers(), 500),
    []
  );

  const listUsers = () => {
    if ((searchRef.current?.value?.length ?? 0) < 3) {
      setUsers([]);
      return;
    }

    listUsersByNameOrUsername(searchRef.current?.value as string).then(
      (res: ResponseType) => {
        const users = res.data as UserModel[];
        console.log(users);

        setUsers(users);
      }
    );
  };

  const handleChangeUser = (user: UserModel) => {
    onChange && onChange(user);
  };

  const handleClose = () => {
    setUsers([]);
    onClose && onClose();
  };

  useEffect(() => {
    setUsers([]);
    setUsersDialogOpened(open);
  }, [open]);

  return (
    <Dialog
      fullScreen={isMobile()}
      open={usersDialogOpened}
      className={style['change-user-dialog']}
      maxWidth="md"
    >
      <DialogTitle>Share with</DialogTitle>
      <DialogContent>
        <DialogContentText>
          <div className={style['wrapper']}>
            <div className={style['search-input']}>
              <OutlinedInput
                inputRef={searchRef}
                onChange={searchUsers}
                placeholder="Name or Username"
                startAdornment={
                  <>
                    &nbsp;&nbsp;
                    <FontAwesomeIcon icon={faMagnifyingGlass} />
                    &nbsp;&nbsp;
                  </>
                }
              />
            </div>

            {users &&
              users.map(user => (
                <div
                  className={style['user']}
                  onClick={() => handleChangeUser(user)}
                >
                  <h3>{user.name}</h3>
                  <span className={style['country']}>{user.username}</span>
                </div>
              ))}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style['dialog-actions']}>
        <Button variant="outlined" size="small" onClick={handleClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
