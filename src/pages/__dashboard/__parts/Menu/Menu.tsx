import style from './Menu.module.scss';
import { MenuButton } from '../MenuButton/MenuButton';
import {
  faHouse,
  faImages,
  faNewspaper,
  faUser
} from '@fortawesome/free-solid-svg-icons';

export const Menu = () => {
  return (
    <>
      <div className={style['menu']}>
        <div className={style['top']}>
          <label>ONEBOX</label>
        </div>
        <MenuButton label="Home" icon={faHouse} />
        <MenuButton
          label="Profile"
          icon={faUser}
          path="profile"
          selected={true}
        />
        <MenuButton label="News" icon={faNewspaper} path="news" />
        <MenuButton label="Files" icon={faImages} path="news" />
      </div>
    </>
  );
};
