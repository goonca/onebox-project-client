import { NewsModel, RequestStatus, UserModel } from 'shared/types/api-type';

export type ResponseType = {
  data?: object;
  status?: RequestStatus;
};

export type ServicesType = {
  authenticate: (user: UserModel) => any;
  saveUser: (user: UserModel) => any;
  saveNews: (news: NewsModel) => any;
  getNewsById: (id: number) => any;
  getNews: () => any;
  getFiles: () => any;
  logoff: () => any;
};

enum uri {
  AUTH = 'http://localhost:3002/auth',
  CREATE_USER = 'http://localhost:3002/user',
  SAVE_NEWS = 'http://localhost:3002/news',
  GET_NEWS = 'http://localhost:3002/news',
  GET_FILES = 'http://localhost:3002/files',
  LOGOFF = 'http://localhost:3002/auth/logoff'
}

export const useServices = (): ServicesType => {
  const post = async (url: string, data?: unknown) => {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify(data)
    });
    const content = await rawResponse.json();
    return content;
  };

  const get = async (url: string) => {
    const rawResponse = await fetch(url, {
      method: 'GET',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });
    const content = await rawResponse.json();
    return content;
  };

  const authenticate = async (user: UserModel) => {
    return await post(uri.AUTH, user);
  };

  const saveUser = async (user: UserModel) => {
    return await post(uri.CREATE_USER, user);
  };
  const saveNews = async (news: NewsModel) => {
    return await post(uri.SAVE_NEWS, news);
  };

  const getNewsById = async (id: number) => {
    return await get(`${uri.GET_NEWS}/${id}`);
  };

  const getNews = async () => {
    return await get(uri.GET_NEWS);
  };

  const getFiles = async () => {
    return await get(uri.GET_FILES);
  };

  const logoff = async () => {
    return await post(uri.LOGOFF);
  };

  return {
    authenticate,
    saveUser,
    logoff,
    saveNews,
    getNewsById,
    getNews,
    getFiles
  };
};
