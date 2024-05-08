import type { GetServerSideProps } from 'next';

import style from './HomePage.module.scss';

export type HomePageProps = {
  text: string;
};

export const getServerSideProps = (async () => {
  return { props: { text: '' } };
}) satisfies GetServerSideProps<HomePageProps>;

function HomePage(/*{
  text
}: InferGetServerSidePropsType<typeof getServerSideProps>*/) {
  return (
    <>
      <div className={style['homepage']}></div>
    </>
  );
}

export default HomePage;
