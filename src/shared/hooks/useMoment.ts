import moment from 'moment';

export type MomentType = {
  toDateTimeString: (date: any) => string;
};

export const useMoment = () => {
  const toDateTimeString = (date: any) => {
    return moment(date).calendar();
  };

  return { toDateTimeString };
};
