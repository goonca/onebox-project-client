import { useRouter } from 'next/router';
import { NewsViewer } from 'pages/__viewer/NewsViewer/NewsViewer';
import { useEffect, useState } from 'react';
import { useServices } from 'shared/hooks/useServices';
import { NewsModel } from 'shared/types/api-type';

const Page = () => {
  const [news, setNews] = useState<NewsModel>();
  const router = useRouter();
  const { getNewsByUrl } = useServices();
  const { publishedUrl } = router.query;

  useEffect(() => {
    !news &&
      getNewsByUrl(publishedUrl as string).then((res: any) => {
        const isValidNews = !!res.data;
        isValidNews && setNews(res.data);
      });
  }, [publishedUrl]);
  return <>{news && <NewsViewer news={news} isPublished={true} />}</>;
};

export default Page;
