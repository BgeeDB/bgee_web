import SelectMultipleWithAutoComplete from '../../../../../../components/SelectMultipleWithAtuComplete/SelectMultipleWithAutoComplete';
import { COND_PARAM2_STRAIN_KEY } from '../../../useLogic';

const Strain = ({
  selectedStrain,
  setSelectedStrain,
  AutoCompleteByType,
  addConditionalParam,
  selectedSpecies,
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

  const label = selectedSpecies === 9606 ? 'Ethnicity' : 'Strain';

  return (
    <>
      <SelectMultipleWithAutoComplete
        label={label}
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
