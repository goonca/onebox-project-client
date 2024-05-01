import { useContext, useEffect, useRef, useState } from 'react';
import style from './NewsPage.module.scss';
import { UserContext } from 'shared/context/UserContext';
import { Button, OutlinedInput } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useServices } from 'shared/hooks/useServices';
import { NewsModel } from 'shared/types/api-type';
import { useMoment } from 'shared/hooks/useMoment';

export const NewsPage = () => {
  const currentUser = useContext(UserContext);
  const searchRef = useRef<HTMLInputElement>();
  const { getNews } = useServices();
  const navigate = useNavigate();
  const { toDateTimeString } = useMoment();

  const [news, setNews] = useState<NewsModel[]>();

  const composeNews = () => {
    navigate('/dashboard/news/compose');
  };

  const editNews = (id: number) => {
    navigate('/dashboard/news/compose/' + id);
  };

  const listNews = async () => {
    const news = await getNews();
    setNews(news.data);
  };

  useEffect(() => {
    listNews();
  }, []);

  return (
    <>
      <div className={style['news-page']} data-component="news-page">
        <div className={style['header']}>
          <div>
            <h2>News</h2>
          </div>
          <div>
            <Button variant="contained" onClick={() => composeNews()}>
              Compose
            </Button>
          </div>
        </div>
        <div className={style['search-input']}>
          <OutlinedInput
            inputRef={searchRef}
            startAdornment={
              <>
                &nbsp;&nbsp;
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                &nbsp;&nbsp;
              </>
            }
          />
        </div>

        <div className={style['wrapper']}>
          <div className={style['left-side']}>
            <div className={style['content']}>.</div>
          </div>
          <div className={style['right-side']}>
            <div className={style['content']}>
              <table cellSpacing={0}>
                <thead>
                  <tr>
                    <th></th>
                    <th>Title</th>
                    <th>Date</th>
                  </tr>
                </thead>
                <tbody>
                  {news &&
                    news?.map(n => {
                      return (
                        <tr key={n.id} onClick={() => editNews(n.id as number)}>
                          <td></td>
                          <td width="100%">
                            <h1>{n.title}</h1>
                            <p>{n.headline}</p>
                          </td>
                          <td className={style['date']}>
                            {toDateTimeString(n.createdAt)}
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
