import SelectMultipleWithAutoComplete from '../../../../../../components/SelectMultipleWithAtuComplete/SelectMultipleWithAutoComplete';
// import { COND_PARAM2_STRAIN_KEY } from '../../../../rawdata/useLogic';
import { COND_PARAM2_STRAIN_KEY } from '../../../useLogic';

const Strain = ({
  selectedStrain,
  setSelectedStrain,
  AutoCompleteByType,
  addConditionalParam,
}) => {
  const getStrainOptions = AutoCompleteByType('strain', (result) => ({
    label: result?.object,
    value: result?.object,
    result,
  }));

  const onSelect = (nextValue) => {
    setSelectedStrain(nextValue);
    if(nextValue.length > 0)
      addConditionalParam(COND_PARAM2_STRAIN_KEY);
  };

  return (
    <>
      <SelectMultipleWithAutoComplete
        label="Strain and ethnicity"
        placeholder="Examples: 'C57BL/6' (for mouse), 'White' (for human)"
        getOptionsFunction={getStrainOptions}
        selectedOptions={selectedStrain}
        setSelectedOptions={onSelect}
        minCharToSearch={2}
      />
    </>
  );
};

export default Strain;
