import { FormControlLabel, FormGroup, Switch, TextField } from '@mui/material';
import style from './HeaderEditor.module.scss';
import { NewsHeaderProps } from 'components/compose/NewsHeader';
import { useRef } from 'react';

type HeaderEditorProps = {
  updateHeader?: (header?: NewsHeaderProps) => void;
  news?: NewsHeaderProps;
};

export const HeaderEditor: React.FC<HeaderEditorProps> = ({
  updateHeader,
  news
}: HeaderEditorProps) => {
  const titleRef = useRef<HTMLInputElement>();
  const headlineRef = useRef<HTMLInputElement>();
  const showAuthorRef = useRef<HTMLInputElement>();
  const showDaterRef = useRef<HTMLInputElement>();

  const _updateHeader = (header?: NewsHeaderProps) => {
    updateHeader &&
      updateHeader({
        title: titleRef.current?.value,
        headline: headlineRef.current?.value,
        showAuthor: showAuthorRef.current?.checked,
        showDate: showDaterRef.current?.checked
      });
  };

  return (
    <>
      <div className={style['header-editor']}>
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
                inputRef={showDaterRef}
                checked={news?.showDate}
                size="small"
                onChange={() => _updateHeader()}
              />
            }
            label="Show date"
          />
        </FormGroup>
      </div>
    </>
  );
};
