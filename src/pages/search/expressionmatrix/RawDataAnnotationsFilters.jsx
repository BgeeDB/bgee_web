import { useState } from 'react';
import { isEmpty } from '../../../helpers/arrayHelper';
import SelectMultipleWithAutoComplete from '../../../components/SelectMultipleWithAtuComplete/SelectMultipleWithAutoComplete';
import './rawDataAnnotations.scss';
import { getOptionsForFilter } from '../../../helpers/selects';
import classnames from '../../../helpers/classnames';

const RawDataAnnotationsFilters = ({
  filters,
  setFilters,
  triggerSearch,
  dataFilters = {},
  dataType,
}) => {
  const [hasChanged, setHasChanged] = useState(false);
  const eraseFilters = () => {
    // if (filters[dataType] !== {} && filters[dataType] !== undefined) {
    if (filters[dataType] !== undefined) {
      setFilters((old) => ({ ...old, [dataType]: {} }));
      triggerSearch(true, true);
      setHasChanged(false);
    }
  };

  const onApplyFilter = () => {
    triggerSearch(false, true);
    setHasChanged(false);
  };

  const onSelect = (keyAPI, newSelected) => {
    setHasChanged(true);
    setFilters((old) => ({
      ...old,
      [dataType]: { ...old[dataType], [keyAPI]: newSelected },
    }));
  };

  return (
    <div className="filters">
      {!isEmpty(dataFilters) &&
        Object.keys(dataFilters).map((filterKey) => {
          const dataFilter = dataFilters[filterKey];
          const keyAPI = dataFilter?.urlParameterName;
          const filterByDataType = filters[dataType];
          const options = getOptionsForFilter(
            dataFilter?.values,
            dataFilter?.informativeId,
            dataFilter?.informativeName
          );
          return (
            <SelectMultipleWithAutoComplete
              key={filterKey}
              label={dataFilter.filterName}
              minCharToSearch={0}
              placeholder={dataFilter.filterName}
              getOptionsFunction={() => options}
              selectedOptions={filterByDataType?.[keyAPI] || []}
              setSelectedOptions={(newSelected) =>
                onSelect(keyAPI, newSelected)
              }
              className="filterSelect my-2"
            />
          );
        })}
      {!isEmpty(dataFilters) && (
        <div className="marginAutoBtn">
          <button
            className={classnames(
              ' button is-small is-info mt-2',
              !hasChanged && 'is-light'
            )}
            type="button"
            onClick={onApplyFilter}
            disabled={!hasChanged}
          >
            Apply filters
          </button>
          <button
            className="button is-small is-danger is-light mt-2 ml-2"
            type="button"
            onClick={eraseFilters}
          >
            <ion-icon name="trash" tooltop />
          </button>
        </div>
      )}
    </div>
  );
};

export default RawDataAnnotationsFilters;
