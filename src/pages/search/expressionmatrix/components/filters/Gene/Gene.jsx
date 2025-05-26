import SelectMultipleWithAutoComplete from '../../../../../../components/SelectMultipleWithAtuComplete/SelectMultipleWithAutoComplete';
import { getGeneLabel } from '../../../../../../helpers/gene';

const Gene = ({ selectedGene, setSelectedGene, AutoCompleteByType }) => {
  const getOptionsFunctionGenes = AutoCompleteByType('gene', (result) => ({
    label: getGeneLabel(result?.gene),
    value: result?.gene?.geneId,
    result,
  }));

  return (
    <SelectMultipleWithAutoComplete
      label="Gene"
      placeholder="Examples: 'dlx', 'ENSG00000254647' (for human)"
      getOptionsFunction={getOptionsFunctionGenes}
      selectedOptions={selectedGene}
      setSelectedOptions={setSelectedGene}
    />
  );
};

export default Gene;
