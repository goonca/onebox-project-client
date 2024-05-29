import moment from 'moment';

const getMomentConfig = () => {
  return {
    sameDay: '[Today]',
    nextDay: '[Tomorrow]',
    nextWeek: 'dddd',
    lastDay: '[Yesterday]',
    lastWeek: 'DD/MM/YYYY',
    sameElse: 'DD/MM/YYYY'
  };
};

export type MomentType = {
  toDateTimeString: (date: any) => string;
  twoLinesDate: (date: any) => string[];
};

export const useMoment = () => {
  const toDateTimeString = (date: any) => {
    return moment(date).calendar(null, getMomentConfig());
  };

  const twoLinesDate = (date: any) => {
    const words = toDateTimeString(date).split(' ');
    return [
      words.slice(0, words.length - 3).join(' '),
      words.slice(words.length - 3).join(' ')
    ];
  };

  return { toDateTimeString, twoLinesDate };
};
