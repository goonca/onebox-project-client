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

export const StartPage: React.FC<PageProps> = ({ currentUser }: PageProps) => {
  //fix this
  document.body.style.backgroundColor = '#F3F5F9';
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
      </div>
    </>
  );
};
