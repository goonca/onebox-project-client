import { Badge } from 'components/compose/Badge';
import { Figure } from 'components/compose/Figure';
import { NewsCoverType } from 'shared/types';

import style from './NewsVertical.module.scss';

const NewsVertical = (props: NewsCoverType) => {
  const titleStyle =
    props.badge && props.badgeType === 'titled'
      ? {
          borderLeft: '5px solid ' + props.badge.color,
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
        {props.figure && <Figure {...props.figure} width={100}></Figure>}
        <a style={titleStyle}>{props.title}</a>
        {props.badge && props.badgeType !== 'titled' && (
          <Badge {...props.badge}></Badge>
        )}
      </article>
    </>
  );
};

export default NewsVertical;
