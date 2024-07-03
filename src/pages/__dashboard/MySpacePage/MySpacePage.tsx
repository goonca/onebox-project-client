import style from './MySpacePage.module.scss';

type MySpacePageProps = {
  type?: string;
};

export const MySpacePage: React.FC<MySpacePageProps> = (
  props?: MySpacePageProps
) => {
  return (
    <>
      <div className={style['myspace-page']}>{props?.type}</div>
    </>
  );
};
