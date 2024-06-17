import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { Box, Tab } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServices } from 'shared/hooks/useServices';
import {
  LocationModel,
  NewsModel,
  NewsStatistics,
  StatisticsModel
} from 'shared/types/api-type';

import { ComposeNews } from '../ComposeNews/ComposeNews';
import {
  GroupedHits,
  NewsGeneralPage,
  PageStatus
} from '../NewsGeneralPage/NewsGeneralPage';
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
  const [groupedHits, setGroupedHits] = useState<GroupedHits[]>();
  const [pageStatus, setPageStatus] = useState<PageStatus>({
    currentPage: 0,
    pages: 1
  });
  const {
    getGeneralStatistics,
    getStatisticByNews,
    getGroupedStatisticsByNews
  } = useServices();
  const PAGE_SIZE = 5;

  const getGenerals = useCallback((id: number) => {
    getGeneralStatistics(id).then((r: any) => {
      const _statistics: NewsStatistics = r?.data;
      setStatistics(_statistics);
    });
  }, []);
  const getHits = (page: number) => {
    getStatisticByNews(parseInt(id as string), page, PAGE_SIZE)
      .then((res: any) => {
        setHits(res.data);
        setPageStatus({ currentPage: page, pages: res.pages });
      })
      .catch(console.error);
  };

  const getGroupedHits = () => {
    getGroupedStatisticsByNews(parseInt(id as string), 'location.name')
      .then((res: any) => {
        setGroupedHits(res.data);
        console.log(res.data);
      })
      .catch(console.error);
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangeHitsPage = (page: number) => {
    const newPage = Math.max(Math.min(page, pageStatus.pages), 0);
    console.log(newPage);
    getHits(newPage);
  };

  useEffect(() => {
    getHits(pageStatus.currentPage);
    getGroupedHits();
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
                  onChange={handleChangeTab}
                  aria-label="lab API tabs example"
                >
                  <Tab label="Details" value="1" />
                  <Tab label="Composer" value="2" />
                </TabList>
              </Box>
              <TabPanel value="1">
                <NewsGeneralPage
                  statistics={statistics}
                  hits={hits}
                  groupedHits={groupedHits}
                  pageStatus={pageStatus}
                  onPageChange={handleChangeHitsPage}
                />
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
