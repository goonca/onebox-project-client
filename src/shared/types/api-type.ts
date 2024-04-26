export type UserModel = {
  name?: string;
  username?: string;
  password?: string;
  email?: string;
  accountType?: AccountType;
  lastLoginDate?: string;
};
export enum AccountType {
  WRITER,
  VIEWER
}
