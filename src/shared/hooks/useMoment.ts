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

const getMomentConfigWithTime = () => {
  return {
    sameDay: '[Today] HH:MM',
    nextDay: '[Tomorrow] HH:MM',
    nextWeek: 'dddd HH:MM',
    lastDay: '[Yesterday] HH:MM',
    lastWeek: 'DD/MM/YYYY HH:MM',
    sameElse: 'DD/MM/YYYY HH:MM'
  };
};

export type MomentType = {
  toDateTimeString: (date: any) => string;
  toDateString: (date: any) => string;
  twoLinesDate: (date: any) => string[];
};

export const useMoment = () => {
  const toDateString = (date: any) => {
    return moment(date).calendar(null, getMomentConfig());
  };

  const toDateTimeString = (date: any) => {
    return moment(date).calendar(null, getMomentConfigWithTime());
  };

  const twoLinesDate = (date: any) => {
    const words = toDateTimeString(date).split(' ');
    return [
      words.slice(0, words.length - 3).join(' '),
      words.slice(words.length - 3).join(' ')
    ];
  };

  return { toDateTimeString, twoLinesDate, toDateString };
};
