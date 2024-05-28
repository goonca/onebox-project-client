import { useContext } from 'react';
import { UserContext } from 'shared/context/UserContext';
import {
  LocationModel,
  NewsModel,
  RequestStatus,
  UserModel
} from 'shared/types/api-type';
import { EventType, useEvent } from './useEvent';

export type ResponseType = {
  data?: object;
  status?: RequestStatus;
};

export type UpdatePassword = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export type ServicesType = {
  authenticate: (user: UserModel) => any;
  getClientIp: () => any;
  getLocationByName: (location: LocationModel) => any;
  getLocationNearby: (location: LocationModel) => any;
  getCitiesByName: (name: string) => any;
  saveUser: (user: UserModel) => any;
  updateUser: (user: UserModel, token?: string) => any;
  updatePassword: (data: UpdatePassword) => any;
  saveNews: (news: NewsModel) => any;
  getNewsById: (id: number) => any;
  getNews: () => any;
  getFiles: () => any;
  logoff: () => any;
  deleteFile: (id: number) => any;
  //deleteComponent: (component?: ComponentModel) => any;
};

export const useServices = (): ServicesType => {
  //const { APP_BASE_URL } = useEnvVars();
  const { trigger } = useEvent();
  let currentUser: UserModel | undefined;
  typeof window !== 'undefined' && (currentUser = useContext(UserContext));

  const uri = {
    AUTH: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/auth`,
    USER: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/user`,
    NEWS: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/news`,
    COMPONENT: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/news/components`,
    FILES: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/files`,
    LOCATION: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/location`
  };

  const _fetch = async (
    method: string,
    url: string,
    data?: any,
    token?: string
  ) => {
    const rawResponse = await fetch(url, {
      method: method,
      //@ts-ignore
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        usertoken: token ?? currentUser?.authToken
      },
      credentials: 'include',
      ...(data
        ? {
            body: JSON.stringify(data)
          }
        : {})
    });
    const content = await rawResponse.json();
    trigger(EventType.UPDATE_SNACKBAR, content);
    return content;
  };

  const post = async (url: string, data?: unknown, token?: string) => {
    return await _fetch('POST', url, data, token);
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

  /*const saveLocation = async (location: LocationModel) => {
    Array.isArray(location.alternate_names) &&
      (location.alternate_names = JSON.stringify(location.alternate_names));
    !Array.isArray(location.coordinates) &&
      (location.coordinates = {
        type: 'Point',
        //@ts-ignore
        coordinates: [location.coordinates.lon, location.coordinates.lat]
      });
    return await post(uri.LOCATION, location);
  };*/

  const getClientIp = async () => {
    return await get(uri.LOCATION + '/location/current');
  };

  const getLocationNearby = async (location: LocationModel) => {
    return await post(uri.LOCATION + '/nearby', location);
  };

  const getLocationByName = async (location: LocationModel) => {
    return await post(uri.LOCATION + '/nearby/' + location.name, location);
  };

  const getCitiesByName = async (name: string) => {
    return await get(uri.LOCATION + '/cities/' + name);
  };

  const saveUser = async (user: UserModel) => {
    return await post(uri.USER, user);
  };

  const updateUser = async (user: UserModel, token?: string) => {
    return await post(uri.USER + '/update', user, token);
  };

  const updatePassword = async (data: UpdatePassword) => {
    return await post(uri.USER + '/update/password', data);
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
    updateUser,
    updatePassword,
    getNewsById,
    getNews,
    getFiles,
    deleteFile,
    getLocationNearby,
    getLocationByName,
    getCitiesByName,
    getClientIp
  };
};
