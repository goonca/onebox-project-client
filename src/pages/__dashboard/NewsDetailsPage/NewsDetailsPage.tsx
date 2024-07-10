import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import {
  Box,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tab,
  Typography
} from '@mui/material';
import { ReactNode, useContext, useEffect, useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useServices } from 'shared/hooks/useServices';
import { getEmptyNews } from 'shared/utils/newsUtils';
import {
  IdType,
  NewsModel,
  NewsStatistics,
  StatisticsModel,
  UserModel,
  ViewerSurceEnum
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
import { Avatar } from 'components/global/Avatar/Avatar';
import { faCirclePlus, faUserPlus } from '@fortawesome/free-solid-svg-icons';

type NewsDetailsPageProps = {
  type?: string;
};

export const NewsDetailsPage: React.FC<NewsDetailsPageProps> = (
  props?: NewsDetailsPageProps
) => {
  const { id: initialId } = useParams();
  const originalId = useRef<IdType>(initialId);
  const currentUser = useContext(UserContext);
  const [usersDialogOpened, setUsersDialogOpened] = useState<boolean>(false);
  const [id, setId] = useState<string | number | undefined>(initialId);
  const [value, setValue] = useState(id ? '1' : '2');
  const [statistics, setStatistics] = useState<NewsStatistics>();
  const [hits, setHits] = useState<StatisticsModel[]>();
  const [news, setNews] = useState<NewsModel>();
  //const [version, setVersion] = useState<NewsModel>();
  const [versionComboOpen, setVersionComboOpen] = useState<boolean>(false);
  const [sharedNews, setSharedNews] = useState<NewsModel[]>();
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
    getNewsById,
    getSharedByNewsId
  } = useServices();
  const PAGE_SIZE = 5;

  const getGenerals = () => {
    getGeneralStatistics(id as unknown as number).then((r: any) => {
      const _statistics: NewsStatistics = r?.data;
      setStatistics(_statistics);
    });
  };

  const getHits = (page: number) => {
    getStatisticByNews(id, page, PAGE_SIZE)
      .then((res: any) => {
        setHits(res.data);
        setPageStatus({ currentPage: page, pages: res.pages });
      })
      .catch(console.error);
  };

  const getGroupedHits = () => {
    getGroupedStatisticsByNews(id, 'location.name')
      .then((res: any) => {
        setGroupedHits(res.data);
      })
      .catch(console.error);
  };

  const getChartHits = () => {
    getGroupedStatisticsByNews(id, 'statistics.createdAt')
      .then((res: any) => {
        setChartHits(res.data);
      })
      .catch(console.error);
  };

  const getSharedNews = () => {
    getSharedByNewsId(originalId.current)
      .then((res: any) => {
        setSharedNews(res.data);
      })
      .catch(console.error);
  };

  const getCurrentNews = () => {
    getNewsById(id as unknown as number, ViewerSurceEnum.DRAFT).then(
      (r: any) => {
        const news: NewsModel = id
          ? /*{
          ...r?.data.news,
          components: r?.data.components
        }*/ r?.data
          : getEmptyNews(currentUser, id);
        setNews(news);
      }
    );
  };

  const handleChangeTab = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const handleChangeHitsPage = (page: number) => {
    const newPage = Math.max(Math.min(page, pageStatus.pages), 0);
    getHits(newPage);
  };

  const handleChangeVersion = (
    event: SelectChangeEvent<string[]>,
    child: ReactNode
  ) => {
    if (event.target.value == 'share') {
      setUsersDialogOpened(true);
      return;
    }

    //setVersion(sharedNews?.find(news => news.id == event.target.value));
    setId(event.target.value as string);
  };

  const handleUpdateNews = (_news?: NewsModel) => {
    if (_news) {
      if (!news?.id && _news.id != news?.id) {
        originalId.current = _news.id;
      }
      setNews(_news);
      setId(_news.id);
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
    originalId.current == id && !sharedNews?.length && getSharedNews();
  };

  useEffect(() => {
    id && loadServices();
  }, [id]);

  const itemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    whiteSpace: 'nowrap',
    justifyContent: 'center'
  };

  const showVersionCombobox =
    ((originalId.current && !news?.holderUserId && sharedNews) ||
      (originalId.current != id && sharedNews)) &&
    currentUser;
  return (
    <>
      <div className={style['news-details-page']}>
        <div className={style['header']}>
          <div>
            <h2>
              <Link to="../news">News</Link>
              <label>/</label>
              <label>{originalId.current ?? 'Compose News'}</label>
              {showVersionCombobox && <label>/</label>}
              <div className={style['select-wrapper']}>
                {news && (
                  <>
                    {showVersionCombobox && (
                      <FormControl className={style['mui-form-control']}>
                        <Select
                          open={versionComboOpen}
                          defaultValue={[originalId.current as string]}
                          onChange={handleChangeVersion}
                          onClose={() => setVersionComboOpen(false)}
                          onOpen={() => setVersionComboOpen(true)}
                          IconComponent={props => (
                            <label
                              className={style['dropdown-icon']}
                              onClick={() =>
                                setVersionComboOpen(!versionComboOpen)
                              }
                            >
                              {versionComboOpen ? '▲' : '▼'}
                            </label>
                          )}
                          renderValue={selected => {
                            return (
                              <div
                                className={style['selected-version-renderer']}
                              >
                                {
                                  (
                                    (news.holderUserId
                                      ? news.holderUser
                                      : news.user) as UserModel
                                  )?.username
                                }
                              </div>
                            );
                          }}
                        >
                          {
                            <MenuItem key="myOwn" value={originalId.current}>
                              <div style={itemStyle}>
                                <Avatar user={currentUser} size={30} />
                                <ListItemText
                                  disableTypography
                                  primary={
                                    <Typography style={{ fontWeight: 'bold' }}>
                                      {currentUser.username} (mine)
                                    </Typography>
                                  }
                                  style={{ fontWeight: 'bold' }}
                                />
                              </div>
                            </MenuItem>
                          }
                          {sharedNews.map(news => {
                            return (
                              (news.holderUser ||
                                news.id == originalId.current) && (
                                <MenuItem key={news.id} value={news.id}>
                                  <div style={itemStyle}>
                                    <Avatar
                                      user={
                                        (news.holderUserId
                                          ? news.holderUser
                                          : news.user) as UserModel
                                      }
                                      size={30}
                                    />
                                    <ListItemText
                                      primary={
                                        (
                                          (news.holderUserId
                                            ? news.holderUser
                                            : news.user) as UserModel
                                        )?.username
                                      }
                                    />
                                  </div>
                                </MenuItem>
                              )
                            );
                          })}
                          <hr data-combo-divisor />
                          <MenuItem
                            key={'share'}
                            value={'share'}
                            onClick={() => setUsersDialogOpened(true)}
                          >
                            <div style={itemStyle}>
                              <ListItemText primary={'Share'} />
                            </div>
                          </MenuItem>
                        </Select>
                      </FormControl>
                    )}
                  </>
                )}
              </div>
            </h2>
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
        news={news}
        onClose={() => setUsersDialogOpened(false)}
      />
    </>
  );
};
