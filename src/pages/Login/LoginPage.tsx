import { useState } from 'react';
import { PageProps } from 'shared/types/PagePropsType';

import { Logged } from './__parts/Logged';
import { NotLogged } from './__parts/NotLogged';
import style from './LoginPage.module.scss';

const LoginPage: React.FC<PageProps> = ({ currentUser }: PageProps) => {
  const [user, setUser] = useState(currentUser);
  return (
    <>
      <div className={style['login-page']}>
        <div className={style['left-side']}>&nbsp;</div>
        <div className={style['right-side']}>
          <div>
            <img src="/static/onebox-logo.svg" height={30} />

            {user ? (
              <Logged currentUser={user} setUser={setUser} />
            ) : (
              <NotLogged />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
