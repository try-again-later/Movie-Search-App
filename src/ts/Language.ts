enum Language {
  RUSSIAN,
  ENGLISH_US,
}

export default Language;

export const DEFAULT = Language.ENGLISH_US;

export function toString(language: Language): string {
  switch (language) {
    case Language.RUSSIAN:
      return 'ru';
    case Language.ENGLISH_US:
      return 'en-US';
    default:
      return 'en';
  }
}

export function toHumanString(language: Language): string {
  switch (language) {
    case Language.RUSSIAN:
      return 'Русский';
    case Language.ENGLISH_US:
      return 'English';
    default:
      return 'Unknown';
  }
}

export function fromString(language: string): Language {
  switch (language.trim().toLowerCase()) {
    case 'ru':
      return Language.RUSSIAN;
    case 'en-US':
    case 'en':
      return Language.ENGLISH_US;
    default:
      return Language.ENGLISH_US;
  }
}
