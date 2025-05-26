import { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import api from '../../../../api';
import LinkExternal from '../../../../components/LinkExternal';
import { COLUMN_TYPES } from '../../../../helpers/constants/columnDescriptions';
import obolibraryLinkFromID from '../../../../helpers/obolibraryLinkFromID';
import { getChildValueFromAttribute } from '../../../../helpers/selects';
import PATHS from '../../../../routes/paths';
import { PROC_EXPR_VALUES } from '../../rawdata/useLogic';

const getColumnValues = (cell, attributes = []) =>
  attributes
    .map((attribute) => {
      const attributeParts = attribute.split('.');
      attributeParts.shift();
      return attributeParts.reduce((result, attr) => result[attr], cell);
    })
    .filter((x) => x !== undefined);

const useLogic = () => {
  const [data, setData] = useState();

  const { id: experimentId } = useParams();
  const loc = useLocation();

  useEffect(() => {
    api.search.experiments.getExperiment(experimentId).then((response) => {
      if (response.status === 200) {
        setData(response.data?.data);
      }
    });
  }, [experimentId]);

  const columns = useMemo(
    () =>
      (data?.columnDescriptions || []).map((column, index) => ({
        key: index,
        title: column.title,
        infoBubble: column.infoBubble,
      })),
    [data?.columnDescriptions]
  );

  const onRenderCell = useCallback(
    ({ cell, key }) => {
      if (!data?.columnDescriptions) {
        return null;
      }

      const { attributes, columnType, filterTargets } =
        data.columnDescriptions[key];

      const values = getColumnValues(cell, attributes);

      switch (columnType) {
        case COLUMN_TYPES.DEV_STAGE:
        case COLUMN_TYPES.ANAT_ENTITY:
          return values.map((value, i) =>
            i % 2 === 0 ? (
              <span key={value}>
                <LinkExternal to={obolibraryLinkFromID(value)}>
                  {value}
                </LinkExternal>
                &nbsp;
              </span>
            ) : (
              value
            )
          );
        case COLUMN_TYPES.LINK_TO_PROC_EXPR_VALUES: {
          const currentSP = new URLSearchParams(loc.search);
          filterTargets?.forEach((filter) => {
            const filterValue = getChildValueFromAttribute(
              cell,
              filter?.valueAttributeName
            );
            if (filterValue) {
              currentSP.append(filter?.urlParameterName, filterValue);
            }
          });
          currentSP.delete('pageType');
          currentSP.append('pageType', PROC_EXPR_VALUES);
          currentSP.delete('data_type');
          currentSP.delete('pageNumber');
          currentSP.append('data_type', data?.dataType);
          currentSP.append('filters_for_all', '1');
          return (
            <a
              href={`${
                PATHS.SEARCH.RAW_DATA_ANNOTATIONS
              }?${currentSP.toString()}`}
            >
              Browse results
            </a>
          );
        }
        default:
          return values.join(' ');
      }
    },
    [data?.columnDescriptions]
  );

  const onFilter = useCallback(
    (keyword) => (row) => {
      const regExp = new RegExp(keyword.trim(), 'gi');

      return (data?.columnDescriptions || []).some(({ attributes }) => {
        const values = getColumnValues(row, attributes)?.join('');
        return regExp.test(values);
      });
    },
    [data?.columnDescriptions]
  );

  return { data, columns, onRenderCell, onFilter };
};

export default useLogic;
