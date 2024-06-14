import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServices } from 'shared/hooks/useServices';
import {
  NewsModel,
  NewsStatistics,
  StatisticsModel
} from 'shared/types/api-type';

import { ComposeNews } from '../ComposeNews/ComposeNews';
import { NewsGeneralPage } from '../NewsGeneralPage/NewsGeneralPage';
import style from './NewsDetailsPage.module.scss';

type NewsDetailsPageProps = {
  type?: string;
};

export const NewsDetailsPage: React.FC<NewsDetailsPageProps> = (
  props?: NewsDetailsPageProps
) => {
  const { id } = useParams();
  const [value, setValue] = useState('1');
  const [statistics, setStatistics] = useState<NewsStatistics>();
  const [hits, setHits] = useState<StatisticsModel[]>();
  const { getGeneralStatistics, getStatisticByNews } = useServices();

  const getGenerals = useCallback((id: number) => {
    getGeneralStatistics(id).then((r: any) => {
      const _statistics: NewsStatistics = r?.data;
      setStatistics(_statistics);
    });
  }, []);
  const getHits = () => {
    getStatisticByNews(parseInt(id as string))
      .then((res: any) => {
        console.log(res);
        setHits(res.data);
      })
      .catch(console.error);
  };

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  useEffect(() => {
    getHits();
    getGenerals(id as unknown as number);
  }, []);
  return (
    <>
      <div className={style['news-details-page']}>
        {statistics?.news && (
          <>
            <div className={style['header']}>
              <div>
                <h2>
                  <Link to="../news">News</Link> / {id ?? 'Compose News'}
                </h2>
              </div>
            </div>
            <TabContext value={value}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChange}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Details" value="1" />
                  <Tab label="Composer" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <NewsGeneralPage statistics={statistics} hits={hits} />
              </TabPanel>
              <TabPanel value="2">
                <ComposeNews news={statistics?.news} />
              </TabPanel>
            </TabContext>
          </>
        )}
      </div>
    </>
  );
};
