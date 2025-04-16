import React, { useEffect, useRef, useState, useCallback } from 'react';
import './SelectMultipleWithAutoComplete.scss';
import Select, { components } from 'react-select';
import useDebounce from '../../hooks/useDebounce';
import classnames from '../../helpers/classnames';

const MAX_OPTIONS_LENGTH = 200;

const escapeRegexp = (str) => str.replace(/([.?*+^$[\]\\(){}|-])/g, '\\$1');

const SelectMultipleWithAutoComplete = ({
  getOptionsFunction,
  label,
  placeholder,
  autoFocus = false,
  minCharToSearch = 1,
  selectedOptions = [], // Selected options array [{label:'', value''}, {label:'', value''}...]
  setSelectedOptions,
  optionActions,
  className,
  style,
  hasBoldLabel,
}: {
  getOptionsFunction: (val: string) => Promise<any> | any;
  label: string;
  placeholder: string;
  autoFocus?: boolean;
  minCharToSearch?: number;
  selectedOptions?: Array<{ label: string; value: string }>;
  setSelectedOptions: (selectedOptions: Array<{ label: string; value: string }>) => void;
  optionActions?: (data: any) => React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  hasBoldLabel?: boolean;
}) => {
  const [search, setSearch] = useState('');
  const searchDebounced = useDebounce(search, 300);
  const [isLoading, setIsLoading] = useState(false);
  const [autocompleteList, setAutocompleteList]: any = useState([]);

  const inputRef = useRef<any>(null);

  const searchHandler = useCallback(
    (val) => {
      if ((val || !minCharToSearch) && getOptionsFunction) {
        setIsLoading(true);

        /**
         * Those values are to be mapped correctly in getOptionsFunction;
         * For a correct display this need to be returned :
         * - label: label to display in the options
         * - value: value's id
         */
        const valueOrPromise = getOptionsFunction(val);

        if (
          valueOrPromise &&
          typeof valueOrPromise.then === 'function' &&
          valueOrPromise[Symbol.toStringTag] === 'Promise'
        ) {
          valueOrPromise.then((options) => {
            setIsLoading(false);
            let list = [...options];
            if (list.length > MAX_OPTIONS_LENGTH) {
              console.warn('WARNING Options list length > ', MAX_OPTIONS_LENGTH);
              list = list.slice(0, MAX_OPTIONS_LENGTH);
            }
            setAutocompleteList(list);
          });
        } else {
          setIsLoading(false);
          setAutocompleteList(valueOrPromise);
        }
      } else {
        setAutocompleteList([]);
      }
    },
    [minCharToSearch, getOptionsFunction]
  );

  useEffect(() => {
    if (searchDebounced.trim().length >= minCharToSearch) {
      searchHandler(searchDebounced);
    } else {
      setAutocompleteList([]);
    }
  }, [searchDebounced, searchHandler]);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current?.focus();
    }
  }, []);

  const renderNoOptions = () => {
    if (search.trim().length < minCharToSearch) {
      return `Enter at least ${minCharToSearch} char`;
    }
    return 'No options available';
  };

  const onInputChange = (query, { action }) => {
    if (action !== 'set-value') {
      setSearch(query);
    }
  };

  const renderOptionWithCheckbox = ({ data, ...otherProps }) => {
    const optionLabel = data?.label || '';

    // Splitting the string on a Case Insensitive, global mode, Regex
    // The returned array is the SAME string split on all matching points
    // We can color all odd indexes
    const splitted = search ? optionLabel.split(new RegExp(`(${escapeRegexp(search)})`, 'ig')) : [optionLabel];

    // For the "rare" case where synonyms are returned by the research
    let matchFrom = '';
    if (data?.result && data?.result?.matchSource !== 'name' && data?.result?.matchSource !== 'id') {
      matchFrom += ' - match from ';
      matchFrom += data?.result?.matchSource;
      matchFrom += data?.result?.match != null ? `: ${data?.result?.match}` : '';
    }

    const level = data.level || 0;

    return (
      // @ts-expect-error Type '{ children: Element; }' is missing properties from type: label, type, and 17 more.
      <components.Option {...otherProps}>
        <div className="is-flex">
          <span className="checkboxLabel" style={{ paddingLeft: level * 16 }}>
            {splitted.map((txt, i) => {
              const isEven = i % 2 === 0;
              return (
                <React.Fragment key={i}>
                  {isEven ? txt : <strong className="has-text-primary">{txt}</strong>}
                  {matchFrom}
                </React.Fragment>
              );
            })}
          </span>
          {optionActions ? optionActions(data) : null}
        </div>
      </components.Option>
    );
  };

  return (
    <div className={`content ${className}`} style={style}>
      <div className="field">
        {!!label && (
          <label
            className={classnames('labelSelect', hasBoldLabel && 'isBold')}
            htmlFor={`autocomplete-search-${label}`}
          >
            {label}
          </label>
        )}
        <Select
          inputId={`autocomplete-search-${label}`}
          classNamePrefix="react-select-autoComplete"
          closeMenuOnSelect
          hideSelectedOptions={false}
          options={autocompleteList}
          components={{
            Option: renderOptionWithCheckbox,
          }}
          noOptionsMessage={renderNoOptions}
          isLoading={isLoading}
          // allowSelectAll
          isMulti
          placeholder={placeholder}
          ref={inputRef}
          onChange={(allSelected) => {
            setSelectedOptions([...allSelected]);
          }}
          value={selectedOptions}
          onInputChange={onInputChange}
          inputValue={search}
          blurInputOnSelect={false}
        />
      </div>
    </div>
  );
};

export default SelectMultipleWithAutoComplete;
