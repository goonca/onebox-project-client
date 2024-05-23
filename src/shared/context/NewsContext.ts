import React from 'react';
import { NewsModel } from 'shared/types/api-type';

export const NewsContext = React.createContext<NewsModel | undefined>(
  undefined
);
