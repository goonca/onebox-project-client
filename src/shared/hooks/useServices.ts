import { useContext } from 'react';
import { UserContext } from 'shared/context/UserContext';
import {
  IdType,
  LayoutModel,
  LocationModel,
  NewsModel,
  RequestStatus,
  StatisticsModel,
  UserModel,
  ViewerSurceEnum
} from 'shared/types/api-type';
import { EventType, useEvent } from './useEvent';

export type OBResponseType = {
  data?: any;
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
  saveUser: (user: UserModel, feedback?: boolean) => any;
  listUsersByNameOrUsername: (nameOrUsername: string) => any;
  updateUser: (user: UserModel, token?: string, hideFeedback?: boolean) => any;
  updatePassword: (data: UpdatePassword) => any;
  saveNews: (news: NewsModel) => any;
  getNewsById: (id: IdType, source?: ViewerSurceEnum) => any;
  getNewsByUrl: (url: string) => any;
  getNews: () => any;
  getSharedByNewsId: (id: IdType) => any;
  publishNews: (id: IdType) => any;
  shareNews: (id: IdType, holderId: number) => any;
  insertStatistic: (statistics: StatisticsModel) => any;
  addViewerTime: (id: number, time: number) => Promise<any>;
  getStatisticByNews: (id: IdType, page: number, pageSize: number) => any;
  getStatisticByUser: (id: IdType) => any;
  getGroupedStatisticsByNews: (id: IdType, groupBy: string) => any;
  getGeneralStatistics: (id: IdType) => any;
  getFiles: () => any;
  getSections: () => Promise<any>;
  logoff: () => any;
  deleteFile: (id: IdType) => any;
  saveLocation: (location: LocationModel) => any;
  listNotificationByTo: (
    id: IdType,
    pageSize?: number,
    page?: number,
    searchString?: string
  ) => any;
  countUnreadByTo: (id: IdType) => any;
  setNotificationRead: (ids: IdType[]) => any;
  listLayout: () => any;
  saveLayout: (layout: LayoutModel) => any;
  //deleteComponent: (component?: ComponentModel) => any;
};

export type FecthProps = {
  data?: any;
  token?: string;
  hideFeedback?: boolean;
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
    SECTION: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/section`,
    LOCATION: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/location`,
    STATISTICS: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/statistics`,
    NOTIFICATION: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/notification`,
    BLOCK: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/block`,
    LAYOUT: `${process.env.NEXT_PUBLIC_APP_BASE_URL}/layout`
  };

  const _fetch = async (method: string, url: string, props?: FecthProps) => {
    const rawResponse = await fetch(url, {
      method: method,
      //@ts-ignore
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        usertoken: props?.token ?? currentUser?.authToken
      },
      credentials: 'include',
      ...(props?.data
        ? {
            body: JSON.stringify(props?.data)
          }
        : {})
    });
    const content = await rawResponse.json();
    !props?.hideFeedback && trigger(EventType.UPDATE_SNACKBAR, content);
    return content;
  };

  const post = async (
    url: string,
    data?: unknown,
    token?: string,
    hideFeedback?: boolean
  ) => {
    return await _fetch('POST', url, { data, token, hideFeedback });
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

  const saveLocation = async (location: LocationModel) => {
    Array.isArray(location.alternate_names) &&
      (location.alternate_names = JSON.stringify(location.alternate_names));
    !Array.isArray(location.coordinates) &&
      (location.coordinates = {
        type: 'Point',
        //@ts-ignore
        coordinates: [location.coordinates.lon, location.coordinates.lat]
      });
    return await post(uri.LOCATION, location);
  };

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

  const listUsersByNameOrUsername = async (nameOrUsername: string) => {
    return await get(`${uri.USER}?nameOrUsername=${nameOrUsername}`);
  };

  const updateUser = async (
    user: UserModel,
    token?: string,
    hideFeedback?: boolean
  ) => {
    return await post(uri.USER + '/update', user, token, hideFeedback);
  };

  const updatePassword = async (data: UpdatePassword) => {
    return await post(uri.USER + '/update/password', data);
  };

  const saveNews = async (news: NewsModel) => {
    return await post(uri.NEWS, news);
  };

  const publishNews = async (id: IdType) => {
    return await post(`${uri.NEWS}/publish/${id}`);
  };

  const shareNews = async (id: IdType, holderId: number) => {
    return await post(`${uri.NEWS}/share/${id}?holderId=${holderId}`);
  };

  const getNewsById = async (id: IdType, source?: ViewerSurceEnum) => {
    return await get(`${uri.NEWS}/${id}${source ? `?source=${source}` : ''}`);
  };

  const getNewsByUrl = async (url: string) => {
    return await get(`${uri.NEWS}/published/${url}`);
  };

  const getSharedByNewsId = async (id: IdType) => {
    return await get(`${uri.NEWS}/shared/${id}`);
  };

  const getNews = async () => {
    return await get(uri.NEWS);
  };

  const getFiles = async () => {
    return await get(uri.FILES);
  };

  const getSections = async () => {
    return await get(uri.SECTION);
  };

  const deleteFile = async (id: IdType) => {
    return await remove(`${uri.FILES}/${id}`);
  };

  const logoff = async () => {
    return await post(`${uri.AUTH}/logoff`);
  };

  const insertStatistic = async (statistics: StatisticsModel) => {
    return await post(`${uri.STATISTICS}`, statistics);
  };

  const getStatisticByNews = async (
    id: IdType,
    page: number = 0,
    pageSize: number = 99
  ) => {
    return await get(
      `${uri.STATISTICS}/news/${id}?page=${page}&pageSize=${pageSize}`
    );
  };

  const getStatisticByUser = async (id: IdType) => {
    return await get(`${uri.STATISTICS}/user/${id}`);
  };
  const getGeneralStatistics = async (id: IdType) => {
    return await get(`${uri.STATISTICS}/news/${id}/general`);
  };

  const getGroupedStatisticsByNews = async (id: IdType, groupBy: string) => {
    return await get(`${uri.STATISTICS}/news/${id}/grouped/${groupBy}`);
  };

  const addViewerTime = (id: IdType, time: number) => {
    return post(`${uri.STATISTICS}/log/${id}`, { time });
  };

  const listNotificationByTo = async (
    id: IdType,
    pageSize?: number,
    page?: number,
    searchString?: string
  ) => {
    return get(
      `${
        uri.NOTIFICATION
      }/${id}?pageSize=${pageSize}&page=${page}&searchString=${
        searchString ?? ''
      }`
    );
  };

  const countUnreadByTo = async (id: IdType) => {
    return get(`${uri.NOTIFICATION}/count/${id}`);
  };

  const setNotificationRead = async (ids: IdType[]) => {
    return get(`${uri.NOTIFICATION}/read/${ids.join(',')}`);
  };

  const listLayout = async () => {
    return get(uri.LAYOUT);
  };

  const saveLayout = async (layout: LayoutModel) => {
    return post(uri.LAYOUT, layout);
  };

  return {
    authenticate,
    saveUser,
    listUsersByNameOrUsername,
    logoff,
    saveNews,
    publishNews,
    shareNews,
    updateUser,
    updatePassword,
    getNewsById,
    getNewsByUrl,
    getNews,
    getSharedByNewsId,
    getFiles,
    deleteFile,
    getLocationNearby,
    getLocationByName,
    getCitiesByName,
    getClientIp,
    saveLocation,
    getSections,
    insertStatistic,
    getStatisticByNews,
    getStatisticByUser,
    getGeneralStatistics,
    getGroupedStatisticsByNews,
    addViewerTime,
    listNotificationByTo,
    countUnreadByTo,
    setNotificationRead,
    listLayout,
    saveLayout
  };
};
