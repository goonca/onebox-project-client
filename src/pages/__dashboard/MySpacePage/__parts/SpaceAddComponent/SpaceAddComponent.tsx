import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import style from './SpaceAddComponent.module.scss';

type SpaceAddComponentProps = {
  type?: string;
};

export const SpaceAddComponent: React.FC<SpaceAddComponentProps> = (
  props?: SpaceAddComponentProps
) => {
  return (
    <>
      <div className={style['add-component']}>
        <FontAwesomeIcon icon={faPlus} />
      </div>
    </>
  );
};
