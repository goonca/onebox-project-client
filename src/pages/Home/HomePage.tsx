import {
  faClock,
  faScrewdriverWrench
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import { useState } from 'react';
import { PageProps } from 'shared/types/PagePropsType';

import style from './HomePage.module.scss';

const HomePage: React.FC<PageProps> = ({ currentUser }: PageProps) => {
  const [user, setUser] = useState(currentUser);

  const goToLogin = () => {
    document.location.href = '/login';
  };
  return (
    <>
      <div className={style['homepage']}>
        <img
          src="/static/onebox-complete-logo-light.svg"
          height={20}
          className={style['logo']}
        />
        <div className={style['header']}>
          <div className={style['left-side']}>
            <div className={style['wrapper']}>
              <h1>Have your own news space</h1>
              <p>
                Onebox is a platform that empowers individuals and businesses to
                create their own news space without requiring any technical
                knowledge.
              </p>
              <Button data-dark variant="contained" onClick={goToLogin}>
                my space
              </Button>
            </div>
          </div>
          <div className={style['right-side']}>
            <img src="/static/oneboxdraw.png" />
          </div>
        </div>
        <div className={style['section-2']}>
          <p>
            Using Onebox build platform offers numerous benefits that make it a
            compelling choice for creating your online presence as a journalist.
            It is a user-friendly, powerfull tool to design and launch
            high-quality web news effortlessly.
          </p>
          <Button variant="contained">create my space</Button>
          <h2>
            A <span>delightful experience</span> for you and your readers
          </h2>
          <div className={style['wrapper']}>
            <div className={style['box']}>
              <h4>
                <FontAwesomeIcon icon={faClock} />
                Timeless aesthetics
              </h4>
              <p>
                Build beautiful UIs with ease. Start with Onebox to create your
                own sophisticated news space.
              </p>
            </div>
            <div className={style['box']}>
              <h4>
                <FontAwesomeIcon icon={faScrewdriverWrench} />
                Intuitive customization
              </h4>
              <p>
                Our components are as flexible as they are powerful. You always
                have full control over how they look and behave.
              </p>
            </div>
          </div>
        </div>
        <div className={style['section-3']}>
          <p>Join the community</p>
          <p>Start building your space and getting your readers</p>
          <Button variant="contained">join</Button>
        </div>
        <div className={style['footer']}>
          <p>© Onebox 2024</p>
        </div>
      </div>
    </>
  );
};

export default HomePage;
