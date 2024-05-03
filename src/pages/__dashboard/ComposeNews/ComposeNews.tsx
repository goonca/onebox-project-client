import { Link, useParams } from 'react-router-dom';
import style from './ComposeNews.module.scss';
import {
  Button,
  FormControlLabel,
  FormGroup,
  Switch,
  TextField
} from '@mui/material';
import { NewsHeader, NewsHeaderProps } from 'components/compose/NewsHeader';
import { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { UserContext } from 'shared/context/UserContext';
import { useServices, ResponseType } from 'shared/hooks/useServices';
import { NewsModel } from 'shared/types/api-type';
import { FreeEditor } from './__parts/FreeEditor/FreeEditor';

export const ComposeNews = () => {
  const { id } = useParams();
  const currentUser = useContext(UserContext);
  const titleRef = useRef<HTMLInputElement>();
  const headlineRef = useRef<HTMLInputElement>();
  const showAuthorRef = useRef<HTMLInputElement>();
  const showDaterRef = useRef<HTMLInputElement>();
  const showBadgeRef = useRef<HTMLInputElement>();
  const { saveNews, getNewsById } = useServices();

  let currentNews: ResponseType = {};

  const [news, setNews] = useState<NewsHeaderProps>({
    title: '',
    headline: '',
    showAuthor: true,
    showDate: true
  });

  const getCurrentNews = (id: number) => {
    getNewsById(id).then((r: any) => {
      setNews(
        r?.data ?? {
          id,
          title: 'Title',
          headline: 'Headline',
          user: currentUser,
          userId: currentUser?.id,
          createdAt: new Date(),
          showAuthor: true,
          showDate: true
        }
      );
    });
  };

  const updateHeader = () => {
    setNews({
      ...news,
      title: titleRef.current?.value,
      headline: headlineRef.current?.value,
      //user: currentUser,
      //date: new Date(),
      showAuthor: showAuthorRef.current?.checked,
      showDate: showDaterRef.current?.checked
    });
  };

  const createNews = (news: NewsModel) => {
    const response = saveNews(news);
    response.then((r: any) => {
      setNews({ ...news, ...r.data[0] });
      console.log(r);
    });
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
        <div className={style['wrapper']}>
          <div className={style['left-side']}>
            <div className={style['content']}>
              <TextField
                inputRef={titleRef}
                label="Title"
                value={news?.title}
                multiline
                maxRows={4}
                onChange={() => updateHeader()}
              />

              <TextField
                inputRef={headlineRef}
                label="Headline"
                value={news?.headline}
                multiline
                maxRows={4}
                onChange={() => updateHeader()}
              />
              <FormGroup className={style['switchers']}>
                <FormControlLabel
                  control={
                    <Switch
                      inputRef={showAuthorRef}
                      checked={news?.showAuthor}
                      size="small"
                      onChange={() => updateHeader()}
                    />
                  }
                  label="Show author"
                />
                <FormControlLabel
                  control={
                    <Switch
                      inputRef={showDaterRef}
                      checked={news?.showDate}
                      size="small"
                      onChange={() => updateHeader()}
                    />
                  }
                  label="Show date"
                />
                <FormControlLabel
                  control={
                    <Switch
                      disabled
                      inputRef={showBadgeRef}
                      checked={news?.showBadge}
                      size="small"
                      onChange={() => updateHeader()}
                    />
                  }
                  label="Show badge"
                />
              </FormGroup>
            </div>
          </div>
          <div className={style['right-side']}>
            <div>editor</div>
            <div className={style['content']}>
              <NewsHeader {...news}></NewsHeader>
              <FreeEditor></FreeEditor>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
