import style from './SectionSelector.module.scss';
import { OutlinedInput } from '@mui/material';
import { NewsModel, SectionModel } from 'shared/types/api-type';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { OBResponseType, useServices } from 'shared/hooks/useServices';
import tinycolor from 'tinycolor2';

export type SectionSelectorProps = {
  news: NewsModel;
  onChange: (section: SectionModel) => void;
};

export const SectionSelector: React.FC<SectionSelectorProps> = (
  props: SectionSelectorProps
) => {
  const [news, setNews] = useState<NewsModel>(props.news);
  const [sections, setSections] = useState<SectionModel[]>();
  const allSections = useRef<SectionModel[]>();
  const searchRef = useRef<HTMLInputElement>();
  const { getSections } = useServices();

  useEffect(() => {
    setNews(props.news);
  }, [props]);

  const handleSectionClick = (section: SectionModel) => {
    props.onChange && props.onChange(section);
  };

  const getFilteredSections = () => {
    return allSections.current?.filter(section =>
      !searchRef.current?.value
        ? true
        : section.key
            ?.toLowerCase()
            ?.startsWith(searchRef.current?.value.toLowerCase() as string)
    );
  };

  const handleChangeSearch = () => {
    setSections(getFilteredSections());
  };

  useEffect(() => {
    getSections().then((response: OBResponseType) => {
      allSections.current = response.data;
      setSections(getFilteredSections());
    });
  }, []);

  return (
    <>
      <div className={style['section-selector']}>
        <div className={style['header']}>
          <div>
            <h2>Section</h2>
          </div>
        </div>
        <div>
          <OutlinedInput
            inputRef={searchRef}
            size="small"
            onChange={handleChangeSearch}
            startAdornment={
              <>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                &nbsp;&nbsp;
              </>
            }
          />
        </div>
        <div className={style['wrapper']}>
          {sections &&
            sections.map(section => (
              <div
                key={section.id}
                className={style['tile']}
                onClick={() => handleSectionClick(section)}
              >
                <span
                  className={style['checkbox']}
                  style={{
                    backgroundColor:
                      section.secondaryColor ??
                      tinycolor(section.primaryColor).lighten(40).toString(),
                    borderColor: tinycolor(section.primaryColor)
                      .lighten(0)
                      .toString()
                  }}
                >
                  {news.sectionId == section.id && (
                    <FontAwesomeIcon
                      icon={faCheck}
                      style={{
                        color: tinycolor(section.primaryColor).toString()
                      }}
                    />
                  )}
                </span>
                {section.key}
              </div>
            ))}
        </div>
      </div>
    </>
  );
};
