import style from './NewsViewer.module.scss';
import { NewsModel } from 'shared/types/api-type';
import { NewsHeader } from 'components/compose/NewsHeader';
import { useEffect, useState } from 'react';
import { NewsContext } from 'shared/context/NewsContext';
import React from 'react';
import { useComponent } from 'shared/hooks/useComponent';
import { UserHeader } from './__parts/UserHeader/UserHeader';

export type ViwerProps = {
  news: NewsModel;
  isPublished?: boolean;
};

export const NewsViewer: React.FC<ViwerProps> = props => {
  const [news, setNews] = useState<NewsModel>(props.news);
  const { getComponentByType } = useComponent();

  return (
    <>
      <style jsx global>{`
        body {
          background-color: #f3f5f9;
        }
      `}</style>
      <div className={style['news-viewer']}>
        <div className={style['content']}>
          {props.isPublished && (
            <div className={style['user']}>
              <UserHeader
                user={
                  (news?.holderUserId ? news?.holderUser : news?.user) ?? {}
                }
              />
            </div>
          )}
          <div className={style['wrapper']} data-component="news-wrapper">
            <div className={style['header']} data-component="news-header">
              <NewsContext.Provider value={news}>
                <NewsHeader />
              </NewsContext.Provider>
            </div>
            <div className={style['content']} data-component="news-content">
              {news?.components?.map((comp, index) => {
                const node = getComponentByType(comp.type);
                const element = React.createElement(node, {
                  ...comp,
                  $key: comp.key
                });

                return (
                  <div className={style['component-wrapper']}>{element}</div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
