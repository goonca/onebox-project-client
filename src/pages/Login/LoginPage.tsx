import { Button, Link, TextField } from '@mui/material';
import style from './LoginPage.module.scss';
import { useServices } from 'shared/hooks/useServices';
import { useRef, useState } from 'react';
import { PageProps } from 'shared/types/PagePropsType';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { UserModel } from 'shared/types/api-type';

export type LoginPageProps = {
  currentUser: UserModel;
};

const LoginPage: React.FC<LoginPageProps> = ({
  currentUser
}: LoginPageProps) => {
  const [firstTime, setFirstTime] = useState(false);
  const { authenticate, saveUser } = useServices();

  const usernameRef = useRef<HTMLInputElement>();
  const passwordRef = useRef<HTMLInputElement>();
  const emailRef = useRef<HTMLInputElement>();

  const authenticateUser = (user: UserModel) => {
    authenticate(user);
  };
  const createUser = async (user: UserModel) => {
    const response = await saveUser(user);
    console.log(response);
  };

  const mangeUser = () => {
    const user = {
      username: usernameRef.current?.value,
      password: passwordRef.current?.value,
      email: emailRef.current?.value
    };
    firstTime ? createUser(user) : authenticateUser(user);
  };

  return (
    <>
      {JSON.stringify(currentUser)}
      <div className={style['login-page']}>
        <div className={style['left-side']}></div>
        <div className={style['right-side']}>
          <div>
            <img src="/static/onebox-logo.svg" height={30} />
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
                  variant="outlined"
                />
              )}
              <div className={style['form-controls']}>
                <Button
                  data-dark
                  variant={firstTime ? 'outlined' : 'contained'}
                  onClick={() => mangeUser()}
                >
                  {firstTime ? 'Sign Up' : 'Login'}
                </Button>

                <Link
                  onClick={() => setFirstTime(!firstTime)}
                  underline="hover"
                >
                  {firstTime
                    ? 'or Login an existent account'
                    : 'or Sign Up a new account'}
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
