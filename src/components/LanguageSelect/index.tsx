import { useTranslation } from 'react-i18next';

import CustomSelect from '@components/CustomSelect';
import LanguageType, * as Language from '@ts/Language';

import styles from './styles.module.scss';

type LanguageSelectProps = {
  value: LanguageType;
  onChange: (newLanguage: LanguageType) => void;
  languages: LanguageType[];
  className?: string;
};

const LanguageSelect = ({ value, onChange, languages = [], className }: LanguageSelectProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'LanguageSelect' });

  return (
    <div className={`${styles['language-select']} ${className ?? ''}`}>
      <CustomSelect
        label={t('chooseYourLanguage')}
        value={Language.toString(value)}
        onChange={(newValue) => onChange(Language.fromString(newValue))}
        options={
          new Map(
            languages.map((language) => [
              Language.toString(language),
              Language.toHumanString(language),
            ]),
          )
        }
        OptionContent={({ text, value }) => (
          <>
            <span
              className={`${
                styles['flag-icon-background']
              } flag-icon-background flag-icon-${Language.toIsoCountryCode(
                Language.fromString(value),
              )}`}
            />
            {text}
          </>
        )}
        SelectedContent={({ value }) => (
          <>
            <span
              className={`${
                styles['flag-icon-background']
              } flag-icon-background flag-icon-${Language.toIsoCountryCode(
                Language.fromString(value),
              )}`}
            />
          </>
        )}
      />
    </div>
  );
};

export default LanguageSelect;
