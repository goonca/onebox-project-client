import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, OutlinedInput } from '@mui/material';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMoment } from 'shared/hooks/useMoment';
import { useServices } from 'shared/hooks/useServices';
import { NewsModel } from 'shared/types/api-type';

import style from './NewsPage.module.scss';

export const NewsPage = () => {
  const searchRef = useRef<HTMLInputElement>();
  const { getNews } = useServices();
  const navigate = useNavigate();
  const { twoLinesDate } = useMoment();

  const [news, setNews] = useState<NewsModel[]>();

  const localStorageKeys = Object.keys(localStorage);

  const getUnsavedNewDraft = () => {
    const draft = localStorage.getItem('draft-undefined');
    return draft && JSON.parse(draft);
  };

  const composeNews = () => {
    navigate('/dashboard/news/compose');
  };

  const editNews = (id: number) => {
    navigate('/dashboard/news/compose' + (id ? '/' + id : ''));
  };

  const listNews = async () => {
    const news = await getNews();
    setNews(news.data);
  };

  useEffect(() => {
    listNews();
  }, []);

  const unsavedDraft = getUnsavedNewDraft();
  unsavedDraft && news?.unshift(unsavedDraft);

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
          {/*<div className={style['left-side']}>
            <div className={style['content']}>.</div>
          </div>*/}
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
                      const dateInLines = n.createdAt
                        ? twoLinesDate(n.createdAt)
                        : [];
                      const draftBadge = localStorageKeys.includes(
                        'draft-' + n.id
                      );
                      const hasBadges = !!draftBadge;
                      return (
                        <tr key={n.id} onClick={() => editNews(n.id as number)}>
                          <td></td>
                          <td width="100%">
                            {hasBadges && (
                              <div className={style['badges']}>
                                {draftBadge && (
                                  <span className={style['draft-badge']}>
                                    unsaved changes
                                  </span>
                                )}
                              </div>
                            )}
                            <h1>{n.title}</h1>
                            <p>{n.headline}</p>
                          </td>
                          <td className={style['date']}>
                            {dateInLines.length && (
                              <>
                                {dateInLines[0] && <div>{dateInLines[0]}</div>}
                                {dateInLines[1] && <div>{dateInLines[1]}</div>}
                              </>
                            )}
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
