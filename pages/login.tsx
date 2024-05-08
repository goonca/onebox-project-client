import { getCookie } from 'cookies-next';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { useServices } from 'shared/hooks/useServices';
import { PageProps } from 'shared/types/PagePropsType';
import LoginPage from 'src/pages/Login/LoginPage';

export const getServerSideProps = (async ({ req, res }) => {
  const { authenticate } = useServices();
  const authToken = getCookie('authToken', { req, res });
  const response = await authenticate({
    authToken
  });

  const currentUser = response.data;

  /*if (currentUser) {
    return {
      redirect: {
        permanent: false,
        destination: '/dashboard'
      }
    };
  }*/

  return { props: { currentUser } };
}) satisfies GetServerSideProps<{ currentUser: PageProps }>;

const Page = ({
  currentUser
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <LoginPage currentUser={currentUser} />;
};

export default Page;
