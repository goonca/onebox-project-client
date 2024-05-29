import style from './ContextSelector.module.scss';
import {
  FormControl,
  FormControlLabel,
  Link,
  Radio,
  RadioGroup
} from '@mui/material';
import { LocationModel, NewsContext, NewsModel } from 'shared/types/api-type';
import { ChangeRegionDialog } from '../ChangeRegionDialog/ChangeRegionDialog';
import { useEffect, useRef, useState } from 'react';

export type ChangeContextType = {
  location?: LocationModel;
  context?: NewsContext;
};

export type ContextSelectorProps = {
  news: NewsModel;
  onChange: (props: ChangeContextType) => void;
};

export const ContextSelector: React.FC<ContextSelectorProps> = (
  props: ContextSelectorProps
) => {
  const [regionDialogOpened, setRegionDialogOpened] = useState<boolean>(false);
  const [news, setNews] = useState<NewsModel>(props.news);
  const refContext = useRef<typeof RadioGroup>(null);

  const handleChangeContext = (_: any, context: string) => {
    //props.news.context = parseInt(context);
    setNews({ ...news, context: parseInt(context) });
    props.onChange && props.onChange({ context: parseInt(context) });
  };

  const handleChangeRegion = (location: LocationModel) => {
    setRegionDialogOpened(false);
    location && setNews({ ...news, location });
    props.onChange && props.onChange({ location });
  };

  useEffect(() => {
    console.log(props.news);
    setNews(props.news);
  }, [props]);

  return (
    <>
      <div className={style['context-selector']}>
        <div className={style['header']}>
          <div>
            <h2>Context</h2>
          </div>
          <div>
            <Link onClick={() => setRegionDialogOpened(true)}>Change</Link>
          </div>
        </div>
        <FormControl>
          <RadioGroup
            onChange={handleChangeContext}
            ref={refContext}
            value={news.context}
          >
            <div className={`${style['level']} ${style['level-1']}`}>
              <FormControlLabel
                control={<Radio value={NewsContext.WORLD} size="small" />}
                label="World"
              />
            </div>
            <div className={`${style['level']} ${style['level-2']}`}>
              <h3>↳</h3>
              <FormControlLabel
                control={<Radio value={NewsContext.COUNTRY} size="small" />}
                label={news?.location?.country}
              />
            </div>
            <div className={`${style['level']} ${style['level-3']}`}>
              <h3>↳</h3>
              <FormControlLabel
                control={<Radio value={NewsContext.REGION} size="small" />}
                label={
                  <>
                    {news?.location?.name}{' '}
                    <span className={style['and-region-label']}>
                      (and region)
                    </span>
                  </>
                }
              />
            </div>
          </RadioGroup>
        </FormControl>
      </div>
      <ChangeRegionDialog
        open={regionDialogOpened}
        onChange={handleChangeRegion}
        onClose={() => setRegionDialogOpened(false)}
      />
    </>
  );
};
