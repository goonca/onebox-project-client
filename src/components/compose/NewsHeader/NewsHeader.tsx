import { useContext, useEffect, useState } from 'react';
import { NewsContext } from 'shared/context/NewsContext';
import { NewsModel } from 'shared/types/api-type';

import style from './NewsHeader.module.scss';

export const NewsHeader: React.FC<{ news?: NewsModel }> = props => {
  const newsContext = useContext(NewsContext);
  const [news, setNews] = useState<NewsModel | undefined>(props.news);

  useEffect(() => {
    console.log(props.news);
    props.news && setNews(props.news);
  }, [props]);

  useEffect(() => {
    console.log('newsContext', newsContext);
    newsContext && setNews(newsContext);
  }, [newsContext]);

  return (
    <>
      <header className={style['news-header']} data-component="news-header">
        <h1 className={style.bagde}>{news?.title}</h1>
        {news?.headline && <p>{news?.headline}</p>}
        <div>
          {news?.showAuthor && news?.user && (
            <address>
              By
              <a rel="author" href="#">
                {news?.user?.name ?? news?.user?.username}
              </a>
            </address>
          )}
          {news?.showDate && news?.createdAt && (
            <time
              dateTime={new Date(news?.createdAt).toLocaleDateString()}
              title={new Date(news?.createdAt).toDateString()}
            >
              {new Date(news?.createdAt).toLocaleString()}
            </time>
          )}
        </div>
      </header>
    </>
  );
};
