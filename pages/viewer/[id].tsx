import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next/types';
import { NewsViewer } from 'pages/__viewer/NewsViewer/NewsViewer';
import { useEffect, useState } from 'react';
import { useServices } from 'shared/hooks/useServices';
import { NewsModel, ViewerSurceEnum } from 'shared/types/api-type';
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
  const [news, setNews] = useState<NewsModel>();
  const router = useRouter();
  const { getNewsById } = useServices();
  const { id } = router.query;

  useEffect(() => {
    getNewsById(id as unknown as number, ViewerSurceEnum.DRAFT).then(
      (res: any) => {
        const isValidNews = !!res.data;
        isValidNews && setNews(res.data);
      }
    );
  }, []);
  return <>{news && <NewsViewer news={news} />}</>;
};

export default Page;
