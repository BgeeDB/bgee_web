/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useMemo } from 'react';
import { EXPERIMENTS, PROC_EXPR_VALUES, RAW_DATA_ANNOTS } from '../../rawdata/useLogic';

const ResultTabs = ({
  dataTypes,
  dataType,
  allCounts,
  setDataType,
  pageType,
  isCountLoading,
  localCount,
}) => {
  const resultKey = useMemo(() => {
    switch (pageType) {
      case EXPERIMENTS:
        return 'experimentCount';
      case RAW_DATA_ANNOTS:
        return 'assayCount';
      case PROC_EXPR_VALUES:
        return 'callCount';
      default:
        return 'experimentCount';
    }
  }, [pageType]);

  return (
    <div className="is-flex ongletWrapper is-centered">
      {dataTypes.map((type) => {
        const isActive = type.id === dataType;
        const inactiveCount =
          allCounts?.[type.id]?.[resultKey] !== undefined
            ? allCounts?.[type.id]?.[resultKey]
            : 'No data';
        const nb = isActive ? localCount?.[resultKey] : inactiveCount;
        return (
          <div
            key={type.id}
            onClick={() => setDataType(type.id)}
            className={`onglet column is-centered ${
              isActive && 'ongletActive'
            }`}
          >
            {nb > 0 ? (
              <span style={{fontWeight: 'bold'}}>{type.label}</span>
            ) : (
              <span>{type.label}</span>
            )}
            {isCountLoading || nb === undefined ? (
              <progress
                className="progress is-small is-primary"
                style={{
                  animationDuration: '2s',
                  width: '25px',
                  marginLeft: '8px',
                  height: '5px',
                }}
              />
            ) : (
              <span className="has-text-danger">
                &nbsp;(
                {nb})
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ResultTabs;
