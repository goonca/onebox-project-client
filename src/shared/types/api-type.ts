export type UserModel = {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  accountType?: AccountType;
  lastLoginDate?: string;
  authToken?: string;
  profileUrl: string;
};

export type NewsModel = {
  title: string;
  headline?: string;
  author?: UserModel;
  date?: Date;
};

export enum AccountType {
  WRITER,
  VIEWER
}
export enum RequestStatus {
  SUCCESS,
  FAILED
}
