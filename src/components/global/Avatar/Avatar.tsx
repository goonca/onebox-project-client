import { useState } from 'react';
import { default as MUIAvatar } from '@mui/material/Avatar';
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
      <MUIAvatar
        alt={user.name ?? user.username}
        src={
          user?.avatar &&
          `${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${user?.avatar}`
        }
        sx={{ width: size, height: size, bgcolor: 'gray' }}
      ></MUIAvatar>
    </>
  );
};
