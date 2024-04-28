import { RequestStatus, UserModel } from 'shared/types/api-type';

export type ResponseType = {
  data: object;
  status: RequestStatus;
};

export type ServicesType = {
  authenticate: (user: UserModel) => any;
  saveUser: (user: UserModel) => any;
  logoff: () => any;
};

enum uri {
  AUTH = 'http://localhost:3002/auth',
  CREATE_USER = 'http://localhost:3002/user',
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

  const authenticate = async (user: UserModel) => {
    return await post(uri.AUTH, user);
  };

  const saveUser = async (user: UserModel) => {
    return await post(uri.CREATE_USER, user);
  };

  const logoff = async () => {
    return await post(uri.LOGOFF);
  };

  return {
    authenticate,
    saveUser,
    logoff
  };
};
