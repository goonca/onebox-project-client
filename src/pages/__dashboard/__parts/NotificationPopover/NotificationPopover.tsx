import { Link, Popover } from '@mui/material';
import { Avatar } from 'components/global/Avatar/Avatar';
import moment from 'moment';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from 'shared/context/UserContext';
import { useNotification } from 'shared/hooks/useNotification';
import { OBResponseType, useServices } from 'shared/hooks/useServices';
import { NotificationModel } from 'shared/types/api-type';
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
  const { template } = useNotification();
  const { listNotificationByTo } = useServices();
  const [notifications, setNotifications] = useState<NotificationModel[]>();
  const [now, setNow] = useState<Date>();

  const updateTime = () => {
    setNow(new Date());
    props.open && setTimeout(updateTime, 1000 * 10);
  };

  const listNotificatrions = () => {
    listNotificationByTo(currentUser?.id, 5, 1).then((res: OBResponseType) => {
      setNotifications(res.data);
    });
  };

  useEffect(() => {
    listNotificatrions();
  }, []);

  useEffect(() => {
    updateTime();
  }, [props.open]);

  return (
    <>
      <Popover
        id="notificationPopover"
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
            {notifications &&
              notifications.map(notification => (
                <div className={style['tile']}>
                  <Avatar user={notification.toUser ?? {}} />
                  <div>
                    <p>
                      <strong>
                        {notification.toUser?.name ??
                          notification.toUser?.username}
                      </strong>
                      &nbsp;
                      <span>
                        {notification.type &&
                          template[notification.type].shortTitle}
                      </span>
                    </p>
                    <p className={style['datetime']}>
                      {now && moment(notification.createdAt).fromNow()}
                    </p>
                  </div>
                </div>
              ))}
          </div>
          <div className={style['footer']}>
            <Link>See all</Link>
          </div>
        </div>
      </Popover>
    </>
  );
};
