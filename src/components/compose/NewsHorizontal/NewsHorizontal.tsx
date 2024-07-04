import { Badge } from 'components/compose/Badge';
import { Figure } from 'components/compose/Figure';
import { NewsCoverType } from 'shared/types';

import style from './NewsHorizontal.module.scss';

const NewsHorizontal = (props: NewsCoverType) => {
  const titleStyle =
    props.news?.section && props.badgeType === 'titled'
      ? {
          borderLeft: '5px solid ' + props.news?.section?.primaryColor,
          paddingLeft: '5px'
        }
      : {};

  return (
    <>
      <article
        data-component="news-horizontal"
        className={`${style['news-horizontal']} ${
          props.showDivider ? style['divided'] : ''
        }`}
        style={props.width ? { width: props.width } : {}}
      >
        {props.news?.cover && (
          <Figure $key={props.news?.cover} width={25}></Figure>
        )}
        <div className={style['wrapper']}>
          <div className={style['content']}>
            {props.news?.section && props.badgeType !== 'titled' && (
              <Badge {...props.news?.section}></Badge>
            )}
            <a href="#" style={titleStyle}>
              {props.news?.title}
            </a>
          </div>
        </div>
      </article>
    </>
  );
};

export default NewsHorizontal;
