import { NotificationType } from 'shared/types/api-type';

interface ITemplateRecord {
  [key: string]: TemplateRecord;
}

type TemplateRecord = {
  shortTitle: string;
  title: string;
};

export const useNotification = () => {
  const template: ITemplateRecord = {
    [NotificationType.NEWS_SHARED]: {
      shortTitle: 'shared a news',
      title: 'Shared a news with you'
    },
    [NotificationType.NEWS_VIEWED]: {
      shortTitle: 'viewed a news you shared',
      title: 'Viewed a news you shared with'
    },
    [NotificationType.NEWS_PUBLISHED]: {
      shortTitle: 'published a news you shared',
      title: 'Published a news you shared with'
    },
    [NotificationType.NEWS_UNPUBLISHED]: {
      shortTitle: 'unpublished a news you shared',
      title: 'Unpublished a news you shared with'
    },
    [NotificationType.NEWS_UPDATED]: {
      shortTitle: 'updated a shared news with you',
      title: 'Updated a shared news with you'
    }
  };

  return { template };
};
