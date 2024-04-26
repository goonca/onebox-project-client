import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { useServices } from 'shared/hooks/useServices';
import { PageProps } from 'shared/types/PagePropsType';
import LoginPage from 'src/pages/Login/LoginPage';

export const getServerSideProps = (async ({ req, res }) => {
  // Fetch data from external API
  const { authenticate } = useServices();
  const response = await authenticate({
    username: 'samuel',
    password: 'data@123'
  });

  const currentUser = response.data;
  return { props: { currentUser } };
}) satisfies GetServerSideProps<{ currentUser: PageProps }>;

const Page = ({
  currentUser
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return <LoginPage currentUser={currentUser} />;
};

export default Page;
