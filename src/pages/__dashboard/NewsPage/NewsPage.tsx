import { useContext, useRef } from 'react';
import style from './NewsPage.module.scss';
import { UserContext } from 'shared/context/UserContext';
import { Button, OutlinedInput } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';

export const NewsPage = () => {
  const currentUser = useContext(UserContext);
  const searchRef = useRef<HTMLInputElement>();
  const navigate = useNavigate();
  const compose = () => {
    navigate('/dashboard/news/compose');
  };
  return (
    <>
      <div className={style['news-page']} data-component="news-page">
        <div className={style['header']}>
          <div>
            <h2>News</h2>
          </div>
          <div>
            <Button variant="contained" onClick={() => compose()}>
              Compose
            </Button>
          </div>
        </div>
        <div className={style['search-input']}>
          <OutlinedInput
            inputRef={searchRef}
            startAdornment={
              <>
                &nbsp;&nbsp;
                <FontAwesomeIcon icon={faMagnifyingGlass} />
                &nbsp;&nbsp;
              </>
            }
          />
        </div>
      </div>
    </>
  );
};
