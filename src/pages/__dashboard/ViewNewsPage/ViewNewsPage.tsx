import style from './ViewNewsPage.module.scss';

type ViewNewsPageProps = {
  type?: string;
};

export const ViewNewsPage: React.FC<ViewNewsPageProps> = (
  props?: ViewNewsPageProps
) => {
  return (
    <>
      <div className={style['view-news-page']}>{props?.type}</div>
    </>
  );
};
