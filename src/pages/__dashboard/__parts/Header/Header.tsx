import { AccountCircle } from '@mui/icons-material';
import { useContext, useState } from 'react';
import { UserContext } from 'shared/context/UserContext';

import style from './Header.module.scss';

export const Header = () => {
  const currentUser = useContext(UserContext);
  const [showAvatar, setShowAvatar] = useState<boolean>(true);

  const handleAvatarOnload = () => {
    setShowAvatar(false);
  };
  return (
    <>
      <div className={style['header']} data-component="header">
        <div className={style['logo']}>
          <img src="/static/onebox-complete-logo-dark.svg" height={18} />
        </div>
        <label>{currentUser?.username}</label>

        <div className={style['avatar']}>
          {(showAvatar || !!!currentUser?.avatar) && <AccountCircle />}

          <img
            src={
              !!currentUser?.avatar
                ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${currentUser?.avatar}`
                : undefined
            }
            style={{ visibility: !!currentUser?.avatar ? 'visible' : 'hidden' }}
            onLoad={handleAvatarOnload}
          />
        </div>
      </div>
    </>
  );
};
