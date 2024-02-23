import fr from './fr';

type Locale = 'fr';

const dictionnaries = {
  fr,
};

export const getDictionary = (locale: Locale) => dictionnaries[locale];
