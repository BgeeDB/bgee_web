import HelpIcon from '../../../../../../components/HelpIcon';
import SelectMultipleWithAutoComplete from '../../../../../../components/SelectMultipleWithAtuComplete/SelectMultipleWithAutoComplete';
import { getIdAndNameLabel } from '../../../../../../helpers/selects';
// import { COND_PARAM2_ANAT_KEY } from '../../../../rawdata/useLogic';
import { COND_PARAM2_ANAT_KEY } from '../../../useLogic';

const CellTypes = ({
  selectedCellTypes,
  setSelectedCellTypes,
  AutoCompleteByType,
  hasCellTypeSubStructure,
  setHasCellTypeSubStructure,
  addConditionalParam,
}) => {
  const getCellTypeOptions = AutoCompleteByType('cell_type', (result) => ({
    label: getIdAndNameLabel(result?.object),
    value: result?.object?.id,
    result,
  }));

  const onSelect = (nextValue) => {
    setSelectedCellTypes(nextValue);
    if(nextValue.length > 0)
      addConditionalParam(COND_PARAM2_ANAT_KEY);
  };

  return (
    <>
      <SelectMultipleWithAutoComplete
        label="Cell type"
        placeholder="Examples: 'neuron', 'CL:0000187'"
        getOptionsFunction={getCellTypeOptions}
        selectedOptions={selectedCellTypes}
        setSelectedOptions={onSelect}
      />
      <div className="checkboxWrapper">
        <input
          id="hasCellTypeSubStructure"
          type="checkbox"
          checked={hasCellTypeSubStructure ? 'checked' : ''}
          onChange={() => setHasCellTypeSubStructure((current) => !current)}
        />
        <label htmlFor="hasCellTypeSubStructure">Including substructures</label>
        <HelpIcon
          style={{
            height: '21px',
          }}
          content={
            <>
              Retrieve data in the substructures of the selected terms, for
              instance to retrieve data in all sub-cell-types of neuron cell.
            </>
          }
        />
      </div>
    </>
  );
};

export default CellTypes;
