import { Button, Link, TextField } from '@mui/material';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';
import { ResponseType, useServices } from 'shared/hooks/useServices';
import { RequestStatus, UserModel } from 'shared/types/api-type';

import style from './NotLogged.module.scss';

export const NotLogged = () => {
  const [firstTime, setFirstTime] = useState(false);
  const { authenticate, saveUser } = useServices();
  const { push } = useRouter();

  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const emailRef = useRef<HTMLInputElement>();

  const authenticateUser = async (user: UserModel) => {
    return authenticate(user);
  };
  const createUser = async (user: UserModel) => {
    return await saveUser(user);
  };

  const mangeUser = () => {
    const user = {
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
      email: !!emailRef.current?.value ? emailRef.current?.value : undefined
    };
    const response = firstTime ? createUser(user) : authenticateUser(user);
    response.then((res: ResponseType) => {
      console.log(res);
      if (res.status == RequestStatus.SUCCESS) {
        document.location.href = '/dashboard';
      }
    });
  };
  return (
    <>
      <div className={style['not-logged']}>
        <p>Welcome to Onebox! Please login to your account.</p>
        <form>
          <TextField
            inputRef={usernameRef}
            label="Username"
            variant="outlined"
          />
          <TextField
            inputRef={passwordRef}
            label="Password"
            variant="outlined"
            type="password"
          />
          {firstTime && (
            <TextField
              inputRef={emailRef}
              label="Email"
              type="email"
              variant="outlined"
            />
          )}
          <div className={style['form-controls']}>
            <Button
              type="submit"
              data-dark
              variant={firstTime ? 'outlined' : 'contained'}
              onClick={() => mangeUser()}
            >
              {firstTime ? 'Sign Up' : 'Login'}
            </Button>

            <Link onClick={() => setFirstTime(!firstTime)} underline="hover">
              {firstTime
                ? 'or Login an existent account'
                : 'or Sign Up a new account'}
            </Link>
          </div>
        </form>
      </div>
    </>
  );
};
