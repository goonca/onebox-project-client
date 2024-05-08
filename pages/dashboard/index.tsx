import { getCookie } from 'cookies-next';
//import { StartPage } from 'src/pages/__dashboard/StartPage/StartPage';
import dynamic from 'next/dynamic';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { useServices } from 'shared/hooks/useServices';
import { PageProps } from 'shared/types/PagePropsType';

const StartPage = dynamic<PageProps>(
  () =>
    import('src/pages/__dashboard/StartPage/StartPage').then(
      mod => mod.StartPage
    ),
  { ssr: false }
);

export const getServerSideProps = (async ({ req, res }) => {
  const { authenticate } = useServices();
  const authToken = getCookie('authToken', { req, res });
  const response = await authenticate({
    authToken
  });

  const currentUser = response.data;

  if (!currentUser) {
    return {
      redirect: {
        permanent: false,
        destination: '/login'
      }
    };
  }

  return { props: { currentUser } };
}) satisfies GetServerSideProps<{ currentUser: PageProps }>;

const Page = ({
  currentUser
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <StartPage currentUser={currentUser} />;
};

export default Page;
