import fr from './fr';

export enum Locales {
  FR = 'fr',
}

const dictionnaries = {
  [Locales.FR]: fr,
};

export const getDictionnary = (locale: Locales) => dictionnaries[locale];
