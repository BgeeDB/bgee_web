import GeneExpressionHeatmap from '../../../components/Gene/GeneExpressionHeatmap';

// Transform multispec API format (multiSpeciesCondition) to heatmap format (condition)
const DEFAULT_ANAT_ENTITY = { id: 'UBERON:0001062', name: 'anatomical entity' };
const DEFAULT_CELL_TYPE = { id: 'GO:0005575', name: 'cellular component' };

const aggregateTerms = (terms, fallbackTerm) => {
  if (!Array.isArray(terms) || terms.length === 0) return fallbackTerm;

  const validTerms = terms.filter((term) => term?.id && term?.name);
  if (validTerms.length === 0) return fallbackTerm;

  return {
    id: validTerms.map((term) => term.id).join(','),
    name: validTerms.map((term) => term.name).join(', '),
  };
};

const transformToExpressionCall = (result) => {
  let condition = result.condition;
  if (result.multiSpeciesCondition) {
    const msc = result.multiSpeciesCondition;
    const anatEntity = aggregateTerms(msc.anatEntities, DEFAULT_ANAT_ENTITY);
    const cellType = aggregateTerms(msc.cellTypes, DEFAULT_CELL_TYPE);
    condition = { anatEntity, cellType };
  }
  return {
    gene: result.gene,
    condition,
    expressionScore: result.expressionScore,
    expressionState: result.expressionState,
    dataTypesWithData: result.dataTypesWithData,
    isOrphan: result.isOrphan,
  };
};

const GeneExpressionMatrixResults = ({ results = [], genes, isLoading, isFirstSearch, onFetchChildren }) => {
  const expressionCalls = results.map(transformToExpressionCall);

  return (
    <>
      {results?.length > 0 && (
        <GeneExpressionHeatmap
          expressionCalls={expressionCalls}
          genes={genes}
          onFetchChildren={onFetchChildren}
          isLoading={isLoading}
          xLabelRotation={325}
          maxGraphWidth={1500}
          cellHeight={30}
          showResetButton={true}
          rendererMargins={{ top: 60, right: 60, bottom: 50, left: 200 }}
        />
      )}
      {isFirstSearch && (
        <div className="is-flex is-justify-content-center mt-3">
          Please select search criteria above to display results.
        </div>
      )}
      {!isFirstSearch && results?.length === 0 && (
        <div className="is-flex is-justify-content-center mt-3">No results found.</div>
      )}
    </>
  );
};

export default GeneExpressionMatrixResults;
