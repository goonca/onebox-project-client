import style from './MetterSelector.module.scss';
import { NewsModel } from 'shared/types/api-type';
import { SyntheticEvent, useEffect, useState } from 'react';
import { Rating } from '@mui/material';

export type MetterSelectorProps = {
  news: NewsModel;
  onChange: (metter: number) => void;
};

export const MetterSelector: React.FC<MetterSelectorProps> = (
  props: MetterSelectorProps
) => {
  const [news, setNews] = useState<NewsModel>(props.news);

  const handleChangeMetter = (
    event: SyntheticEvent<Element, Event>,
    value: number | null
  ) => {
    props.onChange && props.onChange(value ?? 0);
  };

  useEffect(() => {
    setNews(props.news);
  }, [props]);

  return (
    <>
      <div className={style['metter-selector']}>
        <div className={style['header']}>
          <div>
            <h2>Metter</h2>
          </div>
        </div>
        <div className={style['wrapper']}>
          <Rating value={news.metter} onChange={handleChangeMetter} />
        </div>
      </div>
    </>
  );
};
