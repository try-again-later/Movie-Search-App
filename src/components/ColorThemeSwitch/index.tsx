import { uniqueId } from 'lodash';
import { useRef } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';

interface ThemeSwitchMode {
  darkModeEnabled: boolean;
  onThemeChange: (enableDarkMode: boolean) => void;
}

const ColorThemeSwitch = ({ darkModeEnabled, onThemeChange }: ThemeSwitchMode) => {
  const { t } = useTranslation('translation', { keyPrefix: 'ColorThemeSwitch' });

  const labelId = useRef(uniqueId('color-theme-switch-'));

  return (
    <>
      <input
        className={styles['dark-mode-checkbox']}
        type="checkbox"
        checked={darkModeEnabled}
        id={labelId.current}
        onChange={(e) => onThemeChange(e.target.checked)}
      />
      <label className={styles.label} htmlFor={labelId.current}>
        {darkModeEnabled ? t('switchToLightMode') : t('switchToDarkMode')}
      </label>
    </>
  );
};

export default ColorThemeSwitch;
