import style from './GenericPage.module.scss';

type GenericPageProps = {
  type: string;
};

export const GenericPage: React.FC<GenericPageProps> = (
  props?: GenericPageProps
) => {
  return (
    <>
      <div className={style['generic-page']}>{props?.type}</div>
    </>
  );
};
