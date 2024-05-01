import style from './NewsHeader.module.scss';
import { NewsModel } from 'shared/types/api-type';

export type NewsHeaderProps = NewsModel;

export const NewsHeader = (props: NewsHeaderProps) => {
  return (
    <>
      <header className={style['news-header']} data-component="news-header">
        <h1 className={style.bagde}>{props.title}</h1>
        {props.headline && <p>{props.headline}</p>}
        <div>
          {props.showAuthor && props.user && (
            <address>
              By
              <a rel="author" href={props.user?.profileUrl}>
                {props.user?.name ?? props.user?.username}
              </a>
            </address>
          )}
          {props.showDate && props.createdAt && (
            <time
              dateTime={new Date(props.createdAt).toLocaleDateString()}
              title={new Date(props.createdAt).toDateString()}
            >
              {new Date(props.createdAt).toLocaleString()}
            </time>
          )}
        </div>
      </header>
    </>
  );
};
