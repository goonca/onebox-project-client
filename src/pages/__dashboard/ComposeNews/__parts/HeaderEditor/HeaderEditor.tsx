import { FormControlLabel, FormGroup, Switch, TextField } from '@mui/material';
import { useRef } from 'react';
import { NewsModel } from 'shared/types/api-type';

import style from './HeaderEditor.module.scss';

type HeaderEditorProps = {
  updateHeader?: (header?: NewsModel) => void;
  news?: NewsModel;
};

export const HeaderEditor: React.FC<HeaderEditorProps> = ({
  updateHeader,
  news
}: HeaderEditorProps) => {
  const titleRef = useRef<HTMLInputElement>();
  const headlineRef = useRef<HTMLInputElement>();
  const showAuthorRef = useRef<HTMLInputElement>();
  const showDateRef = useRef<HTMLInputElement>();
  const showSectionRef = useRef<HTMLInputElement>();
  const showContextRef = useRef<HTMLInputElement>();

  const _updateHeader = () => {
    updateHeader &&
      updateHeader({
        title: titleRef.current?.value,
        headline: headlineRef.current?.value,
        showAuthor: showAuthorRef.current?.checked,
        showDate: showDateRef.current?.checked,
        showSection: showSectionRef.current?.checked,
        showContext: showContextRef.current?.checked
      });
  };

  return (
    <>
      <div className={style['header-editor']}>
        <div className={style['header']}>
          <div>
            <h2>Header</h2>
          </div>
        </div>

        <TextField
          inputRef={titleRef}
          label="Title"
          value={news?.title}
          multiline
          maxRows={4}
          onChange={() => _updateHeader()}
        />

        <TextField
          inputRef={headlineRef}
          label="Headline"
          value={news?.headline}
          multiline
          maxRows={4}
          onChange={() => _updateHeader()}
        />
        <FormGroup className={style['switchers']}>
          <FormControlLabel
            control={
              <Switch
                inputRef={showAuthorRef}
                checked={news?.showAuthor}
                size="small"
                onChange={() => _updateHeader()}
              />
            }
            label="Show author"
          />
          <FormControlLabel
            control={
              <Switch
                inputRef={showDateRef}
                checked={news?.showDate}
                size="small"
                onChange={() => _updateHeader()}
              />
            }
            label="Show date"
          />
          <FormControlLabel
            control={
              <Switch
                inputRef={showContextRef}
                checked={news?.showContext}
                size="small"
                onChange={() => _updateHeader()}
              />
            }
            label="Show context"
          />
          <FormControlLabel
            control={
              <Switch
                inputRef={showSectionRef}
                checked={news?.showSection}
                size="small"
                onChange={() => _updateHeader()}
              />
            }
            label="Show section"
          />
        </FormGroup>
      </div>
    </>
  );
};
