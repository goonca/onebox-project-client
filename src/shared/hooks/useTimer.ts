import moment, { Moment } from 'moment';

export type TimerProps = {
  start: () => void;
  diff: () => number;
};

export const useTimer = () => {
  let startTime: Moment;

  const start = () => {
    startTime = moment(new Date());
  };

  const diff = () => {
    return moment.duration(moment(new Date()).diff(startTime)).asSeconds();
  };

  return { start, diff };
};
