import { useTranslation } from 'react-i18next';

import LanguageType, * as Language from '../ts/Language';
import CustomSelect from './CustomSelect';

type LanguageSelectProps = {
  value: LanguageType;
  onChange: (newLanguage: LanguageType) => void;
  languages: LanguageType[];
};

const LanguageSelect = ({ value, onChange, languages = [] }: LanguageSelectProps) => {
  const { t } = useTranslation('translation', { keyPrefix: 'LanguageSelect' });

  return (
    <div className="language-select">
      <CustomSelect
        label={t('chooseYourLanguage')}
        value={Language.toString(value)}
        onChange={(newValue) => onChange(Language.fromString(newValue))}
        options={
          new Map(
            languages.map((langauge) => [
              Language.toString(langauge),
              Language.toHumanString(langauge),
            ]),
          )
        }
        OptionContent={({ text, value }) => (
          <>
            <span
              className={`flag-icon-background flag-icon-${Language.toIsoCountryCode(
                Language.fromString(value),
              )}`}
            />
            {text}
          </>
        )}
        SelectedContent={({ value }) => (
          <>
            <span
              className={`flag-icon-background flag-icon-${Language.toIsoCountryCode(
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
