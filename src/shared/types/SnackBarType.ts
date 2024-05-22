export type SequilizeErrorType = {
  message: string;
  path: string;
  validatorKey: string;
  validatorName: string;
  value: string;
};

export type SnackBarType = {
  errors?: SequilizeErrorType[];
  messages?: string[];
  severity?: 'success' | 'info' | 'warning' | 'error';
};
