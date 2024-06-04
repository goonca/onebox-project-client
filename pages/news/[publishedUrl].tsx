import { useRouter } from 'next/router';
import { NewsViewer } from 'pages/__viewer/NewsViewer/NewsViewer';
import { useEffect, useState } from 'react';
import { useLocation } from 'shared/hooks/useLocation';
import { useServices } from 'shared/hooks/useServices';
import { NewsModel, StatisticsType } from 'shared/types/api-type';

const Page = () => {
  const [news, setNews] = useState<NewsModel>();
  const router = useRouter();
  const { getNewsByUrl } = useServices();
  const { publishedUrl } = router.query;
  const { insertStatistic } = useServices();
  const { getClientLocation } = useLocation();

  useEffect(() => {
    !news &&
      getNewsByUrl(publishedUrl as string).then((res: any) => {
        const news: NewsModel = res.data as NewsModel;
        const isValidNews = !!news;
        isValidNews && setNews(news);

        console.log(news);

        news &&
          getClientLocation().then(location => {
            console.log(location);
            insertStatistic({
              type: StatisticsType.NEWS_VIEW,
              clientIp: location.ipLocation?.ip,
              newsId: news.id as number,
              locationGeonameId: location.geoLocation?.geoname_id
            });
          });
      });
  }, [publishedUrl]);
  return <>{news && <NewsViewer news={news} isPublished={true} />}</>;
};

export default Page;
