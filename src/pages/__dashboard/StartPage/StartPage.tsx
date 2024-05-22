'use client';

import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { UserContext } from 'shared/context/UserContext';
import { PageProps } from 'shared/types/PagePropsType';
import { Layout } from '../__parts/Layout/Layout';
import { NewsPage } from '../NewsPage/NewsPage';
import { ProfilePage } from '../ProfilePage/ProfilePage';
import { ComposeNews } from '../ComposeNews/ComposeNews';
import { FilesPage } from '../FilesPage/FilesPage';
import style from './StartPage.module.scss';
import { useEffect, useState } from 'react';
import { UserModel } from 'shared/types/api-type';
import { Alert, Snackbar } from '@mui/material';
import { SnackBarType } from 'shared/types/SnackBarType';
import { EventType, useEvent } from 'shared/hooks/useEvent';

export const StartPage: React.FC<PageProps> = (props: PageProps) => {
  //fix this
  document.body.style.backgroundColor = '#F3F5F9';
  const [currentUser, setCurrentUser] = useState<UserModel | undefined>(
    props.currentUser
  );

  const [snackBarOpened, setSnackBarOpened] = useState<boolean>(false);
  const [snackBar, setSnackBar] = useState<SnackBarType | undefined>(undefined);
  const { listen } = useEvent();

  useEffect(() => {
    const handleUpdateUser = ({ detail }: any) => {
      console.log(detail);
      !!!detail.errors && setCurrentUser(detail.data);
    };

    const handleUpdateSnackBar = ({ detail }: any) => {
      if (!!detail.messages || !!detail.errors) {
        setSnackBar(detail);
        setSnackBarOpened(true);
      }
    };

    listen(EventType.UPDATE_CURRENT_USER, handleUpdateUser);
    listen(EventType.UPDATE_SNACKBAR, handleUpdateSnackBar);
  }, []);

  return (
    <>
      <div className={style['start-page']} data-component="start-page">
        <UserContext.Provider value={currentUser}>
          <BrowserRouter>
            <Routes>
              <Route path="/dashboard" element={<Layout />}>
                <Route index element={<NewsPage />} />
                <Route path="profile" element={<ProfilePage />} />
                <Route path="news" element={<NewsPage />} />
                <Route path="news/compose/" element={<ComposeNews />} />
                <Route path="news/compose/:id" element={<ComposeNews />} />
                <Route path="files" element={<FilesPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </UserContext.Provider>
        <Snackbar
          open={snackBarOpened}
          autoHideDuration={6000}
          onClose={() => setSnackBarOpened(false)}
        >
          <Alert
            onClose={() => setSnackBarOpened(false)}
            severity={
              snackBar?.severity || (!!snackBar?.errors ? 'error' : 'success')
            }
            variant="filled"
            sx={{ width: '100%' }}
          >
            {!!snackBar?.errors &&
              snackBar?.errors?.map((m, i) => <div key={i}>{m.message}</div>)}
            {!!!snackBar?.errors &&
              !!snackBar?.messages &&
              snackBar?.messages?.map((m, i) => <div key={i}>{m}</div>)}
          </Alert>
        </Snackbar>
      </div>
    </>
  );
};
