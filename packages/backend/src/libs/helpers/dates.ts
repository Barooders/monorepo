import dayjs from 'dayjs';

export const isOlderThan = (
  date: Date | string,
  periodInSeconds: number,
): boolean => {
  return dayjs(date).isBefore(dayjs().subtract(periodInSeconds, 'seconds'));
};
