'use client';

import style from './StartPage.module.scss';
import { PageProps } from 'shared/types/PagePropsType';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../__parts/Layout/Layout';
import { NewsPage } from '../NewsPage/NewsPage';
import { ProfilePage } from '../ProfilePage/ProfilePage';
import { UserContext } from 'shared/context/UserContext';
import { ComposeNews } from '../ComposeNews/ComposeNews';
import { FilesPage } from '../FilesPage/FilesPage';

export const StartPage: React.FC<PageProps> = ({ currentUser }: PageProps) => {
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
