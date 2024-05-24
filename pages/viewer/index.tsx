import { getCookie } from 'cookies-next';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { NewsViewer } from 'pages/__viewer/NewsViewer/NewsViewer';
import { useServices } from 'shared/hooks/useServices';
import { PageProps } from 'shared/types/PagePropsType';

export const getServerSideProps = (async ({ req, res }) => {
  const { authenticate } = useServices();
  const authToken = getCookie('authToken', { req, res });
  const response = await authenticate({
    authToken
  });

  const currentUser = response.data;

  return { props: { currentUser } };
}) satisfies GetServerSideProps<{ currentUser: PageProps }>;

const Page = ({
  currentUser
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <NewsViewer currentUser={currentUser} />
    </>
  );
};

export default Page;
