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
};

export type FileModel = {
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
