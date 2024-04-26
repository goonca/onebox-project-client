import style from './HomePage.module.scss';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';

export type HomePageProps = {
  text: string;
};

export const getServerSideProps = (async ({ req, res }) => {
  return { props: { text: '' } };
}) satisfies GetServerSideProps<HomePageProps>;

function HomePage({
  text
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <>
      <div className={style['homepage']}></div>
    </>
  );
}

export default HomePage;
