import { BadgeProps } from 'components/compose/Badge';
import { FigureProps } from 'components/compose/Figure';

export type NewsCoverType = {
  title: string;
  badge?: BadgeProps;
  badgeType?: 'default' | 'titled';
  figure?: FigureProps;
  width?: string;
  showDivider?: boolean;
};
