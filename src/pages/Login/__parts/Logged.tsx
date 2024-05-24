import { Button, Link } from '@mui/material';
import { useRouter } from 'next/navigation';
import { Dispatch, SetStateAction } from 'react';
import { useServices } from 'shared/hooks/useServices';
import { UserModel } from 'shared/types/api-type';
import { PageProps } from 'shared/types/PagePropsType';

import style from './Logged.module.scss';

type LoogedPageType = PageProps & {
  setUser: Dispatch<SetStateAction<UserModel | undefined>>;
};

export const Logged: React.FC<LoogedPageType> = ({
  currentUser,
  setUser
}: LoogedPageType) => {
  const username = currentUser?.name ?? currentUser?.username;
  //const { push } = useRouter();
  const { logoff } = useServices();

  const logoffUser = async () => {
    await logoff();
    setUser(undefined);
  };
  const goToMySpace = () => {
    document.location.href = '/dashboard';
  };

  return (
    <>
      <div className={style['logged']}>
        <h2>Welcome {username}!</h2>
        <Button data-dark variant="contained" onClick={() => goToMySpace()}>
          Go to My Space
        </Button>
        <Link underline="hover" onClick={() => logoffUser()}>
          I'm not {username}
        </Link>
      </div>
    </>
  );
};
