/* eslint-disable import/no-useless-path-segments */
/* eslint-disable import/named */
import HelpIcon from '../../../../../../components/HelpIcon';
import Bulma from '../../../../../../components/Bulma';
import {
  ALL_DATA_TYPES,
  ALL_DATA_TYPES_ID,
} from '../../../../rawdata/useLogic';

const DataType = ({ dataTypes, setDataTypes }) => {
  const allDisabled =
    JSON.stringify(dataTypes.sort()) ===
    JSON.stringify(ALL_DATA_TYPES_ID.sort());

  const onChangeDataType = (e, dataType) => {
    setDataTypes((prev) => {
      const curr = [...prev];
      if (e.target.checked) {
        curr.push(dataType.id);
      } else {
        const pos = curr.findIndex((d) => d === dataType.id);
        if (pos >= 0) curr.splice(pos, 1);
      }
      return curr;
    });
  };

  return (
    <>
      <label>
        Data type
        <HelpIcon
          style={{
            position: 'absolute',
          }}
          content={
            <>
              Select the data types to consider, that were used to produce the
              expression calls: expression calls are produced by integrating any
              combination of these data types, you can select here the
              combination to use for your query.
            </>
          }
        />
      </label>
      <div className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper mt-2">
        {ALL_DATA_TYPES.map((dataType) => (
          <label
            key={dataType.id}
            className="checkbox ml-2 is-size-7 is-flex is-align-items-center"
            id={dataType.id}
          >
            <input
              type="checkbox"
              checked={dataTypes.find((d) => d === dataType.id) || false}
              onChange={(e) => onChangeDataType(e, dataType)}
            />
            <b className="mx-1">{dataType.label}</b>
          </label>
        ))}
        <Bulma.Button
          className="search-form"
          disabled={allDisabled}
          onClick={() => setDataTypes(ALL_DATA_TYPES_ID)}
        >
          Select All
        </Bulma.Button>
        <Bulma.Button
          className="search-form"
          disabled={dataTypes.length === 0}
          onClick={() => setDataTypes([])}
        >
          Unselect All
        </Bulma.Button>
      </div>
    </>
  );
};

export default DataType;
