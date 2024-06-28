import { faBell } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Badge } from '@mui/material';
import { Avatar } from 'components/global/Avatar/Avatar';
import { useContext, useRef, useState } from 'react';
import { UserContext } from 'shared/context/UserContext';
import { useServices } from 'shared/hooks/useServices';
import { NotificationPopover } from '../NotificationPopover/NotificationPopover';

import style from './Header.module.scss';

export const Header = () => {
  const currentUser = useContext(UserContext);
  const notificationIconRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<boolean>(false);
  const { countUnreadByTo } = useServices();

  const handleBellClick = () => {
    setOpen(!open);
  };

  const handlePopoverClose = () => {
    setOpen(false);
  };

  return (
    <>
      <div className={style['header']} data-component="header">
        <div className={style['logo']}>
          <img src="/static/onebox-complete-logo-dark.svg" height={18} />
        </div>
        <div className={style['notification']}>
          <Badge color="warning" variant="dot" ref={notificationIconRef}>
            <FontAwesomeIcon icon={faBell} onClick={handleBellClick} />
          </Badge>
        </div>
        <hr />

        <div className={style['avatar']}>
          <label>{currentUser?.username}</label>
          <Avatar user={currentUser ?? {}} />
        </div>
      </div>
      <NotificationPopover
        open={open}
        onclose={handlePopoverClose}
        anchorEl={(notificationIconRef.current as HTMLElement) ?? <></>}
      />
    </>
  );
};
