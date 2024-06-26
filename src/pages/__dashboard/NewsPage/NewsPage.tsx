import {
  faMagnifyingGlass,
  faPenToSquare,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Link, OutlinedInput } from '@mui/material';
import { Avatar } from 'components/global/Avatar/Avatar';
//import { Loading } from 'components/global/Loading/Loading';
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
  const [loading, setLoading] = useState<boolean>(false);

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
    setLoading(true);
    const news = await getNews();
    setNews(news.data);
    setLoading(false);
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
            <Button
              className={style['compose-button']}
              variant="contained"
              onClick={() => composeNews()}
            >
              Compose
            </Button>
            <Button
              className={style['mobile-compose-button']}
              variant="contained"
              onClick={() => composeNews()}
            >
              <FontAwesomeIcon icon={faPlus} />
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
              {loading ? (
                <></>
              ) : (
                <>
                  <div className={style['table']}>
                    {news &&
                      news?.map(n => {
                        const createdAtInLines = n.createdAt
                          ? twoLinesDate(n.createdAt)
                          : [];
                        const updatedAtInLines = n.updatedAt
                          ? twoLinesDate(n.updatedAt)
                          : [];
                        const draftBadge = localStorageKeys.includes(
                          'draft-' + n.id
                        );
                        const hasBadges = !!draftBadge;

                        console.log(n);

                        return (
                          <>
                            <div
                              key={n.id}
                              className={style['table-inside']}
                              onClick={() => editNews(n.id as number)}
                            >
                              <div className={style['item']}>
                                {n.user && n.holderUser && (
                                  <span className={style['avatar']}>
                                    <Avatar user={n.user} />
                                  </span>
                                )}
                                <img
                                  className={style['cover']}
                                  src={`${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${n.cover}`}
                                ></img>
                                <div className={style['title']}>
                                  {hasBadges && (
                                    <div className={style['badges']}>
                                      {draftBadge && (
                                        <span className={style['draft-badge']}>
                                          unsaved changes
                                        </span>
                                      )}
                                    </div>
                                  )}
                                  {n.user && n.holderUser && (
                                    <p onClick={e => e.stopPropagation()}>
                                      by <Link>@{n.user.username}</Link>
                                    </p>
                                  )}
                                  <h1>{n.title}</h1>
                                  <p>{n.headline}</p>
                                </div>
                                <div className={style['date-block']}>
                                  <div>
                                    <label className={style['label-date']}>
                                      created at
                                    </label>
                                    <div className={style['date']}>
                                      {createdAtInLines.length && (
                                        <>
                                          {createdAtInLines[0] && (
                                            <div>{createdAtInLines[0]}</div>
                                          )}
                                          {createdAtInLines[1] && (
                                            <div>{createdAtInLines[1]}</div>
                                          )}
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  {!!updatedAtInLines.length && (
                                    <div>
                                      <label className={style['label-date']}>
                                        last update
                                      </label>
                                      <div className={style['date']}>
                                        {updatedAtInLines.length && (
                                          <>
                                            {updatedAtInLines[0] && (
                                              <div>{updatedAtInLines[0]}</div>
                                            )}
                                            {updatedAtInLines[1] && (
                                              <div>{updatedAtInLines[1]}</div>
                                            )}
                                          </>
                                        )}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <hr />
                          </>
                        );
                      })}
                    {(!!!news || (!!news && !!!news.length)) && (
                      <div className={style['no-news-message']}>
                        <h2>You have no news yet</h2>
                        <Button
                          variant="contained"
                          onClick={() => composeNews()}
                        >
                          Start now !
                        </Button>
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
