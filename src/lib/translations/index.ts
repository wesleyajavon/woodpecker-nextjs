import { fr } from './fr';
import { en } from './en';

export const translations = {
  fr,
  en,
};

export type TranslationKey = keyof typeof fr;
