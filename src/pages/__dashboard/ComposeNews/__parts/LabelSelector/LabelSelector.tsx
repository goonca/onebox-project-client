import style from './LabelSelector.module.scss';
import { Autocomplete, Box, OutlinedInput, TextField } from '@mui/material';
import { NewsModel, SectionModel } from 'shared/types/api-type';
import { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { OBResponseType, useServices } from 'shared/hooks/useServices';
import tinycolor from 'tinycolor2';
import { debounce } from 'lodash';

export type LabelSelectorProps = {
  news: NewsModel;
  onChange: (label: { label: string }) => void;
};

export const LabelSelector: React.FC<LabelSelectorProps> = (
  props: LabelSelectorProps
) => {
  const [news, setNews] = useState<NewsModel>(props.news);
  const [labels, setLabels] = useState<{ label: string }[]>();
  const { listLabels } = useServices();

  useEffect(() => {
    setNews(props.news);
  }, [props]);

  const handleChangeLabel = debounce((event: any) => {
    props.onChange && props.onChange({ label: event.target.value });
  }, 1000);

  useEffect(() => {
    listLabels().then(({ data }: OBResponseType) => {
      setLabels(data);
    });
  }, []);

  return (
    <>
      <div className={style['label-selector']}>
        <div className={style['header']}>
          <div>
            <h2>Label</h2>
          </div>
        </div>
        <div className={style['wrapper']}>
          {labels && (
            <Autocomplete
              defaultValue={news.label}
              freeSolo={true}
              autoHighlight
              options={labels.map(l => l.label)}
              renderInput={params => (
                <TextField
                  autoComplete="off"
                  {...params}
                  onChange={handleChangeLabel}
                  size="small"
                  inputProps={{
                    ...params.inputProps,
                    autocomplete: 'new-password',
                    form: {
                      autocomplete: 'off'
                    }
                  }}
                />
              )}
              renderOption={(props, obj) => {
                //@ts-ignore
                const { key, ...optionProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    sx={{
                      '& > img': {
                        mr: 2,
                        flexShrink: 0
                      }
                    }}
                    {...optionProps}
                  >
                    {obj}
                  </Box>
                );
              }}
            />
          )}
        </div>
      </div>
    </>
  );
};
