import { faArrowUpRightFromSquare } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Alert, Link } from '@mui/material';
import { NewsStatistics } from 'shared/types/api-type';
import style from './NewsGeneralPage.module.scss';

export type NewsGeneralPageProps = {
  statistics: NewsStatistics;
};

export const NewsGeneralPage: React.FC<NewsGeneralPageProps> = ({
  statistics
}: NewsGeneralPageProps) => {
  return (
    <>
      <div className={style['news-general-page']}>
        <h1>{statistics.news.title}</h1>
        {statistics.news.publishedUrl && (
          <span className={style['header-published-icon']}>
            <Link
              href={
                document.location.origin +
                '/news/' +
                statistics.news.publishedUrl
              }
              target="_blank"
            >
              {document.location.origin}/news/{statistics.news.publishedUrl}{' '}
              &nbsp;
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
            </Link>
          </span>
        )}
        <div className={style['info-block']}>
          <Alert severity="info" color="info">
            <strong>This news is not published yet.</strong>
            <br />
            Publish it to start seeing it's statistics.
          </Alert>
        </div>
        <div className={style['top-block']}>
          <div className={`${style['content']} ${style['content-box']}`}>
            <label>Total views</label>
            <h1>{statistics.totalViewers}</h1>
          </div>
          <div className={`${style['content']} ${style['content-box']}`}>
            <label>Unique viewers</label>
            <h1>{statistics.uniqueViewers}</h1>
          </div>
          <div className={`${style['content']} ${style['content-box']}`}>
            <label>Average viewing time</label>
            <h1>{statistics.avgViewingTime}s</h1>
          </div>
          <div
            className={`${style['content']} ${style['content-box']} ${style['news-content']}`}
          >
            <label>Average viewing time</label>
            <h1>{statistics.avgViewingTime}s</h1>
          </div>
        </div>
      </div>
    </>
  );
};
