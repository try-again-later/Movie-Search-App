import uniqueId from 'lodash/uniqueId';
import { useCallback, useRef, ChangeEvent, useState, useEffect, MutableRefObject } from 'react';

/* eslint-disable react/no-unused-prop-types */
type OptionProps = {
  value: string;
  text: string;
};
/* eslint-disable react/no-unused-prop-types */

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

  const onNativeSelectChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      onChange(event.target.value);
    },
    [onChange],
  );

  const [expanded, setExpanded] = useState(false);
  const onCustomSelectClick = useCallback(() => {
    setExpanded((prevExpanded) => !prevExpanded);
  }, [setExpanded]);

  const onCustomOptionClick = useCallback(
    (value: string) => {
      setExpanded(false);
      onChange(value);
    },
    [onChange, setExpanded],
  );

  const handleOutsideClick = useCallback(
    (event: MouseEvent) => {
      if (!wrapperRef.current) {
        return;
      }
      if (event.target && !wrapperRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    },
    [setExpanded, wrapperRef],
  );
  useEffect(() => {
    document.addEventListener('click', handleOutsideClick);

    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, [handleOutsideClick]);

  return (
    <>
      {label.length > 0 && (
        <span className="label" id={labelId.current}>
          {label}
        </span>
      )}
      <div className="custom-select-wrapper" ref={wrapperRef}>
        <select
          className="native-select"
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
        <div className={`custom-select ${className}`} aria-hidden="true">
          <button
            type="button"
            className="selected-option"
            tabIndex={-1}
            onClick={onCustomSelectClick}
          >
            <SelectedContent value={value} text={options.get(value) ?? ''} />
          </button>
          <div className={`options ${expanded && 'visible'}`}>
            {/* eslint-disable jsx-a11y/click-events-have-key-events */}
            {[...options.entries()].map(([value, text]) => (
              <button
                type="button"
                className="option"
                data-value={value}
                key={value}
                onClick={() => onCustomOptionClick(value)}
              >
                <OptionContent text={text} value={value} />
              </button>
            ))}
            {/* eslint-enable jsx-a11y/click-events-have-key-events */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomSelect;
