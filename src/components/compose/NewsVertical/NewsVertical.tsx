import { Badge } from 'components/compose/Badge';
import { Figure } from 'components/compose/Figure';
import { NewsCoverType } from 'shared/types';

import style from './NewsVertical.module.scss';

const NewsVertical = (props: NewsCoverType) => {
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
        data-component="news-vertical"
        className={`${style['news-vertical']} ${
          props.showDivider ? style['divided'] : ''
        }`}
        style={props.width ? { width: props.width } : {}}
      >
        {props.news?.cover && (
          <Figure $key={props.news?.cover} width={100}></Figure>
        )}
        <a style={titleStyle}>{props.news?.title}</a>
        {props.news?.section && props.badgeType !== 'titled' && (
          <Badge section={props.news?.section}></Badge>
        )}
      </article>
    </>
  );
};

export default NewsVertical;
