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
  deleteFile: (id: number) => any;
};

export const useServices = (): ServicesType => {
  const uri = {
    AUTH: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth`,
    USER: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/user`,
    NEWS: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/news`,
    FILES: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/files`
  };

  const _fetch = async (method: string, url: string, data?: unknown) => {
    const rawResponse = await fetch(url, {
      method: method,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      ...(data ? { body: JSON.stringify(data) } : {})
    });
    const content = await rawResponse.json();
    return content;
  };

  const post = async (url: string, data?: unknown) => {
    return await _fetch('POST', url, data);
  };

  const get = async (url: string) => {
    return await _fetch('GET', url);
  };

  const remove = async (url: string) => {
    return await _fetch('DELETE', url);
  };

  const authenticate = async (user: UserModel) => {
    return await post(uri.AUTH, user);
  };

  const saveUser = async (user: UserModel) => {
    return await post(uri.USER, user);
  };
  const saveNews = async (news: NewsModel) => {
    return await post(uri.NEWS, news);
  };

  const getNewsById = async (id: number) => {
    return await get(`${uri.NEWS}/${id}`);
  };

  const getNews = async () => {
    return await get(uri.NEWS);
  };

  const getFiles = async () => {
    return await get(uri.FILES);
  };

  const deleteFile = async (id: number) => {
    return await remove(`${uri.FILES}/${id}`);
  };

  const logoff = async () => {
    return await post(`${uri.AUTH}/logoff`);
  };

  return {
    authenticate,
    saveUser,
    logoff,
    saveNews,
    getNewsById,
    getNews,
    getFiles,
    deleteFile
  };
};
