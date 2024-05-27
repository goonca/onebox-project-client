import { useEffect, useState } from 'react';
import { PageProps } from 'shared/types/PagePropsType';

import { Logged } from './__parts/Logged';
import { NotLogged } from './__parts/NotLogged';
import style from './LoginPage.module.scss';

export const LoginPage: React.FC<PageProps> = ({ currentUser }: PageProps) => {
  const [user, setUser] = useState(currentUser);

  return (
    <>
      <style jsx global>{`
        body {
          background-image: url('/static/bluegreen-background.svg');
          background-size: cover;
        }
      `}</style>
      <div className={style['login-page']}>
        <div className={style['left-side']}>&nbsp;</div>
        <div className={style['right-side']}>
          <div className={style['wrapper']}>
            <img
              src="/static/onebox-complete-logo-dark.svg"
              height={20}
              className={style['logo']}
            />
            <img
              src="/static/onebox-complete-logo-light.svg"
              height={20}
              className={`${style['logo']} ${style['light']}`}
            />

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
