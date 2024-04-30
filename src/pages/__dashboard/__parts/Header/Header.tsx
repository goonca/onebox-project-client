import { useContext } from 'react';
import style from './Header.module.scss';
import { UserContext } from 'shared/context/UserContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

export const Header = () => {
  const currentUser = useContext(UserContext);
  return (
    <>
      <div className={style['header']}>
        <label>{currentUser?.username}</label>
        <div className={style['cover']}>
          <FontAwesomeIcon icon={faUser} />
        </div>
      </div>
    </>
  );
};
