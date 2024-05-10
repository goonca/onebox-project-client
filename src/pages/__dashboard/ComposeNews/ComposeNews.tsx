import { faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  debounce,
  FormControlLabel,
  Link as UILink,
  Switch
} from '@mui/material';
import { NewsHeader, NewsHeaderProps } from 'components/compose/NewsHeader';
import { useCallback, useContext, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from 'shared/context/UserContext';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import { useServices } from 'shared/hooks/useServices';
import { ComponentModel, NewsModel } from 'shared/types/api-type';
import { getEmptyNews } from 'shared/utils/newsUtils';

import { FreeEditor } from './__parts/FreeEditor/FreeEditor';
import { HeaderEditor } from './__parts/HeaderEditor/HeaderEditor';
import style from './ComposeNews.module.scss';

export const ComposeNews = () => {
  const { id } = useParams();
  const currentUser = useContext(UserContext);
  const { saveNews, getNewsById } = useServices();
  const [componentsOpened, setComponentsOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDraftMessage, setShowDraftMessage] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(true);
  const [news, setNews] = useState<NewsModel>(getEmptyNews(currentUser, id));

  const { setLocalStorage, getLocalStorage, removeLocalStorage, initialise } =
    useLocalStorage<NewsModel | undefined>('draft-' + id);

  const saveDraft = useCallback(
    debounce((n: NewsModel | undefined) => {
      setLocalStorage(n);
    }, 1000),
    []
  );

  const getCurrentNews = useCallback((id: number) => {
    const draft: NewsModel = getLocalStorage() as NewsModel;
    setLoading(true);

    getNewsById(id).then((r: any) => {
      setLoading(false);
      const news: NewsModel = id
        ? {
            ...r?.data.news,
            components: r?.data.components
          }
        : getEmptyNews(currentUser, id);

      if (draft) {
        console.log('draft', draft.components);
        setNews(draft);
        setShowDraftMessage(true);
      } else {
        setNews(news);
      }
    });
  }, []);

  const updateHeader = (header?: NewsHeaderProps) => {
    const _news = {
      ...news,
      ...header
    };
    setNews(_news);
    saveDraft(_news);
  };

  const createNews = useCallback((news: NewsModel) => {
    const response = saveNews(news);
    response.then((r: any) => {
      const resNews = r.data[0];
      setNews({ ...news, ...resNews });
      initialise(resNews.id?.toString() ?? 'undefined');
      removeLocalStorage();
      hideDraftMessage();
      !news.id &&
        history.replaceState(
          {},
          '',
          document.location.pathname + '/' + resNews.id
        );
    });
  }, []);

  const onComponentsOpen = (opened: boolean) => {
    setComponentsOpened(opened);
  };

  const onComponentsChange = (components?: ComponentModel[]) => {
    //console.log('before ordered', components);
    /*const orderedComp = components?.map((component, position) => {
      return { ...component, position };
    });*/
    const orderedComp = normalizeComponents(components);
    console.log('ordered', orderedComp);
    const _news = { ...news, components: [...(orderedComp ?? [])] };
    setNews(_news);
    saveDraft(_news);
  };

  const normalizeComponents = (comps?: ComponentModel[]) => {
    if (comps && news.components) {
      return comps
        .map((comp, i) => {
          return !!comp.type
            ? { ...comp, position: i }
            : {
                ...news.components?.find(c => c.id == comp.id),
                position: comp.position
              };
        })
        .sort((a: any, b: any) => a.position - b.position);
    }

    return comps;
  };

  const discardDraft = () => {
    removeLocalStorage();
    hideDraftMessage();
    getCurrentNews(id as unknown as number);
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
            <p>There are unsaved changes for this draft</p>
            <span>
              <UILink onClick={hideDraftMessage}>Keep changes</UILink>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <UILink onClick={discardDraft}>Discard changes</UILink>
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
            <div className={style['editor-header']}>
              <label>editor</label>
              <div className={style['editor-switcher']}>
                <FormControlLabel
                  control={
                    <Switch
                      size="small"
                      checked={editMode}
                      onChange={() => {
                        !editMode && setComponentsOpened(false);
                        setEditMode(!editMode);
                      }}
                    />
                  }
                  label="Edit mode"
                />
              </div>
            </div>
            <div
              className={`${style['overlay']} ${
                componentsOpened && editMode && style['visible']
              }`}
            ></div>
            <div className={style['content']}>
              <div className={style['header']}>
                <NewsHeader {...news}></NewsHeader>
              </div>

              {!loading && (
                <FreeEditor
                  onComponentsOpen={onComponentsOpen}
                  components={news.components ?? []}
                  newsId={id as unknown as number}
                  onChange={onComponentsChange}
                  editMode={editMode}
                ></FreeEditor>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
