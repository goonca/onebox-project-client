import { Avatar } from 'components/global/Avatar/Avatar';
import { UserModel } from 'shared/types/api-type';
import style from './UserHeader.module.scss';

export type UserHeaderProps = {
  user: UserModel;
};

export const UserHeader: React.FC<UserHeaderProps> = ({
  user
}: UserHeaderProps) => {
  return (
    <>
      <div className={style['user-header']}>
        <Avatar user={user} />
        <div className={style['detils']}>
          {user?.name && <h3>{user?.name}</h3>}
          <p>@{user.username}</p>
        </div>
      </div>
    </>
  );
};
