import dayjs from 'dayjs';
import 'dayjs/locale/fr';
import relativeTime from 'dayjs/plugin/relativeTime';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(updateLocale);

const localeList = dayjs.Ls;

dayjs.updateLocale('fr', {
  relativeTime: {
    ...localeList['fr'].relativeTime,
    s: 'quelques secondes',
    m: '1 minute',
    h: '1 heure',
    d: '1 jour',
    M: '1 mois',
    y: '1 an',
  },
});

dayjs.locale('fr');

export default dayjs;
