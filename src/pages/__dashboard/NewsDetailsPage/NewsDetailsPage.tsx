import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
  SelectChangeEvent,
  Tab
} from '@mui/material';
import { ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServices } from 'shared/hooks/useServices';
import { getEmptyNews } from 'shared/utils/newsUtils';
import {
  LocationModel,
  NewsModel,
  NewsStatistics,
  StatisticsModel
} from 'shared/types/api-type';

import { ComposeNews } from '../ComposeNews/ComposeNews';
import {
  ChartHit,
  GroupedHit,
  NewsGeneralPage,
  PageStatus
} from '../NewsGeneralPage/NewsGeneralPage';
import style from './NewsDetailsPage.module.scss';
import { UserContext } from 'shared/context/UserContext';
import { SelectUserDialog } from './__parts/SelectUserDialog/SelectUserDialog';

type NewsDetailsPageProps = {
  type?: string;
};

export const NewsDetailsPage: React.FC<NewsDetailsPageProps> = (
  props?: NewsDetailsPageProps
) => {
  const { id: initialId } = useParams();
  const currentUser = useContext(UserContext);
  const [version, setVersion] = useState<string | number | undefined>();
  const [usersDialogOpened, setUsersDialogOpened] = useState<boolean>(false);
  const [id, setId] = useState<string | number | undefined>(initialId);
  const [value, setValue] = useState(id ? '1' : '2');
  const [statistics, setStatistics] = useState<NewsStatistics>();
  const [hits, setHits] = useState<StatisticsModel[]>();
  const [news, setNews] = useState<NewsModel>();
  const [groupedHits, setGroupedHits] = useState<GroupedHit[]>();
  const [chartHits, setChartHits] = useState<ChartHit[]>();
  const [pageStatus, setPageStatus] = useState<PageStatus>({
    currentPage: 0,
    pages: 1
  });
  const {
    getGeneralStatistics,
    getStatisticByNews,
    getGroupedStatisticsByNews,
    getNewsById
  } = useServices();
  const PAGE_SIZE = 5;

  const getGenerals = () => {
    getGeneralStatistics(id as unknown as number).then((r: any) => {
      const _statistics: NewsStatistics = r?.data;
      setStatistics(_statistics);
    });
  };

  const getHits = (page: number) => {
    getStatisticByNews(id as unknown as number, page, PAGE_SIZE)
      .then((res: any) => {
        setHits(res.data);
        setPageStatus({ currentPage: page, pages: res.pages });
      })
      .catch(console.error);
  };

  const getGroupedHits = () => {
    getGroupedStatisticsByNews(id as unknown as number, 'location.name')
      .then((res: any) => {
        setGroupedHits(res.data);
      })
      .catch(console.error);
  };

  const getChartHits = () => {
    getGroupedStatisticsByNews(id as unknown as number, 'statistics.createdAt')
      .then((res: any) => {
        setChartHits(res.data);
      })
      .catch(console.error);
  };

  const getCurrentNews = () => {
    getNewsById(id as unknown as number).then((r: any) => {
      const news: NewsModel = id
        ? /*{
          ...r?.data.news,
          components: r?.data.components
        }*/ r?.data
        : getEmptyNews(currentUser, id);

      setNews(news);
    });
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangeHitsPage = (page: number) => {
    const newPage = Math.max(Math.min(page, pageStatus.pages), 0);
    //console.log(newPage);
    getHits(newPage);
  };

  const handleChangeVersion = (
    event: SelectChangeEvent<string[]>,
    child: ReactNode
  ) => {
    event.target.value == 'share' && setUsersDialogOpened(true);
    setVersion(event.target.value as string);
    console.log(version);
  };

  const handleUpdateNews = (news?: NewsModel) => {
    console.log('handleUpdateNews', news);
    if (news) {
      setNews(news);
      setId(news.id);
      return;
    }

    loadServices();
  };

  const loadServices = () => {
    getHits(pageStatus.currentPage);
    getGroupedHits();
    getChartHits();
    getGenerals();
    getCurrentNews();
  };

  useEffect(() => {
    loadServices();
  }, [id]);
  return (
    <>
      <div className={style['news-details-page']}>
        <div className={style['header']}>
          <div>
            <h2>
              <Link to="../news">News</Link> / {id ?? 'Compose News'}
            </h2>
          </div>
          <div>
            <FormControl>
              <Select
                labelId="demo-multiple-checkbox-label"
                id="demo-multiple-checkbox"
                value={['samuel', 'goncalves']}
                onChange={handleChangeVersion}
                displayEmpty
                renderValue={selected => selected.join(', ')}
              >
                <MenuItem key={'name'} value={'name'}>
                  <Checkbox checked={true} />
                  <ListItemText primary={'username 1'} />
                </MenuItem>
                <MenuItem key={'name1'} value={'name'}>
                  <Checkbox checked={true} />
                  <ListItemText primary={'username 2'} />
                </MenuItem>
                <MenuItem key={'share'} value={'share'}>
                  <ListItemText primary={'Share'} />
                </MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList onChange={handleChangeTab}>
              <Tab label="Details" value="1" disabled={!!!id} />
              <Tab label="Composer" value="2" />
            </TabList>
          </Box>
          <TabPanel value="1">
            {statistics?.news && (
              <NewsGeneralPage
                statistics={statistics}
                hits={hits}
                groupedHits={groupedHits}
                chartHits={chartHits}
                pageStatus={pageStatus}
                onPageChange={handleChangeHitsPage}
              />
            )}
          </TabPanel>
          <TabPanel value="2">
            <ComposeNews news={news} updateNews={handleUpdateNews} />
          </TabPanel>
        </TabContext>
      </div>
      <SelectUserDialog
        open={usersDialogOpened}
        onChange={function (location: LocationModel): void {
          throw new Error('Function not implemented.');
        }}
        onClose={function (): void {
          throw new Error('Function not implemented.');
        }}
      />
    </>
  );
};
