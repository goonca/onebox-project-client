import { UserModel } from 'shared/types/api-type';

export type ResponseType = {
  data: object;
  status: string;
};

export type ServicesType = {
  authenticate: (user: UserModel) => any;
  saveUser: (user: UserModel) => any;
};

enum uri {
  AUTH = 'http://localhost:3002/auth',
  CREATE_USER = 'http://localhost:3002/user'
}

export const useServices = (): ServicesType => {
  const post = async (url: string, data: unknown) => {
    const rawResponse = await fetch(url, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
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

  return {
    authenticate,
    saveUser
  };
};
