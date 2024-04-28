'use client';

import style from './StartPage.module.scss';
import { PageProps } from 'shared/types/PagePropsType';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from '../__parts/Layout/Layout';
import { NewsPage } from '../NewsPage/NewsPage';
import { ProfilePage } from '../ProfilePage/ProfilePage';

export const StartPage: React.FC<PageProps> = ({ currentUser }: PageProps) => {
  return (
    <>
      <div className={style['start-page']} data-component="start-page">
        {JSON.stringify(currentUser)}

        <BrowserRouter>
          <Routes>
            <Route path="/dashboard" element={<Layout />}>
              <Route index element={<NewsPage />} />
              <Route path="profile" element={<ProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </div>
    </>
  );
};
