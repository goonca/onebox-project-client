import { AccountCircle } from '@mui/icons-material';
import { useState } from 'react';

import { UserModel } from 'shared/types/api-type';

import style from './Avatar.module.scss';

export type AvatarProps = {
  user: UserModel;
  size?: number;
};

export const Avatar: React.FC<AvatarProps> = ({ user, size }: AvatarProps) => {
  const [showAvatar, setShowAvatar] = useState<boolean>(true);

  const handleAvatarOnload = () => {
    setShowAvatar(false);
  };
  return (
    <>
      <div
        className={style['avatar']}
        style={{
          ...(size ? { width: `${size}px`, height: `${size}px` } : {})
        }}
      >
        {(showAvatar || !!!user?.avatar) && (
          <AccountCircle
            style={{
              ...(size
                ? { width: `${size + 5}px`, height: `${size + 5}px` }
                : {})
            }}
          />
        )}

        <img
          src={
            !!user?.avatar
              ? `${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${user?.avatar}`
              : undefined
          }
          style={{
            visibility: !!user?.avatar ? 'visible' : 'hidden',
            ...(size ? { width: `${size}px`, height: `${size}px` } : {})
          }}
          onLoad={handleAvatarOnload}
        />
      </div>
    </>
  );
};
