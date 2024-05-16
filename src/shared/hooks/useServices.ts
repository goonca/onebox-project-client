import { useContext } from 'react';
import { UserContext } from 'shared/context/UserContext';
import { NewsModel, RequestStatus, UserModel } from 'shared/types/api-type';
import { useEnvVars } from './useEnvVars';

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
  //deleteComponent: (component?: ComponentModel) => any;
};

export const useServices = (): ServicesType => {
  const { APP_BASE_URL } = useEnvVars();
  let currentUser: UserModel | undefined;
  typeof window !== 'undefined' && (currentUser = useContext(UserContext));

  const uri = {
    AUTH: `${APP_BASE_URL}/auth`,
    USER: `${APP_BASE_URL}/user`,
    NEWS: `${APP_BASE_URL}/news`,
    COMPONENT: `${APP_BASE_URL}/news/components`,
    FILES: `${APP_BASE_URL}/files`
  };

  const _fetch = async (method: string, url: string, data?: any) => {
    const rawResponse = await fetch(url, {
      method: method,
      //@ts-ignore
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        usertoken: currentUser?.authToken
      },
      credentials: 'include',
      ...(data
        ? {
            body: JSON.stringify(data)
          }
        : {})
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

  const remove = async (url: string, data?: any) => {
    return await _fetch('DELETE', url, data);
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

  /*const deleteComponent = async (component?: ComponentModel) => {
    return await remove(uri.COMPONENT, component);
  };*/

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
    //deleteComponent
  };
};
