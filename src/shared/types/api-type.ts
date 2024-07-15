export type FigureFitType =
  | 'fill'
  | 'contain'
  | 'cover'
  | 'none'
  | 'scale-down';

export type ComponentType = 'Figure' | 'Quote' | 'Text';

export enum NotificationType {
  NEWS_PUBLISHED = 'NEWS_PUBLISHED',
  NEWS_UNPUBLISHED = 'NEWS_UNPUBLISHED',
  NEWS_VIEWED = 'NEWS_VIEWED',
  NEWS_UPDATED = 'NEWS_UPDATED',
  NEWS_SHARED = 'NEWS_SHARED'
}

export enum ViewerSurceEnum {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED'
}

export enum BlockTypeEnum {
  NEWS = 'NEWS',
  FIGURE = 'FIGURE',
  TEXT = 'TEXT'
}

export enum NewsStatus {
  DRAFT,
  PUBLISHED,
  SHARED,
  INACTIVE,
  EMPTY
}

export enum NewsContext {
  WORLD,
  COUNTRY,
  REGION
}

export enum AccountType {
  VIEWER,
  WRITER,
  PUBLISHER,
  BUSINESS
}

export enum RequestStatus {
  SUCCESS,
  FAILED
}

export enum StatisticsType {
  NEWS_VIEW
}
export type IdType = string | number | undefined;

export interface ModelObject {
  tempId?: IdType;
  id?: IdType;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserModel extends ModelObject {
  name?: string;
  username?: string;
  description?: string;
  password?: string;
  email?: string;
  avatar?: string;
  accountType?: AccountType;
  lastLoginDate?: string;
  authToken?: string;
  profileUrl?: string;
  occupation?: string;
  university?: string;
  instagram?: string;
  youtube?: string;
  twitter?: string;
  facebook?: string;
  locationGeonameId?: string;
  location?: LocationModel;
}

export interface NewsModel extends ModelObject {
  title?: string;
  headline?: string;
  cover?: string;
  status?: NewsStatus;
  user?: UserModel;
  publishedUrl?: string;
  showAuthor?: boolean;
  showBadge?: boolean;
  showDate?: boolean;
  showContext?: boolean;
  showSection?: boolean;
  holderViewed?: boolean;
  userId?: IdType;
  publishedAt?: Date;
  draftId?: IdType;
  components?: ComponentModel[];
  location?: LocationModel;
  locationGeonameId?: string;
  context?: NewsContext;
  sectionId?: IdType;
  section?: SectionModel;
  sharedById?: IdType;
  holderUserId?: IdType;
  holderUser?: UserModel;
}

export interface FileModel extends ModelObject {
  etag?: string;
  key?: string;
  location?: string;
  fieldname?: string;
  originalname?: string;
  encoding?: string;
  mimetype?: string;
  destination?: string;
  filename?: string;
  path?: string;
  size?: number;
  userId?: IdType;
  user?: UserModel;
  createdAt?: Date;
}

export interface ComponentModel extends ModelObject {
  newsId?: IdType;
  position?: number;
  type?: ComponentType;
  src?: string;
  $key?: string;
  key?: string;
  isCover?: boolean;
  fitType?: FigureFitType;
  caption?: string;
  longText?: string;
  longFormattedText?: string;
  paddingTop?: number;
  paddingBottom?: number;
  marginTop?: number;
  marginBottom?: number;
  width?: number;
  height?: number;
}

export interface LocationModel extends ModelObject {
  geoname_id: string;
  name: string;
  ascii_name: string;
  alternate_names: string[] | string;
  latitude: string;
  longitude: string;
  feature_class: string;
  feature_code: string;
  country_code: string;
  country_code_2: string;
  admin1_code: string;
  admin2_code: string;
  admin3_code: string;
  admin4_code: string;
  population: number;
  elevation: string;
  dem: number;
  timezone: string;
  modification_date: string;
  country: string;
  distance?: number;
  coordinates:
    | {
        lon: number;
        lat: number;
      }
    | number[]
    | { type: string; coordinates: number[] };
}

export interface SectionModel extends ModelObject {
  key?: string;
  name?: string;
  primaryColor?: string;
  secondaryColor?: string;
  totalNews?: number;
}

export type IPLocation = {
  ip: string;
  network: string;
  version: string;
  city: string;
  region: string;
  region_code: string;
  country: string;
  country_name: string;
  country_code: string;
  country_code_iso3: string;
  country_capital: string;
  country_tld: string;
  continent_code: string;
  in_eu: boolean;
  postal: string;
  latitude: number;
  longitude: number;
  timezone: string;
  utc_offset: string;
  country_calling_code: string;
  currency: string;
  currency_name: string;
  languages: string;
  country_area: number;
  country_population: number;
  asn: string;
  org: string;
  error?: string;
};

export interface StatisticsModel extends ModelObject {
  type?: StatisticsType;
  clientIp?: string;
  newsId?: IdType;
  viewerTime?: number;
  locationGeonameId?: string;
  location?: LocationModel;
  createdAt?: Date;
}

export interface NotificationModel extends ModelObject {
  type?: NotificationType;
  param1?: string;
  param2?: string;
  newsId?: IdType;
  news?: NewsModel;
  fromUserId?: IdType;
  fromUser?: UserModel;
  toUserId?: IdType;
  toUser?: UserModel;
  read?: number;
  createdAt?: Date;
}

export type NewsStatistics = {
  totalViewers: number;
  uniqueViewers: number;
  avgViewingTime: number;
  news: NewsModel;
};

export interface FilterModel extends ModelObject {
  active?: number;
  blockId?: IdType;
  block?: BlockModel;
  attribute?: string;
  condition?: string;
  operator?: string;
  value?: string;
}

export interface BlockModel extends ModelObject {
  title?: string;
  type?: string;
  size?: number;
  display?: number;
  columns?: number;
  positionX?: number;
  positionY?: number;
  filters?: FilterModel[];
  userId?: IdType;
  user?: UserModel;
  layoutId?: IdType;
  layout?: LayoutModel;
  news?: NewsModel[];
}

export interface LayoutModel extends ModelObject {
  type?: number;
  status?: number;
  columns?: string;
  position?: number;
  userId?: number;
  user?: UserModel;
  blocks?: BlockModel[];
}

export interface SpaceModel extends ModelObject {
  layouts?: LayoutModel[];
}
