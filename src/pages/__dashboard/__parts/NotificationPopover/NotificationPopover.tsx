import { PeopleSharp } from '@mui/icons-material';
import { Link, Popover } from '@mui/material';
import { Avatar } from 'components/global/Avatar/Avatar';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from 'shared/context/UserContext';
import style from './NotificationPopover.module.scss';

type NotificationPopoverProps = {
  open: boolean;
  anchorEl: Element | HTMLElement;
  onclose: () => void;
};

export const NotificationPopover: React.FC<NotificationPopoverProps> = (
  props: NotificationPopoverProps
) => {
  const currentUser = useContext(UserContext);

  /*const [open, setOpen] = useState<boolean>(props.open);

  useEffect(() => {
    setOpen(props.open);
  }, [props?.open]);*/

  return (
    <>
      <Popover
        open={props.open}
        anchorEl={props.anchorEl}
        onClose={props.onclose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
      >
        <div className={style['notification-popover']}>
          <div className={style['header']}>
            <div>
              <h2>Notifications</h2>
            </div>
          </div>
          <div className={style['body']}>
            <div className={style['tile']}>
              <Avatar user={currentUser ?? {}} />
              <div>
                <p>
                  <strong>{currentUser?.name ?? currentUser?.username}</strong>
                  &nbsp;
                  <span>shared a news</span>
                </p>
                <p className={style['datetime']}>4 min ago</p>
              </div>
            </div>
          </div>
          <div className={style['footer']}>
            <Link>See all</Link>
          </div>
        </div>
      </Popover>
    </>
  );
};
