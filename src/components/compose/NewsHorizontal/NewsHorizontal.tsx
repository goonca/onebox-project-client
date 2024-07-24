import { Badge } from 'components/compose/Badge';
import { Figure } from 'components/compose/Figure';
import { NewsCoverType } from 'shared/types';
import { BadgeTypeEnum, TextStyleEnum } from 'shared/types/api-type';

import style from './NewsHorizontal.module.scss';

const NewsHorizontal = (props: NewsCoverType) => {
  let titleStyle: React.CSSProperties =
    props.news?.section && props.customDisplay?.badgeType === BadgeTypeEnum.LINE
      ? {
          borderLeft: '5px solid ' + props.news?.section?.primaryColor,
          paddingLeft: '5px'
        }
      : {};

  titleStyle = {
    ...titleStyle,
    ...(props.customDisplay?.titleStyle
      ? { fontSize: (TextStyleEnum as any)[props.customDisplay?.titleStyle] }
      : {})
  };

  const headlineStyle = {
    ...(props.customDisplay?.headlineStyle
      ? { fontSize: (TextStyleEnum as any)[props.customDisplay?.headlineStyle] }
      : {})
  };

  const titleCrop = !!props.customDisplay?.titleCrop
    ? props.customDisplay?.titleCrop
    : 9999;

  const headlineCrop = !!props.customDisplay?.headlineCrop
    ? props.customDisplay?.headlineCrop
    : 9999;

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
          <Figure $key={props.news?.cover} width={100}></Figure>
        )}
        <div className={style['wrapper']}>
          <div className={style['content']}>
            {props.news?.section &&
              props.customDisplay?.badgeType !== BadgeTypeEnum.LINE &&
              props.customDisplay?.badgeType !== BadgeTypeEnum.HIDDEN && (
                <Badge section={props.news?.section}></Badge>
              )}
            <h2 style={titleStyle}>
              {props.news?.title?.substring(0, titleCrop)}
              {props.customDisplay?.titleCrop &&
                props.news?.title?.length &&
                props.news?.title?.length > titleCrop &&
                '...'}
            </h2>
            {!!props.customDisplay?.showHeadline && props.news?.headline && (
              <h3 style={headlineStyle}>
                {props.news?.headline?.substring(0, headlineCrop)}
                {props.customDisplay?.headlineCrop &&
                  props.news?.headline?.length &&
                  props.news?.headline?.length > headlineCrop &&
                  '...'}
              </h3>
            )}
          </div>
        </div>
      </article>
    </>
  );
};

export default NewsHorizontal;
