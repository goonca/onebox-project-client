export type FigureFitType =
  | 'fill'
  | 'contain'
  | 'cover'
  | 'none'
  | 'scale-down';

export type ComponentType = 'Figure' | 'Quote' | 'Text';

export type UserModel = {
  id?: number;
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  accountType?: AccountType;
  lastLoginDate?: string;
  authToken?: string;
  profileUrl?: string;
};

export type NewsModel = {
  id?: number | string;
  title?: string;
  headline?: string;
  user?: UserModel;
  createdAt?: Date;
  showAuthor?: boolean;
  showBadge?: boolean;
  showDate?: boolean;
  userId?: number;
  components?: ComponentModel[];
};

export type ComponentModel = {
  id?: number;
  tempId?: string;
  newsId?: number;
  position?: number;
  type?: ComponentType;
  src?: string;
  key?: string;
  $key?: string;
  fitType?: FigureFitType;
  caption?: string;
  longText?: string;
  longFormattedText?: string;
  paddingTop?: number;
  paddingBottom?: number;
  marginTop?: number;
  marginBottom?: number;
  width?: string;
  height?: string;
};

export type FileModel = {
  id?: number;
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
  userId?: number;
  user?: UserModel;
  createdAt?: Date;
};

export enum AccountType {
  WRITER,
  VIEWER
}
export enum RequestStatus {
  SUCCESS,
  FAILED
}
