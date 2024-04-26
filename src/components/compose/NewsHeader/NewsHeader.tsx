import { AuthorType } from 'shared/types';
import style from './NewsHeader.module.scss';

export type NewsHeaderProps = {
  title: string;
  headline?: string;
  author?: AuthorType;
  date?: Date;
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
                {props.author.fullname}
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
