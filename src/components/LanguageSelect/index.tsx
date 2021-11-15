import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';
import LanguageType, * as Language from '../../ts/Language';
import CustomSelect from '../CustomSelect';

type LanguageSelectProps = {
  value: LanguageType;
  onChange: (newLanguage: LanguageType) => void;
  languages: LanguageType[];
};

const LanguageSelect = ({ value, onChange, languages = [] }: LanguageSelectProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'LanguageSelect' });

  return (
    <div className={styles['language-select']}>
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
