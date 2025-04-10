import { Heatmap } from './components/Heatmap/Heatmap';

const GeneExpressionMatrixResults = ({
  results = [],
  genes,
  anatomicalTerms,
  anatomicalTermsProps,
  maxExpScore,
  onToggleExpandCollapse,
  isLoading,
  isFirstSearch
}) => {
  // console.log(`[GeneExpressionMatrixResults] results:\n${JSON.stringify(results, null, 2)}`);
  // console.log(`[GeneExpressionMatrixResults] anatomicalTerms:\n${JSON.stringify(anatomicalTerms, null, 2)}`);
  // console.log(`[GeneExpressionMatrixResults] anatomicalTerms:\n${JSON.stringify(anatomicalTerms)}`);
  const heatmapData = results.map((result) => {
    const { geneId, name: geneName } = result.gene;
    const speciesId = result.gene.species.id;
    const { id: anatEntityId, name: anatEntityName } = result.condition.anatEntity;
    const { id: cellTypeId, name: cellTypeName } = result.condition.cellType;
    const termId = `${anatEntityId}-${cellTypeId}`;
    const termName = cellTypeId !== 'GO:0005575' ? `${anatEntityName} : ${cellTypeName}` : anatEntityName;
    const expScore = result.expressionScore.expressionScore;
    const maxExp = (geneId in maxExpScore && termId in maxExpScore[geneId])
      ? maxExpScore[geneId][termId]
      : 50 + (10 * Math.random());
    const isExpressed = result.expressionState === 'expressed';

    const row =  {
      x: geneName,
      // y: termName,
      y: termId,
      termId,
      termName,
      geneId,
      geneName,
      speciesId,
      anatEntityId,
      anatEntityName,
      cellTypeId,
      cellTypeName,
      // termIsTopLevel: anatomicalTerms.filter(item => item.id === result.condition.anatEntity.id)?.isTopLevelTerm,
      value: expScore,
      // TODO: use actual number from API response
      maxExp,
      isExpressed,
      hasDataAffy: result.dataTypesWithData.AFFYMETRIX,
      hasDataEst: result.dataTypesWithData.EST,
      hasDataInSitu: result.dataTypesWithData.IN_SITU,
      hasDataRnaSeq: result.dataTypesWithData.RNA_SEQ,
      hasDataScRnaSeq: result.dataTypesWithData.SC_RNA_SEQ,
      ylvl: 0
    };
    return row;
  });

  return (
    <>
      {results?.length > 0 && (
        <Heatmap
          data={heatmapData}
          xTerns={genes}
          yTerms={anatomicalTerms}
          // setYTerms={setAnatomicalTerms}
          termProps={anatomicalTermsProps}
          // setTermProps={setAnatomicalTermsProps}
          onToggleExpandCollapse={onToggleExpandCollapse}
          width={800}
          height={800}
          backgroundColor='white'
          isLoading={isLoading}
        />
      )}
      { isFirstSearch && (
        <div className="is-flex is-justify-content-center mt-3">
          Please select search criteria above to display results.
        </div>
      )}
      {!isFirstSearch && results?.length === 0 && (
        <div className="is-flex is-justify-content-center mt-3">
          No results found.
        </div>
      )}
    </>
  );
};

export default GeneExpressionMatrixResults;
