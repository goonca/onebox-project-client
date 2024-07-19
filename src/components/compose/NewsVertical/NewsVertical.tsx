import { Badge } from 'components/compose/Badge';
import { Figure } from 'components/compose/Figure';
import { useEffect } from 'react';
import { NewsCoverType } from 'shared/types';
import { BadgeTypeEnum, TextStyleEnum } from 'shared/types/api-type';

import style from './NewsVertical.module.scss';

const NewsVertical = (props: NewsCoverType) => {
  let titleStyle =
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
        <h2 style={titleStyle}>
          {props.news?.title?.substring(0, props.customDisplay?.titleCrop)}
          {props.customDisplay?.titleCrop &&
            props.news?.title?.length &&
            props.news?.title?.length > props.customDisplay?.titleCrop &&
            '...'}
        </h2>
        {!!props.customDisplay?.showHeadline && props.news?.headline && (
          <h3 style={headlineStyle}>
            {props.news?.headline?.substring(
              0,
              props.customDisplay?.headlineCrop
            )}
            {props.customDisplay?.headlineCrop &&
              props.news?.headline?.length &&
              props.news?.headline?.length >
                props.customDisplay?.headlineCrop &&
              '...'}
          </h3>
        )}
        {props.news?.section &&
          props.customDisplay?.badgeType !== BadgeTypeEnum.LINE &&
          props.customDisplay?.badgeType !== BadgeTypeEnum.HIDDEN && (
            <Badge section={props.news?.section}></Badge>
          )}
      </article>
    </>
  );
};

export default NewsVertical;
