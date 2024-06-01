import { faClose, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Button,
  debounce,
  FormControlLabel,
  Link as MUILink,
  RadioGroup,
  Switch
} from '@mui/material';
import { NewsHeader } from 'components/compose/NewsHeader';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { UserContext } from 'shared/context/UserContext';
import { useLocalStorage } from 'shared/hooks/useLocalStorage';
import { useServices } from 'shared/hooks/useServices';
import {
  ComponentModel,
  LocationModel,
  NewsModel,
  SectionModel
} from 'shared/types/api-type';
import { getEmptyNews } from 'shared/utils/newsUtils';

import { FreeEditor } from './__parts/FreeEditor/FreeEditor';
import { HeaderEditor } from './__parts/HeaderEditor/HeaderEditor';
import { useComponent } from 'shared/hooks/useComponent';
import { EditorContext } from 'shared/context/EditorContext';
import { EditorReturn } from 'shared/types/EditorReturn';
import React from 'react';
import style from './ComposeNews.module.scss';
import {
  ChangeContextType,
  ContextSelector
} from './__parts/ContextSelector/ContextSelector';
import { SectionSelector } from './__parts/SectionSelector/SectionSelector';

export const ComposeNews = () => {
  const { id } = useParams();
  const currentUser = useContext(UserContext);
  const { saveNews, getNewsById } = useServices();
  const [componentsOpened, setComponentsOpened] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [showDraftMessage, setShowDraftMessage] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(true);
  const [maximized, setMaximized] = useState<boolean>(false);
  const [editingComponent, setEditingComponent] = useState<ComponentModel>();

  const [lastEditingComponent, setLastEditingComponent] =
    useState<ComponentModel>();
  const [news, setNews] = useState<NewsModel>(getEmptyNews(currentUser, id));

  const editorContext = useContext(EditorContext);

  const { setLocalStorage, getLocalStorage, removeLocalStorage, initialise } =
    useLocalStorage<NewsModel | undefined>('draft-' + id);

  const { getValidComponents, getEditorByType } = useComponent();

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
        ? /*{
            ...r?.data.news,
            components: r?.data.components
          }*/ r?.data
        : getEmptyNews(currentUser, id);

      if (draft) {
        setNews(draft);
        setShowDraftMessage(true);
      } else {
        setNews(news);
      }
    });
  }, []);

  const updateHeader = (header?: NewsModel) => {
    const _news = {
      ...news,
      ...header
    };
    setNews(_news);
    saveDraft(_news);
  };

  const createNews = useCallback((news: NewsModel) => {
    const response = saveNews({
      ...news,
      locationGeonameId: news?.location?.geoname_id
    });
    response.then((r: any) => {
      const resNews = r.data[0];
      setNews({ ...news, ...resNews });
      removeLocalStorage();
      initialise(resNews.id?.toString() ?? 'undefined');
      //removeLocalStorage();
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
    //console.log(orderedComp);
    const _news = { ...news, components: [...(orderedComp ?? [])] };
    _news.cover = (components?.find(c => !!c.isCover) || {}).key;
    //console.log(_news.components);
    setNews(_news);
    saveDraft(_news);
  };

  const normalizeComponents = (comps?: ComponentModel[]) => {
    if (!comps) return [];
    const mappedComps = comps.map((comp, i) => {
      return !!comp.type
        ? { ...comp, position: i }
        : {
            ...news.components?.find(
              c => c.id == comp.id || c.tempId == comp.tempId
            ),
            position: comp.position
          };
    });

    //console.log('mappedComps', mappedComps);

    if (comps && news.components) {
      //console.log('valids', getValidComponents(mappedComps));
      return getValidComponents(mappedComps);
    }
    //console.log('after', comps);
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

  const changeComponentProps = (changes: EditorReturn) => {
    if (!editingComponent) return;

    const _editingComponent: ComponentModel = {
      ...editingComponent,
      ...changes
    };

    const _components = news.components?.map(component => {
      if (
        (!!component.tempId && component.tempId == _editingComponent?.tempId) ||
        (!!component.id && component.id == _editingComponent?.id)
      ) {
        return { ..._editingComponent, position: component.position };
      }

      return component;
    });

    onComponentsChange(_components ?? []);
  };

  const onEdit = (component?: ComponentModel) => {
    !!component && setLastEditingComponent(component);
    setEditingComponent(component);
  };

  const handleEditorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  const handleChangeRegion = (props: ChangeContextType) => {
    props.location && setNews({ ...news, location: props.location });
    props.context !== undefined && setNews({ ...news, context: props.context });
  };

  const handleChangeSection = (section: SectionModel) => {
    if (section.id == news.sectionId) {
      setNews({ ...news, section: undefined, sectionId: undefined });
      return;
    }

    setNews({ ...news, section, sectionId: section.id });
  };

  const closeEditor = (e: React.MouseEvent<HTMLDivElement>) => {
    setEditingComponent(undefined);
  };

  useEffect(() => {
    return getCurrentNews(id as unknown as number);
  }, []);

  useEffect(() => {
    setMaximized(editorContext.maximized);
  }, [editorContext]);

  return (
    <>
      <div className={style['compose-news']} onMouseDown={closeEditor}>
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
            <Button
              variant="contained"
              size="small"
              href={document.location.origin + '/viewer?id=' + news.id}
              target="_blank"
            >
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
              <MUILink onClick={hideDraftMessage}>Keep changes</MUILink>
              &nbsp;&nbsp;|&nbsp;&nbsp;
              <MUILink onClick={discardDraft}>Discard changes</MUILink>
            </span>
          </div>
        )}
        <div className={style['wrapper']}>
          <div className={style['left-side']}>
            <div className={style['content']}>
              <HeaderEditor updateHeader={updateHeader} news={news} />
            </div>
            <div className={style['content']}>
              <ContextSelector news={news} onChange={handleChangeRegion} />
            </div>
            <div className={style['content']}>
              <SectionSelector news={news} onChange={handleChangeSection} />
            </div>
          </div>
          <div
            className={`${style['right-side']} ${
              editingComponent && style['editting']
            }`}
          >
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
                <NewsHeader news={news}></NewsHeader>
              </div>

              {!loading && (
                <FreeEditor
                  onComponentsOpen={onComponentsOpen}
                  components={news.components}
                  newsId={id as unknown as number}
                  onChange={onComponentsChange}
                  onEdit={onEdit}
                  editMode={editMode}
                ></FreeEditor>
              )}
            </div>
          </div>
        </div>
        {
          <div
            onClick={handleEditorClick}
            onMouseDown={handleEditorClick}
            className={`${style['edit-properties']} ${
              !editingComponent && style['hidden']
            } ${maximized && style['maximized']}`}
          >
            <div className={style['header']}>
              <h1>
                {(
                  editingComponent ??
                  lastEditingComponent ??
                  {}
                ).type?.toString()}
              </h1>
              <Button onClick={() => setEditingComponent(undefined)}>
                <FontAwesomeIcon icon={faXmark} />
              </Button>
            </div>
            <div className={style['content']}>
              <div>
                {(editingComponent || lastEditingComponent) &&
                  React.createElement(
                    getEditorByType(
                      (editingComponent ?? lastEditingComponent ?? {}).type
                    ),
                    {
                      component: editingComponent,
                      onChange: changeComponentProps
                    }
                  )}
              </div>
            </div>
          </div>
        }
      </div>
    </>
  );
};
