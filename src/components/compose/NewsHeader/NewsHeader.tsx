import style from './NewsHeader.module.scss';
import { NewsModel } from 'shared/types/api-type';

export type NewsHeaderProps = NewsModel & {
  showAuthor?: false;
};

export const NewsHeader = (props: NewsHeaderProps) => {
  return (
    <>
      <header className={style['news-header']} data-component="news-header">
        <h1 className={style.bagde}>{props.title}</h1>
        {props.headline && <p>{props.headline}</p>}
        <div>
          {props.author && (
            <address>
              By
              <a rel="author" href={props.author.profileUrl}>
                {props.author.name ?? props.author.username}
              </a>
            </address>
          )}
          {props.date && (
            <time
              dateTime={props.date.toLocaleDateString()}
              title={props.date.toDateString()}
            >
              {props.date.toLocaleString()}
            </time>
          )}
        </div>
      </header>
    </>
  );
};
