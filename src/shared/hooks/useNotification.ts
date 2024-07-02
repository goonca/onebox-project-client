import {
  NewsModel,
  NotificationModel,
  NotificationType
} from 'shared/types/api-type';
import { renderToString } from 'react-dom/server';

type UseNotificationProps = {
  template: ITemplateRecord;
  getTemplateHTML: (content: string, notification: NotificationModel) => string;
};

interface ITemplateRecord {
  [key: string]: TemplateRecord;
}

type TemplateRecord = {
  shortTitle: string;
  title: string;
  content?: string;
};

export const useNotification = (): UseNotificationProps => {
  const newsCard = (news: NewsModel) => {
    return `
    <div style="width:100%;max-width:400px;box-shadow: 0px 1px 2px gray;border-radius:5px;letter-spacing: initial;">
      <img
        style="width:100%;border-radius:5px 5px 0 0;max-height:200px;object-fit:cover"
        src="${`${process.env.NEXT_PUBLIC_APP_BASE_URL}/files/${news.cover}`}"/>
      <div style="padding:5px 5px 10px 10px;text-align:left">
        <h2 style="margin:0;font-family: 'Source Sans Pro', sans-serif;font-weight:500">${
          news.title
        }</h2>
        <p style="margin:0; color:gray;font-size:14px">${news.headline}</p>
        <div style="margin-top:20px;display:flex;align-items:center;width: fit-content; ">
          <a
          style="color:rgb(25, 118, 210);text-decoration:none;font-size:12px"
          onclick="history.pushState({}, '', '/dashboard/news/compose/${
            news.id
          }');window.dispatchEvent(new Event('popstate'))">
            OPEN
          </a>
          <hr style="height:15px;width:1px;border:0;border-left:1px solid lightgray;margin:0 10px"/> 
          <a
            style="color:rgb(25, 118, 210);text-decoration:none;font-size:12px"
            href="${document.location.origin}/viewer/${news.id}" 
            target="newsdraft_${news.id}">
            VIEW DRAFT
          </a>
          ${
            news.publishedUrl
              ? `<hr style="height:15px;width:1px;border:0;border-left:1px solid lightgray;margin:0 10px"/><a
            style="color:rgb(25, 118, 210);text-decoration:none;font-size:12px"
            href="${document.location.origin}/news/${news.publishedUrl}" 
            target="newsviewer_${news.id}">
            VIEW PUBLISHED
            </a>`
              : ''
          }
        </div>
      </div>
    </div>`;
  };

  const template: ITemplateRecord = {
    [NotificationType.NEWS_SHARED]: {
      shortTitle: 'shared a news',
      title: 'Shared a news with you',
      content: `
        <h4>%user%</h4>
        Shared a news
        <br/><br/><br/><br/>
        <div style="display:flex;justify-content:center">
          %newsCard%
        </div>

        `
    },
    [NotificationType.NEWS_VIEWED]: {
      shortTitle: 'viewed a news you shared',
      title: 'Viewed a news you shared with',
      content: `
        <h4>%user%</h4>
        Viewed your news
        <br/><br/><br/><br/>
        <div style="display:flex;justify-content:center">
          %newsCard%
        </div>

        `
    },
    [NotificationType.NEWS_PUBLISHED]: {
      shortTitle: 'published a news you shared',
      title: 'Published a news you shared with',
      content: `
        <h4>%user%</h4>
        Published your news at
        <br/>
        <a
          style="color:rgb(25, 118, 210);text-decoration:none;font-size:14px"
          href="${document.location.origin + '/news/%publishedUrl%'}">
            ${document.location.origin + '/news/%publishedUrl%'}
        </a>
        <br/><br/><br/>
        You can now see it's statistics
        <a
        style="color:rgb(25, 118, 210);text-decoration:none"
        onclick="history.pushState({}, '', '/dashboard/news/compose/%newsId%');window.dispatchEvent(new Event('popstate'))">
          here
        </a>
        <br/>
        <br/><br/><br/>
        <div style="display:flex;justify-content:center">
          %newsCard%
        </div>

        `
    },
    [NotificationType.NEWS_UNPUBLISHED]: {
      shortTitle: 'unpublished a news you shared',
      title: 'Unpublished a news you shared with'
    },
    [NotificationType.NEWS_UPDATED]: {
      shortTitle: 'updated a shared news with you',
      title: 'Updated a shared news with you',
      content: `
        <h4>%user%</h4>
        Updated a news that is shared with you
        <br/>
        Check the changes and publish it again
        <br/><br/><br/><br/>
        <div style="display:flex;justify-content:center">
          %newsCard%
        </div>

        `
    }
  };

  const getTemplateHTML = (
    content: string,
    notification: NotificationModel
  ) => {
    const card = newsCard(notification.news as NewsModel);
    content = content
      .replace(/%user%/g, '@' + notification.fromUser?.username ?? '')
      .replace(/%publishedUrl%/g, notification.news?.publishedUrl ?? '')
      .replace(/%newsCard%/g, card)
      .replace(/%newsId%/g, notification.newsId?.toString() ?? '');

    return content;
  };

  return { template, getTemplateHTML };
};
