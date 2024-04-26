import { Badge, BadgeProps } from 'components/compose/Badge';
import { Figure, FigureProps } from 'components/compose/Figure';
import style from './NewsHorizontal.module.scss';
import { NewsCoverType } from 'shared/types';

const NewsHorizontal = (props: NewsCoverType) => {
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
        data-component="news-horizontal"
        className={`${style['news-horizontal']} ${
          props.showDivider ? style['divided'] : ''
        }`}
        style={props.width ? { width: props.width } : {}}
      >
        {props.figure && <Figure {...props.figure} width="25%"></Figure>}
        <div className={style['wrapper']}>
          <div className={style['content']}>
            {props.badge && props.badgeType !== 'titled' && (
              <Badge {...props.badge}></Badge>
            )}
            <a style={titleStyle}>{props.title}</a>
          </div>
        </div>
      </article>
    </>
  );
};

export default NewsHorizontal;
