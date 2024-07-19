import { DisplayModel, NewsModel } from './api-type';

export type NewsCoverType = {
  news?: NewsModel;
  customDisplay?: DisplayModel;
  width?: string;
  showDivider?: boolean;
};
