import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import { useServices } from 'shared/hooks/useServices';
import { PageProps } from 'shared/types/PagePropsType';

export const getServerSideProps = (async ({ req, res }) => {
  // Fetch data from external API
  const { authenticate, saveUser } = useServices();
  const response = await authenticate({
    username: 'samuel',
    password: 'data@123'
  });

  const user = response.data;
  console.log(response);
  // Pass data to the page via props
  return { props: { user } };
}) satisfies GetServerSideProps<{ user: PageProps }>;

export default function Page({
  user
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  return (
    <main>
      <p>{JSON.stringify(user)}</p>
    </main>
  );
}
