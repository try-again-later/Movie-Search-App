import { uniqueId } from 'lodash';
import { useRef, useCallback, ChangeEvent } from 'react';
import { useTranslation } from 'react-i18next';

import styles from './styles.module.scss';

interface ThemeSwitchMode {
  darkModeEnabled: boolean;
  onThemeChange: (enableDarkMode: boolean) => void;
}

const ColorThemeSwitch = ({ darkModeEnabled, onThemeChange }: ThemeSwitchMode) => {
  const { t } = useTranslation('translation', { keyPrefix: 'ColorThemeSwitch' });

  const labelId = useRef(uniqueId('color-theme-switch-'));

  const onThemeChangedEvent = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onThemeChange(event.target.checked);
    },
    [onThemeChange],
  );

  return (
    <>
      <input
        className={styles['dark-mode-checkbox']}
        type="checkbox"
        checked={darkModeEnabled}
        id={labelId.current}
        onChange={onThemeChangedEvent}
      />
      <label className={styles.label} htmlFor={labelId.current}>
        {darkModeEnabled ? t('switchToLightMode') : t('switchToDarkMode')}
      </label>
    </>
  );
};

export default ColorThemeSwitch;
