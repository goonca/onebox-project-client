export type SequilizeErrorType = {
  message: string;
  path: string;
  validatorKey: string;
  validatorName: string;
  value: string;
};

export type SnackBarType = {
  errors?: SequilizeErrorType[];
  severity?: 'success' | 'info' | 'warning' | 'error';
};
