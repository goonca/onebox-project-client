import { useSearchParams } from 'next/navigation';
import style from './NewsViewer.module.scss';
import { NewsModel, UserModel } from 'shared/types/api-type';
import { NewsHeader } from 'components/compose/NewsHeader';
import { useEffect, useState } from 'react';
import { NewsContext } from 'shared/context/NewsContext';
import { useServices } from 'shared/hooks/useServices';
import React from 'react';
import { useComponent } from 'shared/hooks/useComponent';
import { PageProps } from 'shared/types/PagePropsType';

export const NewsViewer: React.FC<{ currentUser: PageProps }> = ({
  currentUser
}) => {
  const [news, setNews] = useState<NewsModel>();
  const { getNewsById } = useServices();
  const searchParams = useSearchParams();
  const { getComponentByType } = useComponent();

  const id = searchParams.get('id');

  useEffect(() => {
    getNewsById(id as unknown as number).then((res: any) => {
      const isValidNews = !!res.data;
      isValidNews && setNews(res.data);
    });
  }, []);

  return (
    <>
      <div className={style['news-viewer']}>
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
    </>
  );
};
