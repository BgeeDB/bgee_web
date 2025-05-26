/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from 'react';
import './autoCompleteSearch.scss';

/**
 *
 * @param {{
 * children?: React.ReactNode | JSX.Element | string;
 * renderOption?: (option: any, search: string) => React.ReactNode | JSX.Element;
 * getOptionsFunction?: (search: string) => Promise<any[]> | any[];
 * onSelectOption?: (option: any) => void;
 * onRemoveOption?: (option: any) => void;
 * searchTerm?: string;
 * label?: string;
 * hasSearchButton?: boolean;
 * selectedOptions?: any[];
 * placeholder?: string; }} param0
 */
const AutoCompleteSearch = ({
  renderOption,
  getOptionsFunction,
  onSelectOption,
  onRemoveOption,
  label,
  searchTerm = '',
  placeholder,
  hasSearchButton,
  selectedOptions,
  children,
  autoFocus = false,
}) => {
  const [search, setSearch] = useState('');
  const [autocompleteList, setAutocompleteList] = useState([]);

  const inputRef = useRef();

  const onSelectChoice = useCallback(
    (option) => () => {
      if (option === '') return;

      if (onSelectOption) {
        onSelectOption(option);
      }

      // If not multiple selection
      if (!selectedOptions) {
        setSearch(
          typeof option !== 'string' && renderOption
            ? renderOption(option)
            : option
        );
      } else {
        setSearch('');
      }

      setAutocompleteList([]);
    },
    [selectedOptions, onSelectOption, renderOption]
  );

  const onRemoveChoice = useCallback(
    (option) => () => {
      if (onRemoveOption) {
        onRemoveOption(option);
      }
    },
    [onRemoveOption]
  );

  const searchHandler = useCallback(
    (val) => {
      if (val && getOptionsFunction) {
        const valueOrPromise = getOptionsFunction(val);
        if (
          valueOrPromise &&
          typeof valueOrPromise.then === 'function' &&
          valueOrPromise[Symbol.toStringTag] === 'Promise'
        ) {
          valueOrPromise.then((options) => {
            setAutocompleteList(options);
          });
        } else {
          setAutocompleteList(valueOrPromise);
        }
      } else {
        setAutocompleteList([]);
      }
    },
    [getOptionsFunction]
  );

  const handleSearchChange = useCallback(
    ({ target: { value } }) => {
      setSearch(value);
      searchHandler(value);
    },
    [searchHandler]
  );

  const hasResults = useMemo(
    () => autocompleteList.length > 0 && search.length > 0,
    [autocompleteList, search]
  );

  const options = useMemo(
    () =>
      autocompleteList.map((option, index) => (
        <div
          // eslint-disable-next-line react/no-array-index-key
          key={index}
          onClick={onSelectChoice(option)}
          role="button"
          tabIndex={index}
          className="rowSearch"
        >
          {renderOption ? renderOption(option, search) : option}
        </div>
      )),
    [autocompleteList, renderOption]
  );

  useEffect(() => {
    if (searchTerm !== '') {
      setSearch(searchTerm);
    }
  }, [searchTerm]);

  useEffect(() => {
    if (autoFocus && inputRef.current) inputRef.current?.focus();

    const onClick = () => {
      setAutocompleteList([]);
    };
    document.getElementById('root').addEventListener('click', onClick);
    const onClickInput = (e) => {
      e.stopPropagation();
    };
    document
      .getElementById('autocomplete-search')
      .addEventListener('click', onClickInput);
    return () => {
      document.getElementById('root').removeEventListener('click', onClick);
      document
        .getElementById('autocomplete-search')
        ?.removeEventListener('click', onClickInput);
    };
  }, []);

  return (
    <div className="content">
      <div className="field">
        {!!label && (
          <label className="label" htmlFor="autocomplete-search">
            {label}
          </label>
        )}
        <div className="control">
          <input
            ref={inputRef}
            id="autocomplete-search"
            className="input"
            type="text"
            name="autocomplete-search"
            placeholder={placeholder}
            value={search}
            onChange={handleSearchChange}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                onSelectChoice(search)();
              }
            }}
          />
        </div>
      </div>
      {hasResults && <div className="dropDownSearchForm">{options}</div>}
      {!!selectedOptions?.length && (
        <div className="result">
          {selectedOptions.map((option, index) => (
            <div className="render" key={index}>
              {typeof option !== 'string' && renderOption
                ? renderOption(option)
                : option}{' '}
              <span className="span-x" onClick={onRemoveChoice(option)}>
                X
              </span>
            </div>
          ))}
        </div>
      )}
      {hasSearchButton && (
        <div className="field">
          <div className="control is-flex is-align-items-center">
            <button
              className="button mr-2 search-form"
              type="button"
              onClick={onSelectChoice(search)}
            >
              Search
            </button>
            {children}
          </div>
        </div>
      )}
    </div>
  );
};

export default AutoCompleteSearch;
