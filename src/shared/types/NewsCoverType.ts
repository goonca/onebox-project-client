import { BadgeProps } from 'components/compose/Badge';
import { ComponentModel } from './api-type';

export type NewsCoverType = {
  title: string;
  badge?: BadgeProps;
  badgeType?: 'default' | 'titled';
  figure?: ComponentModel;
  width?: string;
  showDivider?: boolean;
};
