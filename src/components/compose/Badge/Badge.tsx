import { useEffect, useState } from 'react';
import { SectionModel } from 'shared/types/api-type';
import tinycolor from 'tinycolor2';

import style from './Badge.module.scss';

export type BadgeProps = {
  section?: SectionModel;
};

export const Badge: React.FC<BadgeProps> = (props: BadgeProps) => {
  const [section, setSection] = useState(props.section);

  const colors = (_section?: SectionModel) => ({
    color: _section?.primaryColor ?? 'gray',
    backgroundColor:
      _section?.secondaryColor ??
      (_section?.primaryColor
        ? tinycolor(_section?.primaryColor).lighten(43).toString()
        : '#efefef')
  });

  const defaultLabel: string = 'section';

  useEffect(() => {
    setSection(props.section);
  }, [props]);

  return (
    <>
      <label
        data-component="badge"
        className={style['badge']}
        style={colors(section)}
      >
        {section?.name ?? section?.key ?? defaultLabel}
      </label>
    </>
  );
};
