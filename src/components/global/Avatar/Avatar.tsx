import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';

import { UserModel } from 'shared/types/api-type';

import style from './Avatar.module.scss';

export type AvatarProps = {
  user: UserModel;
};

export const Avatar: React.FC<AvatarProps> = ({ user }: AvatarProps) => {
  const [showAvatar, setShowAvatar] = useState<boolean>(true);

  const handleAvatarOnload = () => {
    setShowAvatar(false);
  };
  return (
    <>
      <div className={style['avatar']}>
        {(showAvatar || !!!user?.avatar) && <AccountCircle />}

        <img
          src={
            !!user?.avatar
              ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${user?.avatar}`
              : undefined
          }
          style={{ visibility: !!user?.avatar ? 'visible' : 'hidden' }}
          onLoad={handleAvatarOnload}
        />
      </div>
    </>
  );
};
