import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import uniqueId from 'lodash/uniqueId';

import LanguageType, * as Language from '../ts/Language';

type LanguageSelectProps = {
  value: LanguageType;
  onChange: (newLanguage: LanguageType) => void;
  languages: LanguageType[];
};

const LanguageSelect = ({ value, onChange, languages = [] }: LanguageSelectProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'LanguageSelect' });
  const languageSelectId = useRef(uniqueId('language-select-'));

  return (
    <div className="language-select">
      <label htmlFor={languageSelectId.current}>{t('chooseYourLanguage')}</label>
      <select
        id={languageSelectId.current}
        value={Language.toString(value)}
        onChange={(event) => onChange(Language.fromString(event.target.value))}
      >
        {languages.map((language) => {
          const languageValue = Language.toString(language);
          return (
            <option key={languageValue} value={languageValue}>
              {Language.toHumanString(language)}
            </option>
          );
        })}
      </select>
    </div>
  );
};

export default LanguageSelect;
