export enum Language {
  RUSSIAN,
  ENGLISH_US,
}

export function languageToString(language: Language) {
  switch (language) {
    case Language.RUSSIAN:
      return 'ru';
    case Language.ENGLISH_US:
      return 'en';
    default:
      return 'en';
  }
}
