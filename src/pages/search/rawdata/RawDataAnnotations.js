/* eslint-disable react/destructuring-assignment */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import Button from '../../../components/Bulma/Button/Button';
import PATHS from '../../../routes/paths';
import './rawDataAnnotations.scss';
import RawDataAnnotationResults from './RawDataAnnotationResults';
import DevelopmentalAndLifeStages from './components/filters/DevelopmentalAndLifeStages/DevelopmentalAndLifeStages';
import Species from './components/filters/Species/Species';
import useLogic, {
  AFFYMETRIX,
  DATA_TYPES,
  EST,
  EXPERIMENTS,
  PROC_EXPR_VALUES,
  RAW_DATA_ANNOTS,
  TAB_PAGE,
  TAB_PAGE_EXPR_CALL,
} from './useLogic';
import CellTypes from './components/filters/CellTypes';
import Tissues from './components/filters/Tissues/Tissues';
import Sex from './components/filters/Sex/Sex';
import Strain from './components/filters/Strain/Strain';
import Gene from './components/filters/Gene/Gene';
import ExperimentOrAssay from './components/filters/ExperimentOrAssay/ExperimentOrAssay';
import RawDataAnnotationsFilters from './RawDataAnnotationsFilters';
import DataType from './components/filters/DataType/DataType';
import ConditionParameter from './components/filters/ConditionParameter';
import ResultTabs from './components/ResultTabs';
import DataQualityParameter from './components/filters/DataQualityParameter';
import CallType from './components/filters/CallType';
import OnlyPropagated from './components/filters/OnlyPropagated/OnlyPropagated';
import config from '../../../config.json';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;
const RawDataAnnotations = ({ isExprCalls = false }) => {
  const {
    searchResult,
    allCounts,
    localCount,
    dataType,
    show,
    devStages,
    hasDevStageSubStructure,
    selectedDevStages,
    selectedSpecies,
    selectedCellTypes,
    hasTissueSubStructure,
    hasCellTypeSubStructure,
    onlyPropagated,
    selectedStrain,
    selectedGene,
    selectedExpOrAssay,
    selectedTissue,
    speciesSexes,
    selectedSexes,
    isLoading,
    filters,
    limit,
    isCountLoading,
    pageNumber,
    pageType,
    dataTypesExpCalls,
    dataQuality,
    conditionalParam2,
    callTypes,
    setCallTypes,
    setConditionalParam2,
    setDataQuality,
    setDataTypesExpCalls,
    setOnlyPropagated,
    onChangeSpecies,
    getSpeciesLabel,
    setSelectedCellTypes,
    setSelectedTissue,
    toggleSex,
    setSelectedStrain,
    setSelectedGene,
    setSelectedExpOrAssay,
    setHasTissueSubStructure,
    setSelectedDevStages,
    setDevStageSubStructure,
    setHasCellTypeSubStructure,
    setDataType,
    setShow,
    AutoCompleteByType,
    onSubmit,
    resetForm,
    setFilters,
    triggerSearch,
    triggerCounts,
    setPageType,
    addConditionalParam,
    getSearchParams,
  } = useLogic(isExprCalls);

  const loc = useLocation();
  const [pageIsBrowseResult, setPageIsBrowseResult] = useState(false);
  const defaultResults = searchResult?.results?.[dataType] || [];
  const resultExprsCall = searchResult?.expressionData?.expressionCalls || [];
  const results = isExprCalls ? resultExprsCall : defaultResults;
  const defaultColumDesc = searchResult?.columnDescriptions?.[dataType] || [];
  const columnDescExprsCall = searchResult?.columnDescriptions || [];
  const columnsDesc = isExprCalls ? columnDescExprsCall : defaultColumDesc;

  const defaultdataFilters = searchResult?.filters?.[dataType] || {};
  const dataFiltersExprCall = searchResult?.filters || {};
  const dataFilters = isExprCalls ? dataFiltersExprCall : defaultdataFilters;

  const countResultKey = () => {
    if (pageType === EXPERIMENTS)
      return 'experimentCount';
    if (pageType === PROC_EXPR_VALUES)
      return 'callCount';
    // Return AssayCount if pageType==RAW_DATA_ANNOTS or pageType==EXPR_CALLS
    return 'assayCount';
  }

  const maxPage = Math.ceil((localCount?.[countResultKey()] || 0) / limit);

  const detailedData = isExprCalls
    ? TAB_PAGE_EXPR_CALL
    : TAB_PAGE.find((d) => d.id === pageType);

  useEffect(() => {
    const params = getSearchParams();
    if (params?.initSearch?.get('filters_for_all') === '1') {
      setPageIsBrowseResult(true);
    }
  }, [])

  const changePageType = (e, newPageType) => {
    e.preventDefault();
    e.stopPropagation();
    setPageIsBrowseResult(false);
    setPageType(newPageType);
  };

  const formatLargeNumber = (largeNumber) => {
    const numberToDisplay = new Intl.NumberFormat('en').format(largeNumber || 0);
    return numberToDisplay;
  };

  const resultCountLabel = useMemo(() => {
    switch (pageType) {
      case EXPERIMENTS:
        return `${formatLargeNumber(localCount.experimentCount)} ${
          dataType === EST ? 'libraries' : 'experiments'
        }`;
      case RAW_DATA_ANNOTS: {
        if (dataType === EST) {
          return `${formatLargeNumber(localCount.assayCount)} libraries`;
        }
        return `${formatLargeNumber(localCount.experimentCount)} experiments / ${
          formatLargeNumber(localCount.assayCount)
        } ${dataType === AFFYMETRIX ? 'chips' : 'assays'}`;
      }
      case PROC_EXPR_VALUES: {
        if (dataType === EST) {
          return `${formatLargeNumber(localCount.assayCount)} libraries / ${
            formatLargeNumber(localCount.callCount)
          } gene expression values`;
        }
        return `${formatLargeNumber(localCount.experimentCount)} experiments / ${
          formatLargeNumber(localCount.assayCount)
        } ${dataType === AFFYMETRIX ? 'chips' : 'assays'} / ${
          formatLargeNumber(localCount.callCount)
        } gene expression values`;
      }
      default:
        return '';
    }
  }, [pageType, localCount, dataType]);

  const parameterFromForm = (() => {
    // When the user right-click and 'open new' we need to pass only the parameter from the form, not those from the filters
    const params = getSearchParams();
    let urlParamsWithoutPageType = '';
    if (params.dataType) {
      urlParamsWithoutPageType += `&data_type=${params.dataType}`;
    }
    if (params.selectedSpecies) {
      urlParamsWithoutPageType += `&species_id=${params.selectedSpecies}`;
    }
    params.selectedGene.forEach(gene => {
      urlParamsWithoutPageType += `&gene_id=${gene}`;
    });
    params.selectedTissue.forEach(tissue => {
      urlParamsWithoutPageType += `&anat_entity_id=${tissue}`;
    });
    params.selectedCellTypes.forEach(cell => {
      urlParamsWithoutPageType += `&cell_type_id=${cell}`;
    });
    params.selectedDevStages.forEach(stage => {
      urlParamsWithoutPageType += `&stage_id=${stage}`;
    });
    params.selectedStrain.forEach(strain => {
      urlParamsWithoutPageType += `&strain=${strain}`;
    });
    params.selectedExpOrAssay.forEach(expOrAssay => {
      urlParamsWithoutPageType += `&exp_assay_id=${expOrAssay}`;
    });
    params.selectedSexes.forEach(sexe => {
      urlParamsWithoutPageType += `&sex=${sexe}`;
    });
    urlParamsWithoutPageType += `&anat_entity_descendant=${params.hasTissueSubStructure}`;
    urlParamsWithoutPageType += `&cell_type_descendant=${params.hasCellTypeSubStructure}`;
    urlParamsWithoutPageType += `&stage_descendant=${params.hasDevStageSubStructure}`;
    urlParamsWithoutPageType += `&only_propagated=${params.onlyPropagated}`;

    return urlParamsWithoutPageType;
  });

  const parameterInCurrentUrlWithoutPageType = (() => {
    const params = new URLSearchParams( loc.search );
    params.delete('pageType');
    if (params) {
      return `&${params.toString()}`;
    }
    return '';
  });

  const filterForAllParameter = (() => {
    if (pageIsBrowseResult) {
      return "&filters_for_all=1";
    }
    return '';
  });

  return (
    <>
      <div className="rawDataAnnotation">
        <div className="columns is-8 ongletPageWrapper">
          {isExprCalls ? (
            <h1 className="ongletPages pageActive">
              {TAB_PAGE_EXPR_CALL.label}
            </h1>
          ) : (
            TAB_PAGE.map((type) => {
              const isActive = type.id === pageType;
              return (
                <h1>
                  <a
                    onClick={(e) => changePageType(e, type.id)}
                    href={`${URL_ROOT}/search/raw-data?pageType=${type.id}${isActive ? filterForAllParameter() : ''}${isActive ? parameterInCurrentUrlWithoutPageType() : parameterFromForm()}`}
                    key={type.id}
                    className={`ongletPages is-centered py-2 px-5 ${
                      isActive ? 'pageActive' : ''
                    }`}
                  >
                    {type.label}
                  </a>
                </h1>

              );
            })
          )}
        </div>
        {pageType && (
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
                            <div className="my-2">
                              <Strain
                                selectedStrain={selectedStrain}
                                setSelectedStrain={setSelectedStrain}
                                AutoCompleteByType={AutoCompleteByType}
                                addConditionalParam={addConditionalParam}
                                selectedSpecies={selectedSpecies.value}
                              />
                            </div>
                            <div className="my-2">
                              <Sex
                                speciesSexes={speciesSexes}
                                selectedSexes={selectedSexes}
                                toggleSex={toggleSex}
                                addConditionalParam={addConditionalParam}
                              />
                            </div>
                            {(!isExprCalls) && (
                              <>
                                <div className="my-2">
                                  <OnlyPropagated
                                    onlyPropagated={onlyPropagated}
                                    setOnlyPropagated={setOnlyPropagated}
                                  />
                                </div>
                              </>
                            )}
                          </>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="column">
                    <div>
                      {isExprCalls ? (
                        <>
                          {((isExprCalls && selectedGene.length > 0) ||
                            !isExprCalls) && (
                            <>
                              <DataType
                                dataTypes={dataTypesExpCalls}
                                setDataTypes={setDataTypesExpCalls}
                              />
                              <hr />
                              <ConditionParameter
                                conditionalParam2={conditionalParam2}
                                setConditionalParam2={setConditionalParam2}
                                selectedSpecies={selectedSpecies.value}
                              />
                              <hr />
                              <CallType
                                callTypes={callTypes}
                                setCallTypes={setCallTypes}
                              />
                              <hr />
                              <DataQualityParameter
                                dataQuality={dataQuality}
                                setDataQuality={setDataQuality}
                              />
                            </>
                          )}
                        </>
                      ) : (
                        <div className="mb-2 maxWidth50">
                          <ExperimentOrAssay
                            selectedExpOrAssay={selectedExpOrAssay}
                            setSelectedExpOrAssay={setSelectedExpOrAssay}
                            AutoCompleteByType={AutoCompleteByType}
                          />
                        </div>
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
                        <a className="reinit button is-bgee-link is-outlined mr-2"
                          href={isExprCalls ? `${PATHS.SUPPORT.TUTORIAL_EXPRESSION_CALLS}` : `${PATHS.SUPPORT.TUTORIAL_RAW_DATA}`}
                        >
                          Documentation
                        </a>
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
            <h2 className="gradient-underline title is-size-5 has-text-primary">
              {detailedData?.resultLabel}
            </h2>
            {!isExprCalls && (
              <ResultTabs
                dataTypes={DATA_TYPES}
                dataType={dataType}
                setDataType={setDataType}
                allCounts={allCounts}
                pageType={pageType}
                isCountLoading={isCountLoading}
                localCount={localCount}
              />
            )}
            <div className="resultPart">
              {isLoading ? (
                <div className="progressWrapper is-justify-content-flex-end">
                  <progress
                    className="progress is-small is-primary"
                    style={{
                      animationDuration: '2s',
                      width: '10%',
                    }}
                  />
                </div>
              ) : (
                <div className="resultCounts">
                  {isExprCalls ? (
                    <>{`${formatLargeNumber(localCount?.assayCount)} expression calls`}</>
                  ) : (
                    resultCountLabel
                  )}
                </div>
              )}
              {!!searchResult && dataType && (
                <RawDataAnnotationsFilters
                  dataFilters={dataFilters}
                  dataType={dataType}
                  filters={filters}
                  setFilters={setFilters}
                  triggerSearch={triggerSearch}
                  triggerCounts={triggerCounts}
                />
              )}
              {isLoading ? (
                <div className="progressWrapper">
                  <progress
                    className="progress is-small is-primary m-5"
                    style={{
                      animationDuration: '2s',
                      width: '80%',
                    }}
                  />
                </div>
              ) : (
                <RawDataAnnotationResults
                  results={results}
                  resultCount={allCounts[dataType]}
                  dataType={dataType}
                  maxPage={maxPage}
                  columnDescriptions={columnsDesc}
                  pageType={pageType}
                  pageNumber={pageNumber}
                  isExprCalls={isExprCalls}
                  searchParams={getSearchParams}
                />
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default RawDataAnnotations;
