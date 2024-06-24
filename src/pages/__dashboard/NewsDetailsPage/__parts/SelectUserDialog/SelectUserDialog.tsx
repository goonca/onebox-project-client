import { faClose, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  debounce,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  OutlinedInput
} from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useMediaQuery } from 'shared/hooks/useMediaQuery';
import { ResponseType, useServices } from 'shared/hooks/useServices';
import { LocationModel, NewsModel, UserModel } from 'shared/types/api-type';
import { Avatar } from 'components/global/Avatar/Avatar';
import style from './SelectUserDialog.module.scss';

export type ChangeRegionProps = {
  open: boolean;
  news?: NewsModel;
  onChange: (location: LocationModel) => void;
  onClose: () => void;
};

export const SelectUserDialog: React.FC<ChangeRegionProps> = ({
  open,
  news,
  onChange,
  onClose
}: ChangeRegionProps) => {
  const { isMobile } = useMediaQuery();

  const { listUsersByNameOrUsername } = useServices();
  const [usersDialogOpened, setUsersDialogOpened] = useState<boolean>(false);
  const [users, setUsers] = useState<UserModel[]>();
  const [user, setUser] = useState<UserModel>();
  const searchRef = useRef<HTMLInputElement>();
  const { shareNews } = useServices();

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

  const selectUser = (user: UserModel) => {
    setUser(user);
    //onChange && onChange(user);
  };

  const handleClose = () => {
    onClose && onClose();
  };

  const handleBack = () => {
    setUser(undefined);
  };

  const share = () => {
    console.log('share it', user);
    shareNews(news?.id as string, user?.id as number).then((res: any) => {
      console.log(res);
    });
  };

  useEffect(() => {
    setUsers([]);
    setUser(undefined);
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
      <IconButton
        aria-label="close"
        onClick={handleClose}
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
        <DialogContentText>
          <div className={style['wrapper']}>
            {user ? (
              <div className={style['confirm-sharing']}>
                <div className={style['header']}>
                  <p>You are about to share</p>
                  <h3>{news?.title}</h3>
                  <p>with</p>
                </div>
                <div className={style['selected-user']}>
                  <div className={style['avatar']}>
                    <Avatar user={user} size={100} />
                  </div>
                  <div className={style['username']}>
                    {user.name && <p>{user.name}</p>}
                    <p>@{user.username}</p>
                  </div>
                </div>
              </div>
            ) : (
              <>
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
                      onClick={() => selectUser(user)}
                    >
                      <div className={style['avatar']}>
                        <Avatar user={user} />
                      </div>
                      <div className={style['username']}>
                        {user.name && <p>{user.name}</p>}
                        <p>@{user.username}</p>
                      </div>
                    </div>
                  ))}
              </>
            )}
          </div>
        </DialogContentText>
      </DialogContent>
      <DialogActions className={style['dialog-actions']}>
        {user ? (
          <>
            <Button variant="outlined" size="small" onClick={handleBack}>
              Back
            </Button>
            <Button variant="contained" size="small" onClick={share}>
              Confirm
            </Button>
          </>
        ) : (
          <>
            <Button variant="outlined" size="small" onClick={handleClose}>
              Cancel
            </Button>
          </>
        )}
      </DialogActions>
    </Dialog>
  );
};
