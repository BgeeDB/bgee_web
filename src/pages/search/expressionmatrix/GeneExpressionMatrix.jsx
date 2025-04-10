/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useState } from 'react';

import Button from '../../../components/Bulma/Button/Button';
import './rawDataAnnotations.scss';
// import RawDataAnnotationResults from './RawDataAnnotationResults';
import DevelopmentalAndLifeStages from './components/filters/DevelopmentalAndLifeStages/DevelopmentalAndLifeStages';
import Species from './components/filters/Species/Species';
import useLogic, {
  TAB_PAGE_EXPR_CALL,
} from './useLogic';
import CellTypes from './components/filters/CellTypes';
import Tissues from './components/filters/Tissues/Tissues';
import Sex from './components/filters/Sex/Sex';
import Strain from './components/filters/Strain/Strain';
import Gene from './components/filters/Gene/Gene';
import DataType from './components/filters/DataType/DataType';
import DataQualityParameter from './components/filters/DataQualityParameter';
import CallType from './components/filters/CallType';
import config from '../../../config.json';
import GeneExpressionMatrixResults from './GeneExpressionMatrixResults';
import UserFeedback from './components/UserFeedback';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;
const GeneExpressionMatrix = ({ isExprCalls = false }) => {
  const {
    searchResult,
    genes,
    anatomicalTerms,
    anatomicalTermsProps,
    maxExpScore,
    dataType,
    show,
    devStages,
    hasDevStageSubStructure,
    selectedDevStages,
    selectedSpecies,
    selectedCellTypes,
    hasTissueSubStructure,
    hasCellTypeSubStructure,
    selectedStrain,
    selectedGene,
    selectedTissue,
    speciesSexes,
    selectedSexes,
    isLoading,
    isFirstSearch,
    dataTypesExpCalls,
    dataQuality,
    callTypes,
    setCallTypes,
    setDataQuality,
    setDataTypesExpCalls,
    onChangeSpecies,
    getSpeciesLabel,
    setSelectedCellTypes,
    setSelectedTissue,
    toggleSex,
    setSelectedStrain,
    setSelectedGene,
    setHasTissueSubStructure,
    setSelectedDevStages,
    setDevStageSubStructure,
    setHasCellTypeSubStructure,
    setShow,
    AutoCompleteByType,
    onSubmit,
    resetForm,
    addConditionalParam,
    getSearchParams,
    onToggleExpandCollapse,
  } = useLogic(isExprCalls);

  // DEBUG: remove console log in prod
  // console.log(`[GeneExpressionMatrix] anatomicalTerms:\n${JSON.stringify(anatomicalTerms)}`);

  const [setPageIsBrowseResult] = useState(false);
  const defaultResults = searchResult?.results?.[dataType] || [];
  const resultExprsCall = searchResult?.expressionData?.expressionCalls || [];
  const results = isExprCalls ? resultExprsCall : defaultResults;
  const defaultColumDesc = searchResult?.columnDescriptions?.[dataType] || [];
  const columnDescExprsCall = searchResult?.columnDescriptions || [];
  const columnsDesc = isExprCalls ? columnDescExprsCall : defaultColumDesc;

  const detailedData = TAB_PAGE_EXPR_CALL;

  useEffect(() => {
    const params = getSearchParams();
    if (params?.initSearch?.get('filters_for_all') === '1') {
      setPageIsBrowseResult(true);
    }
  }, [])

  // TODO: use dedicated styling classes?
  return (
    <>
      <div className="rawDataAnnotation">
        <div className="columns is-8 ongletPageWrapper">
          <h1 className="ongletPages pageActive">
            {TAB_PAGE_EXPR_CALL.label}
          </h1>
        </div>

        <div>
          <h2 className="gradient-underline title is-size-5 has-text-primary">
            {detailedData?.searchLabel}
          </h2>
          {show && (
            <>
              <div className="columns is-8">
                <div className="column mr-6">
                  <div className="mb-2 maxWidth50">
                    <Species
                      selectedSpecies={selectedSpecies}
                      onChangeSpecies={onChangeSpecies}
                      getSpeciesLabel={getSpeciesLabel}
                    />
                  </div>
                  {selectedSpecies.value && (
                    <div>
                      <div className="my-2 maxWidth50">
                        <Gene
                          selectedGene={selectedGene}
                          setSelectedGene={setSelectedGene}
                          AutoCompleteByType={AutoCompleteByType}
                        />
                      </div>
                      {((isExprCalls && selectedGene.length > 0) ||
                        !isExprCalls) && (
                        <>
                          <div className="my-2 maxWidth50">
                            <Tissues
                              selectedTissue={selectedTissue}
                              setSelectedTissue={setSelectedTissue}
                              AutoCompleteByType={AutoCompleteByType}
                              hasTissueSubStructure={hasTissueSubStructure}
                              setHasTissueSubStructure={
                                setHasTissueSubStructure
                              }
                              addConditionalParam={addConditionalParam}
                            />
                          </div>
                          <div className="my-2 maxWidth50">
                            <CellTypes
                              selectedCellTypes={selectedCellTypes}
                              setSelectedCellTypes={setSelectedCellTypes}
                              AutoCompleteByType={AutoCompleteByType}
                              hasCellTypeSubStructure={
                                hasCellTypeSubStructure
                              }
                              setHasCellTypeSubStructure={
                                setHasCellTypeSubStructure
                              }
                              addConditionalParam={addConditionalParam}
                            />
                          </div>
                          { false && ( // TODO: display dev stage as condition param?
                          <div className="my-2 maxWidth50">
                            <DevelopmentalAndLifeStages
                              devStages={devStages}
                              hasDevStageSubStructure={
                                hasDevStageSubStructure
                              }
                              setDevStageSubStructure={
                                setDevStageSubStructure
                              }
                              selectedOptions={selectedDevStages}
                              setSelectedOptions={setSelectedDevStages}
                              addConditionalParam={addConditionalParam}
                            />
                          </div>
                          )}
                          { false && ( // TODO: display strain as condition param?
                          <div className="my-2">
                            <Strain
                              selectedStrain={selectedStrain}
                              setSelectedStrain={setSelectedStrain}
                              AutoCompleteByType={AutoCompleteByType}
                              addConditionalParam={addConditionalParam}
                            />
                          </div>
                          )}
                          { false && ( // TODO: display sex as condition param?
                          <div className="my-2">
                            <Sex
                              speciesSexes={speciesSexes}
                              selectedSexes={selectedSexes}
                              toggleSex={toggleSex}
                              addConditionalParam={addConditionalParam}
                            />
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  )}
                </div>
                <div className="column">
                  <div>
                    {(selectedGene.length > 0) && (
                      <>
                        <DataType
                          dataTypes={dataTypesExpCalls}
                          setDataTypes={setDataTypesExpCalls}
                        />
                        { false && ( // TODO: remove permanently?
                        <CallType
                          callTypes={callTypes}
                          setCallTypes={setCallTypes}
                        />
                        )}
                        <hr />
                        <DataQualityParameter
                          dataQuality={dataQuality}
                          setDataQuality={setDataQuality}
                        />
                      </>
                    )}
                    <div className="submit-reinit">
                      <Button
                        className="button is-success is-light is-outlined"
                        type="submit"
                        onClick={onSubmit}
                        disabled={isLoading}
                      >
                        Submit
                      </Button>
                      <Button
                        type="button"
                        className="reinit is-warning is-light is-outlined"
                        onClick={() => resetForm(false)}
                      >
                        Reinitialize
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="control is-flex is-align-items-center">
            <button
              className="button mr-2 mb-5"
              type="button"
              onClick={() => setShow(!show)}
            >
              {show ? 'Hide Form' : 'Show Form'}
            </button>
          </div>

          <p>
            Examples:
            <br />
            <a className="internal-link" href={`${URL_ROOT}/search/expression-matrix?species_id=7227&gene_id=FBgn0030298&gene_id=FBgn0030715&gene_id=FBgn0041626&gene_id=FBgn0023523&gene_id=FBgn0030016&gene_id=FBgn0030204`}>
              Olfactory receptor genes (<i>Drosophila melanogaster</i>)
            </a>
            <br />
            <a className="internal-link" href={`${URL_ROOT}/search/expression-matrix?species_id=9606&gene_id=ENSG00000206172&gene_id=ENSG00000188536&gene_id=ENSG00000244734&gene_id=ENSG00000223609&gene_id=ENSG00000213934&gene_id=ENSG00000196565&gene_id=ENSG00000206177&gene_id=ENSG00000130656`}>
              Hemoglobin genes (<i>Homo sapiens</i>)
            </a>
          </p>

          <h2 className="gradient-underline title is-size-5 has-text-primary">
            {detailedData?.resultLabel}
          </h2>

          <div className="resultPart" style={{ position: 'relative' }}>
            {isLoading && (
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: 'rgba(255, 255, 255, 0.7)',
                zIndex: 10,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <progress
                  className="progress is-small is-primary m-5"
                  style={{
                    animationDuration: '2s',
                    width: '80%',
                  }}
                />
              </div>
            )}

            <GeneExpressionMatrixResults
              results={results}
              columnDescriptions={columnsDesc}
              searchParams={getSearchParams}
              genes={genes}
              anatomicalTerms={anatomicalTerms}
              anatomicalTermsProps={anatomicalTermsProps}
              maxExpScore={maxExpScore}
              onToggleExpandCollapse={onToggleExpandCollapse}
              isLoading={isLoading}
              isFirstSearch={isFirstSearch}
            />
          </div>
          <UserFeedback />
        </div>
      </div>
    </>
  );
};

export default GeneExpressionMatrix;
