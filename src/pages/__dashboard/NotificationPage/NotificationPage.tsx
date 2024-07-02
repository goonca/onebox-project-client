import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { UserContext } from 'shared/context/UserContext';
import { useNotification } from 'shared/hooks/useNotification';
import { OBResponseType, useServices } from 'shared/hooks/useServices';
import { NotificationModel } from 'shared/types/api-type';
import { Container } from '../__parts/Container/Container';
import { Avatar } from 'components/global/Avatar/Avatar';
import style from './NotificationPage.module.scss';
import moment from 'moment';
import { Badge, debounce, OutlinedInput } from '@mui/material';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useMoment } from 'shared/hooks/useMoment';
import { throttle } from 'lodash';

type NotificationPageProps = {
  type?: string;
};

export const NotificationPage: React.FC<NotificationPageProps> = (
  props?: NotificationPageProps
) => {
  const { id } = useParams();
  const { toDateTimeString } = useMoment();
  const { listNotificationByTo, countUnreadByTo, setNotificationRead } =
    useServices();
  const currentUser = useContext(UserContext);
  const searchRef = useRef<HTMLInputElement>();
  const { template, getTemplateHTML } = useNotification();
  const [notifications, setNotifications] = useState<NotificationModel[]>();
  const [unread, setUnread] = useState<number>();
  const [now, setNow] = useState<Date>();
  const [selectedNotification, setSelectedNotification] =
    useState<NotificationModel>();
  const navigate = useNavigate();

  const listNotifications = () => {
    listNotificationByTo(currentUser?.id, 10, 0, searchRef.current?.value).then(
      (res: OBResponseType) => {
        console.log(res);
        setNotifications(res.data);
      }
    );
  };

  const debounceListNotifications = useCallback(
    debounce(() => listNotifications(), 500),
    []
  );

  const countUnread = useCallback(
    throttle(
      () => {
        countUnreadByTo(currentUser?.id).then((res: OBResponseType) => {
          console.log(res.data);
          setUnread(res.data);
        });
      },
      1000,
      { leading: true, trailing: false }
    ),
    []
  );

  const updateTime = () => {
    setNow(new Date());
    setTimeout(updateTime, 1000 * 10);
  };

  const selectNotification = (notification: NotificationModel) => {
    navigate('/dashboard/notifications/' + notification.id);
  };

  const handleSearchChange = () => {
    debounceListNotifications();
  };

  useEffect(() => {
    listNotifications();
    countUnread();
    updateTime();
  }, []);

  const getSelected = () => {
    const selected = notifications?.find(n => n.id == id);
    return selected;
  };

  useEffect(() => {
    const selected = getSelected();
    setSelectedNotification(selected);
    countUnread();
  }, [notifications]);

  useEffect(() => {
    const selected = getSelected();
    setSelectedNotification(selected);
    !selected?.read &&
      setNotificationRead([id]).then((res: OBResponseType) => {
        countUnread();
      });
    0;
    setNotifications(
      notifications?.map(n => {
        n.read = n.id == id ? 1 : n.read;
        return n;
      })
    );
  }, [id]);

  return (
    <>
      <div className={style['notification-page']}>
        <div className={style['header']}>
          <div>
            <h2>Notifications</h2>
            {!!unread && <Badge badgeContent={unread} color="warning"></Badge>}
          </div>
          <div></div>
        </div>
        <Container>
          <div className={style['container']}>
            <div className={style['list']}>
              <div className={style['wrapper']}>
                <div className={`${style['tile']} ${style['search']}`}>
                  <OutlinedInput
                    placeholder="username"
                    fullWidth
                    onChange={handleSearchChange}
                    inputRef={searchRef}
                    startAdornment={
                      <>
                        &nbsp;&nbsp;
                        <FontAwesomeIcon icon={faMagnifyingGlass} />
                        &nbsp;&nbsp;
                      </>
                    }
                  />
                </div>
                {notifications &&
                  notifications.map(notification => (
                    <div
                      onClick={() => selectNotification(notification)}
                      className={`${style['tile']} ${
                        style[
                          notification.read ? 'message-read' : 'message-unread'
                        ]
                      } ${
                        (selectedNotification?.id ?? 0) == notification.id &&
                        style['selected']
                      }`}
                    >
                      <Avatar user={notification.fromUser ?? {}} />
                      <div>
                        <p>
                          <strong>{notification.fromUser?.username}</strong>
                        </p>
                        <p>
                          {notification.type &&
                            template[notification.type].shortTitle}
                        </p>
                        <p className={style['datetime']}>
                          {now && moment(notification.createdAt).fromNow()}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
            <div className={style['message']}>
              {selectedNotification && (
                <div className={style['date']}>
                  {toDateTimeString(selectedNotification?.createdAt)}
                </div>
              )}
              {selectedNotification && selectedNotification.type ? (
                <div
                  dangerouslySetInnerHTML={{
                    __html: getTemplateHTML(
                      template[selectedNotification.type].content ?? '',
                      selectedNotification
                    )
                  }}
                />
              ) : (
                <div className={style['select-message']}>Select a message</div>
              )}
            </div>
          </div>
        </Container>
      </div>
    </>
  );
};
