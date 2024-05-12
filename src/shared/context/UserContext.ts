import React from 'react';
import { UserModel } from 'shared/types/api-type';

export const UserContext = React.createContext<UserModel | undefined>(
  undefined
);
