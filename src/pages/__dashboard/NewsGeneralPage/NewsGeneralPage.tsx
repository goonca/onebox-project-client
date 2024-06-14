import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Link } from '@mui/material';
import {
  NewsStatistics,
  NewsStatus,
  StatisticsModel
} from 'shared/types/api-type';
import { useMoment } from 'shared/hooks/useMoment';
import style from './NewsGeneralPage.module.scss';
import { useServices } from 'shared/hooks/useServices';
import { useEffect, useState } from 'react';
import { hostname } from 'os';

export type NewsGeneralPageProps = {
  statistics: NewsStatistics;
  hits?: StatisticsModel[];
};

export const NewsGeneralPage: React.FC<NewsGeneralPageProps> = (
  props: NewsGeneralPageProps
) => {
  const { toDateTimeString, twoLinesDate } = useMoment();
  const [hits, setHits] = useState<StatisticsModel[]>();

  useEffect(() => {
    setHits(props.hits);
  }, [props.hits]);
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
        <div className={style['info-block']}>
          <Alert severity="info" color="info">
            <strong>This news is not published yet.</strong>
            <br />
            Publish it to start seeing it's props.statistics.
          </Alert>
        </div>
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
        <div
          className={`${style['viewers-block']} ${style['content']} ${style['content-box']}`}
        >
          <div className={style['map']}>
            <h1>Statistics</h1>
          </div>
          <div className={style['list']}>
            <h1>Last viewers</h1>
            <table>
              <thead>
                <tr>
                  <th></th>
                  <th>location</th>
                  <th>viewing time</th>
                  <th>ip</th>
                  <th>date</th>
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
                      <td>{hit.viewerTime}s</td>
                      <td>{hit.clientIp}</td>
                      <td>{twoLinesDate(hit.createdAt).join(' ')}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};
