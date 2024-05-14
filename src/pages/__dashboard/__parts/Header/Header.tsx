import { faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useContext } from 'react';
import { UserContext } from 'shared/context/UserContext';

import style from './Header.module.scss';

export const Header = () => {
  const currentUser = useContext(UserContext);
  return (
    <>
      <div className={style['header']} data-component="header">
        <label>{currentUser?.username}</label>
        <div className={style['cover']}>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
    </>
  );
};
