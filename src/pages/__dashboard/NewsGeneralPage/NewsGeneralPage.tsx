import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Link } from '@mui/material';
import {
  LocationModel,
  NewsStatistics,
  NewsStatus,
  StatisticsModel
} from 'shared/types/api-type';
import { useMoment } from 'shared/hooks/useMoment';
import style from './NewsGeneralPage.module.scss';
import { useEffect, useState } from 'react';
import { StatisticsMap } from './__parts/StatisticsMap/StatisticsMap';
import Chart from 'chart.js/auto';
import { CategoryScale } from 'chart.js';
import { Line } from 'react-chartjs-2';

export type NewsGeneralPageProps = {
  statistics: NewsStatistics;
  hits?: StatisticsModel[];
  groupedHits?: GroupedHit[];
  chartHits?: ChartHit[];
  pageStatus?: PageStatus;
  onPageChange?: (page: number) => void;
};

export type PageStatus = {
  currentPage: number;
  pages: number;
};

export type GroupedHit = {
  hits: number;
  location: LocationModel;
};

export type ChartHit = {
  hits: number;
  distinctHits: number;
  date: string;
};

export const NewsGeneralPage: React.FC<NewsGeneralPageProps> = (
  props: NewsGeneralPageProps
) => {
  const { toDateTimeString, twoLinesDate, toDateString } = useMoment();
  const [hits, setHits] = useState<StatisticsModel[]>();
  /*const [groupedHits, setGroupedHits] = useState<GroupedHits[]>();
  const [chartHits, setChartHits] = useState<GroupedHits[]>();*/
  const [pageStatus, setPageStatus] = useState<PageStatus>(
    props.pageStatus ?? {
      currentPage: 0,
      pages: 0
    }
  );

  const handleChangePage = (add: boolean) => {
    props.onPageChange &&
      props.onPageChange(pageStatus.currentPage + (add ? +1 : -1));
  };

  useEffect(() => {
    setHits(props.hits);
  }, [props.hits]);

  useEffect(() => {
    props.pageStatus && setPageStatus(props.pageStatus);
  }, [props.pageStatus]);
  /*
  useEffect(() => {
    setGroupedHits(props.groupedHits);
  }, [props.groupedHits]);

  useEffect(() => {
    setChartHits(props.chartHits);
  }, [props.chartHits]);
*/
  //************************ */
  //************************ */
  Chart.register(CategoryScale);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      x: {
        grid: {
          display: false
        }
      },
      y: {
        ticks: {
          maxTicksLimit: 8
        }
      }
    }
  };

  const data = {
    labels: props.chartHits?.map(hit => hit.date),
    datasets: [
      {
        label: 'Unique Views',
        data: props.chartHits?.map(hit => hit.distinctHits),
        fill: false,
        tension: 0.2,
        borderColor: 'rgb(50, 80, 192)',
        backgroundColor: 'white'
      },
      {
        label: 'Total Views',
        data: props.chartHits?.map(hit => hit.hits),
        fill: true,
        tension: 0.1,
        borderDash: [5, 5],
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.3)',
        borderWidth: 0
      }
    ]
  };

  //************************ */
  //************************ */

  return (
    <>
      <div className={style['news-general-page']}>
        <h1>{props.statistics.news.title}</h1>
        {props.statistics.news.publishedUrl && (
          <span className={style['header-published-icon']}>
            <Link
              href={
                document.location.origin +
                '/news/' +
                props.statistics.news.publishedUrl
              }
              target="_blank"
            >
              {document.location.origin}/news/
              {props.statistics.news.publishedUrl} &nbsp;
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
          </span>
        )}

        {!props.statistics.news.publishedUrl && (
          <div className={style['info-block']}>
            <Alert severity="info" color="info">
              <strong>This news is not published yet.</strong>
              <br />
              Publish it to start seeing it's props.statistics.
            </Alert>
          </div>
        )}
        <div className={style['top-block']}>
          <div className={`${style['content']} ${style['content-box']}`}>
            <label>Total views</label>
            <h1>{props.statistics.totalViewers}</h1>
          </div>
          <div className={`${style['content']} ${style['content-box']}`}>
            <label>Unique viewers</label>
            <h1>{props.statistics.uniqueViewers}</h1>
          </div>
          <div className={`${style['content']} ${style['content-box']}`}>
            <label>Average viewing time</label>
            <h1>{props.statistics.avgViewingTime}s</h1>
          </div>
          <div className={`${style['content']} ${style['news-content']}`}>
            <div
              className={`${style['content']} ${style['content-box']} ${style['shared-with']}`}
            >
              <Link>Shared with</Link>
              <div
                style={{
                  width: '25px',
                  height: '25px',
                  backgroundColor: 'gray',
                  borderRadius: '25px',
                  marginTop: '15px',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    marginTop: '2px',
                    color: 'lightgray',
                    textAlign: 'center',
                    fontWeight: '500'
                  }}
                >
                  SG
                </div>
              </div>
            </div>
            <div
              className={`${style['content']} ${style['content-box']}  ${style['other-inf']}`}
            >
              <div>
                <label>Status</label>
                <h1>{NewsStatus[props.statistics.news.status ?? 0]}</h1>
              </div>

              <div>
                <label>Last change</label>
                <h1>{toDateTimeString(props.statistics.news.updatedAt)}</h1>
              </div>
            </div>
          </div>
        </div>
        {props.statistics.news.publishedUrl && (
          <div
            className={`${style['viewers-block']} ${style['content']} ${style['content-box']}`}
          >
            <div className={style['map']}>
              <h1>Statistics</h1>
              <div>
                <StatisticsMap groupedHits={props.groupedHits} />
                <div className={style['grouped-hits']}>
                  {props.groupedHits?.map(hit => {
                    return (
                      <div>
                        {hit.location.name} <span>{hit.hits}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className={style['list']}>
              <h1>Last viewers</h1>
              <table cellSpacing={0}>
                <thead>
                  <tr>
                    <th></th>
                    <th>location</th>
                    <th className={style['text-right']}>time</th>
                    <th>ip</th>
                    <th className={style['text-right']}>date</th>
                  </tr>
                </thead>
                <tbody>
                  {hits &&
                    hits.map(hit => (
                      <tr>
                        <td>
                          <img
                            width={17}
                            src={`https://flagcdn.com/48x36/${hit.location?.country_code?.toLocaleLowerCase()}.png`}
                          />
                        </td>
                        <td>{hit.location?.name}</td>
                        <td className={style['text-right']}>
                          {hit.viewerTime}s
                        </td>
                        <td>{hit.clientIp?.substring(0, 18)}</td>
                        <td className={style['text-right']}>
                          {twoLinesDate(hit.createdAt).map((dt, i) => (
                            <div key={i}>{dt}</div>
                          ))}
                        </td>
                      </tr>
                    ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan={5}>
                      <Link onClick={() => handleChangePage(false)}>≪Prev</Link>
                      &nbsp;&nbsp;page {pageStatus.currentPage + 1}
                      &nbsp;of&nbsp;
                      {pageStatus.pages}&nbsp;&nbsp;
                      <Link onClick={() => handleChangePage(true)}>Next≫</Link>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        )}
        {props.statistics.news.publishedUrl && (
          <div
            className={`${style['chart-block']} ${style['content']} ${style['content-box']}`}
          >
            <h1>Performance (first week)</h1>
            <Line data={data} options={chartOptions} height={80} />
          </div>
        )}
      </div>
    </>
  );
};
