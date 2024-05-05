import { Link, useParams } from 'react-router-dom';
import style from './ComposeNews.module.scss';
import { Button, Link as UILink } from '@mui/material';
import { NewsHeader, NewsHeaderProps } from 'components/compose/NewsHeader';
import { useContext, useEffect, useState } from 'react';
import { UserContext } from 'shared/context/UserContext';
import { useServices } from 'shared/hooks/useServices';
import { NewsModel } from 'shared/types/api-type';
import {
  EditorComponentType,
  FreeEditor
} from './__parts/FreeEditor/FreeEditor';
import { HeaderEditor } from './__parts/HeaderEditor/HeaderEditor';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const ComposeNews = () => {
  const { id } = useParams();
  const currentUser = useContext(UserContext);
  const { saveNews, getNewsById } = useServices();
  const [componentsOpened, setComponentsOpened] = useState<boolean>(false);
  const [showDraftMessage, setShowDraftMessage] = useState<boolean>(false);
  const [news, setNews] = useState<NewsHeaderProps>({
    title: '',
    headline: '',
    showAuthor: true,
    showDate: true
  });

  const { storedValue, setInLocalStorage, removeFromLocalStorage } =
    useLocalStorage<NewsModel>('draft-' + id);

  const emptyNews: NewsModel = {
    id,
    title: 'Title',
    headline: 'Headline',
    user: currentUser,
    userId: currentUser?.id,
    createdAt: new Date(),
    showAuthor: true,
    showDate: true
  };

  const getCurrentNews = (id: number) => {
    const draft: NewsModel = storedValue as NewsModel;

    if (draft) {
      setNews(draft);
      setShowDraftMessage(true);
    } else {
      getNewsById(id).then((r: any) => {
        setNews(r?.data ?? emptyNews);
      });
    }
  };

  const updateHeader = (header?: NewsHeaderProps) => {
    setNews({
      ...news,
      ...header
    });
  };

  const createNews = (news: NewsModel) => {
    const response = saveNews(news);
    response.then((r: any) => {
      setNews({ ...news, ...r.data[0] });
      console.log(r);
    });
  };

  const onComponentsOpen = (opened: boolean) => {
    setComponentsOpened(opened);
  };

  const onComponentsChange = (components?: EditorComponentType[]) => {
    news.components = components ?? [];
    components && setInLocalStorage(news);
  };

  const discardDraft = () => {
    removeFromLocalStorage();
    news.components = [];
    getCurrentNews(id as unknown as number);
    hideDraftMessage();
  };

  const hideDraftMessage = () => {
    setShowDraftMessage(false);
  };

  useEffect(() => {
    return getCurrentNews(id as unknown as number);
  }, []);

  return (
    <>
      <div className={style['compose-news']}>
        <div className={style['header']}>
          <div>
            <h2>
              <Link to="../news">News</Link> / Compose News
            </h2>
          </div>
          <div>
            <Button
              variant="contained"
              size="small"
              onClick={() => news && createNews(news)}
            >
              Save draft
            </Button>
            <Button variant="contained" size="small">
              View
            </Button>
            <Button variant="contained" size="small" data-dark>
              Publish
            </Button>
          </div>
        </div>
        {showDraftMessage && (
          <div className={style['draft-message']}>
            <span>
              <Button onClick={hideDraftMessage}>
                <FontAwesomeIcon icon={faClose} />
              </Button>
            </span>
            <p>This is an unsaved draft for this news</p>
            <span>
              <UILink onClick={hideDraftMessage}>Keep draft</UILink>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <UILink onClick={discardDraft}>Discard draft</UILink>
            </span>
          </div>
        )}
        <div className={style['wrapper']}>
          <div className={style['left-side']}>
            <div className={style['content']}>
              <HeaderEditor updateHeader={updateHeader} news={news} />
            </div>
          </div>
          <div className={style['right-side']}>
            <div>editor</div>
            <div
              className={`${style['overlay']} ${
                componentsOpened ? style['visible'] : ''
              }`}
            ></div>
            <div className={style['content']}>
              <div className={style['header']}>
                <NewsHeader {...news}></NewsHeader>
              </div>
              <FreeEditor
                onComponentsOpen={onComponentsOpen}
                components={news.components ?? []}
                newsId={id as unknown as number}
                onChange={onComponentsChange}
              ></FreeEditor>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
