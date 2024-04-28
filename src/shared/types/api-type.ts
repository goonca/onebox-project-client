export type UserModel = {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  accountType?: AccountType;
  lastLoginDate?: string;
  authToken?: string;
};
export enum AccountType {
  WRITER,
  VIEWER
}
export enum RequestStatus {
  SUCCESS,
  FAILED
}
