import { debounce } from '@mui/material';
import { useRouter } from 'next/router';
import { NewsViewer } from 'pages/__viewer/NewsViewer/NewsViewer';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation } from 'shared/hooks/useLocation';
import { OBResponseType, useServices } from 'shared/hooks/useServices';
import { useTimer } from 'shared/hooks/useTimer';
import {
  NewsModel,
  StatisticsModel,
  StatisticsType
} from 'shared/types/api-type';

declare global {
  interface Window {
    viewerTimeout?: ReturnType<typeof setTimeout>;
  }
}

const Page = () => {
  const [news, setNews] = useState<NewsModel>();
  const router = useRouter();
  const { getNewsByUrl } = useServices();
  const { publishedUrl } = router.query;
  const { insertStatistic, addViewerTime } = useServices();
  const { getClientLocation } = useLocation();
  const { start, diff } = useTimer();
  const statistics = useRef<StatisticsModel>();

  const logViewerTime = () => {
    const viewerTime =
      (statistics.current?.viewerTime ?? 0) + Math.round(diff());

    console.log(
      statistics.current?.viewerTime ?? 0,
      Math.round(diff()),
      viewerTime
    );

    addViewerTime(statistics.current?.id as number, viewerTime).then(res => {
      //console.log('added!');
      if (window.viewerTimeout) {
        clearTimeout(window.viewerTimeout);
        window.viewerTimeout = setTimeout(logViewerTime, 5000);
      }
    });
  };

  const startTimer = useCallback(
    debounce(() => {
      //console.log('startTimer');
      window.removeEventListener('focus', startTimer);
      window.removeEventListener('blur', stopTimer);
      window.removeEventListener('beforeunload', stopTimer);
      window.addEventListener('focus', startTimer);
      window.addEventListener('blur', stopTimer);
      window.addEventListener('beforeunload', stopTimer);

      start();

      clearTimeout(window.viewerTimeout);
      window.viewerTimeout = setTimeout(logViewerTime, 5000);
    }, 500),
    []
  );

  const stopTimer = useCallback(
    debounce(() => {
      //console.log('stopTimer');
      logViewerTime();

      const viewerTime =
        (statistics.current?.viewerTime ?? 0) + Math.round(diff());
      statistics.current = { ...statistics.current, viewerTime };

      clearTimeout(window.viewerTimeout);
      window.viewerTimeout = undefined;
    }, 500),
    []
  );

  useEffect(() => {
    !news &&
      getNewsByUrl(publishedUrl as string).then((res: any) => {
        const news: NewsModel = res.data as NewsModel;
        const isValidNews = !!news;
        isValidNews && setNews(news);

        if (news) {
          getClientLocation().then(location => {
            console.log(location);
            insertStatistic({
              type: StatisticsType.NEWS_VIEW,
              clientIp: location.ipLocation?.ip,
              newsId: news.id as number,
              locationGeonameId: location.geoLocation?.geoname_id
            }).then((response: OBResponseType) => {
              statistics.current = response.data[0];
              startTimer();

              console.log(statistics);
            });
          });
        }
      });
  }, [publishedUrl]);
  return <>{news && <NewsViewer news={news} isPublished={true} />}</>;
};

export default Page;
