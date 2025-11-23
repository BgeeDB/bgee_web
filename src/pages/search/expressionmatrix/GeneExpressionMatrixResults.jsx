import GeneExpressionHeatmap from '../../../components/Gene/GeneExpressionHeatmap';

const GeneExpressionMatrixResults = ({ results = [], genes, isLoading, isFirstSearch, onFetchChildren }) => {
  // Transform results to expression calls format expected by GeneExpressionHeatmap
  const expressionCalls = results.map((result) => ({
    gene: result.gene,
    condition: result.condition,
    expressionScore: result.expressionScore,
    expressionState: result.expressionState,
    dataTypesWithData: result.dataTypesWithData,
    isOrphan: result.isOrphan, // Preserve isOrphan flag if present
  }));

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
