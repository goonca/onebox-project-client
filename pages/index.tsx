import { InferGetServerSidePropsType } from 'next';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import {
  getServerSideProps as fetchHomePageServerSideProps,
  HomePageProps} from 'src/pages/Home/HomePage';

const Homepage = dynamic(import('src/pages/Home/HomePage'));

type IndexProps = {
  homepage: { props: HomePageProps };
};

export const getServerSideProps = async (context: any) => {
  // Fetch data from external API

  const homepage = await fetchHomePageServerSideProps(context);

  const repo: IndexProps = {
    homepage
  };
  // Pass data to the page via props
  return { props: { repo } };
};

export default function Home({
  repo
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <div>
      <Homepage text={repo.homepage.props.text}></Homepage>
      <p>This is our homepage</p>
      <div>
        <a href="/blog">Blog</a>
      </div>
      <div>
        <Link href="/login">login</Link>
      </div>
      <div>
        <Link href="/about">About us</Link>
      </div>
    </div>
  );
}
