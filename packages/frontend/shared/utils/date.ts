import { getDictionary } from '@/i18n/translate';
import dayjs from '@/providers/dayjs';

const dict = getDictionary('fr');

export const daysSince = (date: string): number =>
  dayjs().diff(dayjs(date), 'days');

export const getTimeAgoSentence = (inputDate: string): string => {
  const agoSentence = dayjs(inputDate).fromNow(true);
  return dict.global.date.ago(agoSentence);
};
