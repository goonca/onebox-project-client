import { useSearchParams } from 'next/navigation';
import style from './NewsViewer.module.scss';
import { NewsModel } from 'shared/types/api-type';
import { NewsHeader } from 'components/compose/NewsHeader';
import { useContext, useEffect, useState } from 'react';
import { NewsContext } from 'shared/context/NewsContext';
import { useServices } from 'shared/hooks/useServices';

export const NewsViewer: React.FC<{ news?: NewsModel }> = props => {
  const [news, setNews] = useState<NewsModel>();
  const { getNewsById } = useServices();
  const searchParams = useSearchParams();
  const id = searchParams.get('id');

  useEffect(() => {
    getNewsById(id as unknown as number).then((res: any) => {
      const isValidNews = !!res.data.news;
      isValidNews && setNews(res.data.news);
    });
  }, []);

  return (
    <>
      <div className={style['news-viewer']}>
        <div className={style['wrapper']} data-component="news-wrapper">
          <NewsContext.Provider value={news}>
            <NewsHeader />
          </NewsContext.Provider>
        </div>
      </div>
    </>
  );
};
