import uniqueId from 'lodash/uniqueId';
import { useRef, ChangeEvent, useState, useEffect, MutableRefObject, JSX } from 'react';

import ArrowDown from './icons/arrow-down.svg?react';

import styles from './styles.module.scss';

type OptionProps = {
  value: string;
  text: string;
};

type OptionContentType = (props: OptionProps) => JSX.Element;

type SelectProps = {
  options: Map<string, string>;
  value: string;
  onChange: (newValue: string) => void;
  className?: string;
  label?: string;
  OptionContent?: OptionContentType;
  SelectedContent?: OptionContentType;
};

const DefaultOptionContent = ({ text }: OptionProps) => <>{text}</>;

const DefaultSelectedContent = ({ text }: OptionProps) => <>{text}</>;

const CustomSelect = ({
  options,
  value,
  onChange,
  className = '',
  label = '',
  OptionContent = DefaultOptionContent,
  SelectedContent = DefaultSelectedContent,
}: SelectProps) => {
  const labelId = useRef(uniqueId('custom-select-label-'));
  const wrapperRef: MutableRefObject<HTMLDivElement | null> = useRef(null);

  const onNativeSelectChange = (event: ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value);
  };

  const [expanded, setExpanded] = useState(false);
  const onCustomSelectClick = () => {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  const onCustomOptionClick = (value: string) => {
    setExpanded(false);
    onChange(value);
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!wrapperRef.current) {
        return;
      }
      if (event.target && !wrapperRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  return (
    <>
      <div className={styles['custom-select-wrapper']} ref={wrapperRef}>
        <select
          className={styles['native-select']}
          aria-labelledby={labelId.current}
          value={value}
          onChange={onNativeSelectChange}
        >
          {[...options.entries()].map(([value, text]) => (
            <option value={value} key={value}>
              {text}
            </option>
          ))}
        </select>
        <div className={`${styles['custom-select']} ${className}`} aria-hidden="true">
          <button
            type="button"
            className={styles['selected-option']}
            tabIndex={-1}
            onClick={onCustomSelectClick}
          >
            <SelectedContent value={value} text={options.get(value) ?? ''} />
            <ArrowDown className={styles['selected-option-icon']} />
          </button>
          <div className={`${styles.options} ${expanded ? styles.visible : ''}`}>
            {[...options.entries()].map(([value, text]) => (
              <button
                type="button"
                className={styles.option}
                data-value={value}
                key={value}
                onClick={() => onCustomOptionClick(value)}
              >
                <OptionContent text={text} value={value} />
              </button>
            ))}
          </div>
        </div>
      </div>
      {label.length > 0 && <span id={labelId.current}>{label}</span>}
    </>
  );
};

export default CustomSelect;
