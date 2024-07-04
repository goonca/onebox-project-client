import { BadgeProps } from 'components/compose/Badge';
import { ComponentModel, NewsModel } from './api-type';

export type NewsCoverType = {
  news?: NewsModel;
  badgeType?: 'default' | 'titled';
  width?: string;
  showDivider?: boolean;
};
