import { useParams } from 'react-router-dom';
import style from './ComposeNews.module.scss';
import {
  Button,
  FilledInput,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  InputLabel,
  OutlinedInput,
  Switch,
  TextField
} from '@mui/material';
import { NewsHeader } from 'components/compose/NewsHeader';
import { useContext, useRef, useState } from 'react';
import { NewsModel } from 'shared/types/api-type';

export const ComposeNews = () => {
  const { id } = useParams();
  const titleRef = useRef<HTMLInputElement>();

  let [news, setNews] = useState<NewsModel>({
    title: 'Title',
    headline: 'Headline'
  });
  return (
    <>
      <div className={style['compose-news']}>
        <div className={style['header']}>
          <div>
            <h2>Compose News</h2>
          </div>
          <div>
            <Button variant="contained">Save draft</Button>
            <Button variant="contained">View</Button>
            <Button variant="contained" data-dark>
              Publish
            </Button>
          </div>
        </div>
        <div className={style['wrapper']}>
          <div className={style['left-side']}>
            <TextField label="Title" multiline maxRows={4} />

            <TextField label="Headline" multiline maxRows={4} />
            <FormGroup className={style['switchers']}>
              <FormControlLabel
                control={<Switch defaultChecked size="small" />}
                label="Show author"
              />
              <FormControlLabel
                control={<Switch defaultChecked size="small" />}
                label="Show date"
              />
              <FormControlLabel
                control={<Switch defaultChecked size="small" />}
                label="Show badge"
              />
            </FormGroup>
          </div>
          <div className={style['right-side']}>
            <div>editor</div>
            <div className={style['content']}>
              <NewsHeader {...news}></NewsHeader>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
