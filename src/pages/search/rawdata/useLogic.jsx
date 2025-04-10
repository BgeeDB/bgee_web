/* eslint-disable no-unused-expressions */
/* eslint-disable consistent-return */
/* eslint-disable no-use-before-define */
import { useState, useEffect, useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import api from '../../../api';
import { getGeneLabel } from '../../../helpers/gene';
import {
  getIdAndNameLabel,
  getOptionsForFilter,
} from '../../../helpers/selects';
import { flattenDevStagesList } from './components/filters/DevelopmentalAndLifeStages/useLogic';
import { EMPTY_SPECIES_VALUE } from './components/filters/Species/Species';
import config from '../../../config.json';
import { FULL_LENGTH_LABEL } from '../../../api/prod/constant';
import { isEmpty } from '../../../helpers/arrayHelper';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;

// building the page_type array depending on config.json
export const EXPERIMENTS = 'experiments';
export const RAW_DATA_ANNOTS = 'raw_data_annots';
export const PROC_EXPR_VALUES = 'proc_expr_values';
export const EXPR_CALLS = 'expr_calls';

export const TAB_PAGE = [
  {
    id: EXPERIMENTS,
    label: 'Experiments',
    searchLabel: 'Search for Experiments',
    resultLabel: 'Experiments',
  },
  {
    id: RAW_DATA_ANNOTS,
    label: 'Raw data annotations',
    searchLabel: 'Search for Raw data annotations',
    resultLabel: 'Raw data annotations results',
  },
  {
    id: PROC_EXPR_VALUES,
    label: 'Processed expression values',
    searchLabel: 'Search for Processed expression values',
    resultLabel: 'Processed expression values results',
  },
];

export const TAB_PAGE_EXPR_CALL = {
  id: EXPR_CALLS,
  label: 'Present/absent expression calls',
  searchLabel: 'Search for present/absent expression calls',
  resultLabel: 'Present/absent expression calls',
};

// building dataTypes depending on config.json
export const AFFYMETRIX = 'AFFYMETRIX';
export const EST = 'EST';
export const IN_SITU = 'IN_SITU';
export const RNA_SEQ = 'RNA_SEQ';
export const { ID_FULL_LENGTH } = config.dataTypeIds;

const dataTypeConf = [
  {
    position: config.dataType_RNA_SEQ,
    type: {
      id: RNA_SEQ,
      label: 'bulk RNA-Seq',
      sourceLetter: 'R',
    },
  },
  {
    position: config.dataType_FULL_LENGTH,
    type: {
      id: ID_FULL_LENGTH,
      label: FULL_LENGTH_LABEL,
      sourceLetter: config.dataTypeSourceLetter.SL_FULL_LENGTH,
    },
  },
  {
    position: config.dataType_AFFYMETRIX,
    type: {
      id: AFFYMETRIX,
      label: 'Affymetrix data',
      sourceLetter: 'A',
    },
  },
  {
    position: config.dataType_IN_SITU,
    type: {
      id: IN_SITU,
      label: 'In situ hybridization',
      sourceLetter: 'I',
    },
  },
  {
    position: config.dataType_EST,
    type: {
      id: EST,
      label: 'EST',
      sourceLetter: 'E',
    },
  },
];
const sortedDataTypes = dataTypeConf
  .filter((t) => !!t.position)
  .sort((a, b) => a.position - b.position)
  .map((data) => data.type);
export const DATA_TYPES = sortedDataTypes;
export const ALL_DATA_TYPES = dataTypeConf.map((data) => data.type);
export const ALL_DATA_TYPES_ID = ALL_DATA_TYPES.map((d) => d.id);
const BRONZE = 'BRONZE';
const SILVER = 'SILVER';
const GOLD = 'GOLD';
export const ALL_DATA_QUALITIES = [
  { id: BRONZE, label: 'Bronze' },
  { id: SILVER, label: 'Silver' },
  { id: GOLD, label: 'Gold' },
];
export const COND_PARAM2_ANAT_KEY = 'anat_entity';
export const COND_PARAM2_DEVSTAGE_KEY = 'dev_stage';
export const COND_PARAM2_SEX_KEY = 'sex';
export const COND_PARAM2_STRAIN_KEY = 'strain';
export const COND_PARAM2 = [
  {
    id: COND_PARAM2_ANAT_KEY,
    label: 'Anatomical localization',
  },
  {
    id: COND_PARAM2_DEVSTAGE_KEY,
    label: 'Development and life stage',
  },
  {
    id: COND_PARAM2_SEX_KEY,
    label: 'Sex',
  },
  {
    id: COND_PARAM2_STRAIN_KEY,
    label: 'Strain',
  },
];

export const EXPRESSED = 'EXPRESSED';
export const NOT_EXPRESSED = 'NOT_EXPRESSED';
export const ALL_CALL_TYPE = [
  { id: EXPRESSED, label: 'Present' },
  { id: NOT_EXPRESSED, label: 'Absent' },
];

const BASE_PAGE_NUMBER = '1';
const BASE_LIMIT = '50';

const useLogic = (isExprCalls) => {
  const history = useHistory();
  // Init from URL
  const loc = useLocation();
  const initSearch = new URLSearchParams(loc.search);
  const initHash = initSearch.get('data');
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  const initDataType = initSearch.get('data_type') || DATA_TYPES[0].id;
  const initDataTypeExpCalls = initSearch.getAll('data_type') || ALL_DATA_TYPES_ID;
  const initLimit = initSearch.get('limit') || BASE_LIMIT;
  const initPageNumber = initSearch.get('pageNumber') || BASE_PAGE_NUMBER;
  const initPageType = initSearch.get('pageType') || EXPERIMENTS;

  // Page Type / Data Type
  // Page type = data in search params !
  const [pageType, setPageType] = useState(
    isExprCalls ? EXPR_CALLS : initPageType
  );
  const [dataType, setDataType] = useState(initDataType);
  const [dataTypesExpCalls, setDataTypesExpCalls] =
    useState(initDataTypeExpCalls);

  // lists
  const [speciesSexes, setSpeciesSexes] = useState([]);
  const [devStages, setDevStages] = useState([]);

  // Form
  const [selectedSpecies, setSelectedSpecies] = useState(EMPTY_SPECIES_VALUE);
  const [selectedTissue, setSelectedTissue] = useState([]);
  const [selectedStrain, setSelectedStrain] = useState([]);
  const [selectedCellTypes, setSelectedCellTypes] = useState([]);
  const [selectedGene, setSelectedGene] = useState([]);
  const [selectedSexes, setSelectedSexes] = useState([]);
  const [selectedExpOrAssay, setSelectedExpOrAssay] = useState([]);
  const [selectedDevStages, setSelectedDevStages] = useState([]);
  const [hasCellTypeSubStructure, setHasCellTypeSubStructure] = useState(true);
  const [hasTissueSubStructure, setHasTissueSubStructure] = useState(true);
  const [hasDevStageSubStructure, setDevStageSubStructure] = useState(true);
  const [onlyPropagated, setOnlyPropagated] = useState(true);
  const [dataQuality, setDataQuality] = useState(BRONZE);
  const [callTypes, setCallTypes] = useState([NOT_EXPRESSED, EXPRESSED]);
  const [conditionalParam2, setConditionalParam2] = useState([
    COND_PARAM2_ANAT_KEY,
    COND_PARAM2_DEVSTAGE_KEY,
    COND_PARAM2_SEX_KEY,
    COND_PARAM2_STRAIN_KEY,
  ]);

  // results
  const [isLoading, setIsLoading] = useState(false);
  const [isCountLoading, setIsCountLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [searchResult, setSearchResult] = useState(null);
  // Store all counts per dataType
  const [allCounts, setAllCounts] = useState({});
  // Store only the count of the current DataType ( to match the filters)
  const [localCount, setLocalCount] = useState({});
  const [limit, setLimit] = useState(initLimit);
  const [pageNumber, setPageNumber] = useState(initPageNumber);

  // filters
  const [filters, setFilters] = useState({});

  // Will determine if the User clicked on a link to come on Raw-Data page even though he is already on it
  // The page will reset to it default state
  const [needToResetThePage, setNeedToResetThePage] = useState(false);


  const [pageCanLoadFirstCount, setPageCanLoadFirstCount] = useState(false);

  useEffect(() => {
    const sp = new URLSearchParams(loc.search);
    const nextLimit = sp.get('limit');
    const nextPageNumber = sp.get('pageNumber');
    if (nextLimit !== null) {
      setLimit(nextLimit);
    }
    if (nextPageNumber) {
      setPageNumber(nextPageNumber);
    } else {
      setPageNumber(1);
    }

    // If we are already on the Raw-Data page and we try to access it again in the Header all the search variables will be cleared.
    // If there is no search variable we set back the page to it default state.
    if(!loc.search && !isFirstSearch && !isLoading){
      resetForm(false, true);
    }

  }, [loc.search]);

  useEffect(() => {
    if (needToResetThePage) {
      // We set FirstSearch at TRUE so we don't trigger all the useEffect that checks for it
      setIsFirstSearch(true);
      setDataType(initDataType);
      setDataTypesExpCalls(initDataTypeExpCalls);
      setPageType(isExprCalls ? EXPR_CALLS : initPageType);

      setIsFirstSearch(false);
      setLocalCount({});
      triggerCounts();
      triggerSearch(true, true);

      setNeedToResetThePage(false);
    }
  }, [needToResetThePage]);

  useEffect(() => {
    if (pageCanLoadFirstCount) {
      triggerCounts(false, true);
    }
  }, [pageCanLoadFirstCount])

  const onChangeSpecies = (newSpecies) => {
    setSelectedSpecies(newSpecies);
    setSelectedCellTypes([]);
    setSelectedGene([]);
    setSelectedStrain([]);
    setSelectedTissue([]);
    setSelectedSexes([]);
  };

  useEffect(() => {
    if (!isFirstSearch) {
      triggerSearch();
    }
  }, [pageNumber, limit]);

  useEffect(() => {
    triggerSearch();
    setIsCountLoading(true);

    // Allow to detect a browser back btn pressed and force all the worflow to work again by forcing reload @ugly
    history.listen(() => {
      if (history.action === 'POP') {
        // eslint-disable-next-line no-restricted-globals
        location.reload();
      }
    });
  }, []);

  useEffect(() => {
    if (!isFirstSearch && !isExprCalls) {
      setLocalCount({});
      triggerSearch(false, false);
    }
  }, [dataType]);

  useEffect(() => {
    if (!isFirstSearch) {
      setLocalCount({});
      triggerSearch(true, true);
      triggerCounts();
    }
  }, [pageType]);

  useEffect(() => {
    if (selectedSpecies.value !== EMPTY_SPECIES_VALUE.value) {
      getSexesAndDevStageForSpecies();
      resetForm(true);
    }
  }, [selectedSpecies]);

  const onSubmit = () => {
    triggerSearch(true, true);
    triggerCounts();
  };

  const addConditionalParam = (id) => {
    const indexOfValue = conditionalParam2.indexOf(id);
    if (indexOfValue === -1) {
      setConditionalParam2([...conditionalParam2, id]);
    }
  };

  const initFormFromDetailedRP = (resp) => {
    const { requestParameters, data } = resp;
    const { requestDetails } = data;

    // Data type
    const nextDataType = requestParameters.data_type[0];
    setDataType(nextDataType);

    // Species
    if (requestDetails?.requestedSpecies) {
      setSelectedSpecies({
        label: getSpeciesLabel(requestDetails?.requestedSpecies),
        value: requestDetails?.requestedSpecies?.id,
      });
    }

    // Sexes
    // Possible sexes
    if (requestDetails?.requestedSpeciesSexes?.length > 0) {
      setSpeciesSexes(requestDetails?.requestedSpeciesSexes);
    }
    // Selected sexes
    if (
      requestParameters?.sex?.length > 0 &&
      requestParameters?.sex[0] !== 'all'
    ) {
      setSelectedSexes(requestParameters?.sex);
    }

    // Genes
    if (requestDetails?.requestedGenes?.length > 0) {
      const initGenes = requestDetails?.requestedGenes.map((g) => ({
        label: getGeneLabel(g),
        value: g.geneId,
      }));
      setSelectedGene(initGenes);
    }

    // Tissues (anatEntities)
    const cellTypesAndTissues =
      requestDetails?.requestedAnatEntitesAndCellTypes || [];
    if (requestParameters?.anat_entity_id?.length > 0) {
      const initTissues = [];
      requestParameters?.anat_entity_id.forEach((tissueId) => {
        const foundTissue = cellTypesAndTissues.find((t) => t.id === tissueId);
        if (foundTissue) {
          initTissues.push({
            label: getIdAndNameLabel(foundTissue),
            value: tissueId,
          });
        }
      });
      setSelectedTissue(initTissues);
    }

    // Cell types
    if (requestParameters?.cell_type_id?.length > 0) {
      const initCelleTypes = [];
      requestParameters?.cell_type_id.forEach((cellTypeId) => {
        const foundCellType = cellTypesAndTissues.find(
          (t) => t.id === cellTypeId
        );
        if (foundCellType) {
          initCelleTypes.push({
            label: getIdAndNameLabel(foundCellType),
            value: cellTypeId,
          });
        }
      });
      setSelectedCellTypes(initCelleTypes);
    }

    // Dev Stage
    if (requestParameters?.stage_id?.length > 0) {
      const initDevStage = [];
      const flattenedList = flattenDevStagesList(
        requestDetails?.requestedSpeciesDevStageOntology
      );
      requestParameters?.stage_id.forEach((devStageId) => {
        const foundDevStage = flattenedList.find((t) => t.id === devStageId);
        if (foundDevStage) {
          initDevStage.push({
            label: getIdAndNameLabel(foundDevStage),
            value: devStageId,
          });
        } else {
          initDevStage.push({
            label: devStageId,
            value: devStageId,
          });
        }
      });
      setSelectedDevStages(initDevStage);
    }

    // Strain
    if (requestParameters?.strain?.length > 0) {
      setSelectedStrain(
        requestParameters?.strain.map((s) => ({ value: s, label: s }))
      );
    }

    // Exp or Assay ID
    if (requestParameters?.exp_assay_id?.length > 0) {
      const initExpOrAssay = [];
      requestParameters?.exp_assay_id.forEach((expOrAssayId) => {
        const foundExpOrAssay =
          requestDetails?.requestedExperimentAndAssays?.find(
            (t) => t.id === expOrAssayId
          );
        if (foundExpOrAssay) {
          initExpOrAssay.push({
            label: getIdAndNameLabel(foundExpOrAssay),
            value: expOrAssayId,
          });
        }
      });
      setSelectedExpOrAssay(initExpOrAssay);
    }

    // SubStructures
    setHasTissueSubStructure(true);
    setHasCellTypeSubStructure(true);
    setDevStageSubStructure(true);
    setOnlyPropagated(isExprCalls);
    if (requestParameters?.anat_entity_descendant === 'false')
      setHasTissueSubStructure(false);
    if (requestParameters?.cell_type_descendant === 'false')
      setHasCellTypeSubStructure(false);
    if (requestParameters?.stage_descendant === 'false')
      setDevStageSubStructure(false);
    if (requestParameters?.only_propagated === 'true')
      setOnlyPropagated(true);

    // Filters
    const filtersToCheck =
      (isExprCalls ? data?.filters : data?.filters?.[nextDataType]) || {};
    const searchParams = new URLSearchParams(requestParameters);
    const initFilters = {};
    // eslint-disable-next-line no-unused-vars
    Object.entries(filtersToCheck).forEach(([_, f]) => {
      const ids = searchParams.getAll(f.urlParameterName);
      const nextValues = f.values.filter((v) => ids.includes(v.id));

      const nextValuesMapped = getOptionsForFilter(
        nextValues,
        f?.informativeId,
        f?.informativeName
      );
      initFilters[f.urlParameterName] = nextValuesMapped;
    });

    const currentSP = new URLSearchParams(loc?.search);
    const applyFilterForAllDataTypes = currentSP.get('filters_for_all');

    if (applyFilterForAllDataTypes === '1') {
      setFilters({
        [ID_FULL_LENGTH]: initFilters,
        [RNA_SEQ]: initFilters,
        [AFFYMETRIX]: initFilters,
        [EST]: initFilters,
        [IN_SITU]: initFilters,
      });
    } else {
      setFilters({ [nextDataType]: initFilters });
    }

    if (isExprCalls) {
      // Call types
      if (requestParameters?.expr_type?.length > 0) {
        setCallTypes(requestParameters?.expr_type);
      }

      // data_type expres calls
      if (requestParameters?.data_type?.length > 0) {
        setDataTypesExpCalls(requestParameters?.data_type);
      }

      // Data quality
      if (requestParameters?.data_qual?.length > 0) {
        setDataQuality(requestParameters?.data_qual);
      }

      // Conditonal parameter 2
      if (requestParameters?.cond_param2?.length > 0) {
        setConditionalParam2(requestParameters?.cond_param2);
      }
    }

    setPageCanLoadFirstCount(true);
  };

  const getSearchParams = () => {
    let params = {
      hash: initHash,
      isFirstSearch,
      initSearch,
      pageType,
      dataType: [dataType],
      selectedExpOrAssay: selectedExpOrAssay.map((exp) => exp.value),
      selectedSpecies: selectedSpecies.value,
      selectedCellTypes: selectedCellTypes.map((ct) => ct.value),
      selectedGene: selectedGene.map((g) => g.value),
      selectedStrain: selectedStrain.map((s) => s.value),
      selectedTissue: selectedTissue.map((t) => t.value),
      selectedDevStages: selectedDevStages.map((ds) => ds.value),
      selectedSexes: selectedSexes.length > 0 ? selectedSexes : ['all'],
      hasCellTypeSubStructure,
      hasDevStageSubStructure,
      hasTissueSubStructure,
      onlyPropagated,
      pageNumber,
      limit,
    };

    // Here we are filtering the filters themself
    // We don't send to the backend the filters that have no corresponding list in the filters object from last research
    const defaultdataFilters = searchResult?.filters?.[dataType] || {};
    const dataFiltersExprCall = searchResult?.filters || {};
    const dataFilters = isExprCalls ? dataFiltersExprCall : defaultdataFilters;
    const wantedFilters = filters[dataType] || {};
    // ( if there is any filters that have been set before )
    if (!isEmpty(dataFilters)) {
      const myFilters = {};
      Object.entries(wantedFilters)
        .filter(([wantedFilterKey]) => {
          const filterExists = Object.entries(dataFilters).some(
            ([, existingFilter]) =>
              wantedFilterKey === existingFilter?.urlParameterName
          );
          return filterExists;
        })
        .forEach(([key, values]) => {
          myFilters[key] = values;
        });

      params.filters = myFilters;
    } else {
      params.filters = filters[dataType];
    }
    if (isExprCalls) {
      const dataTypeForExpCalls =
        dataTypesExpCalls.length === 0 ? ALL_DATA_TYPES_ID : dataTypesExpCalls;
      params.dataType = dataTypeForExpCalls;
      params = {
        ...params,
        dataQuality,
        callTypes,
        conditionalParam2,
        isExprCalls,
      };
    }
    return params;
  };

  const triggerSearch = async (
    cleanFilters = false,
    cleanPagination = false
  ) => {
    const params = getSearchParams();
    if (cleanPagination) {
      params.pageNumber = BASE_PAGE_NUMBER;
      params.limit = BASE_LIMIT;
    }
    if (cleanFilters) {
      params.filters = {};
      setFilters({});
    }
    setIsLoading(true);
    return api.search.rawData
      .search(params, false)
      .then(({ resp, paramsURLCalled }) => {
        if (resp.code === 200) {
          // After First search ( => hash !== null ) we update the filters via detailed_rp
          if (isFirstSearch) {
            try {
              initFormFromDetailedRP(resp);
            } catch (e) {
              console.error('Error when parsing URL e = ', e);
            }
          }

          // "Mirroring" management in URL's parameter (with & without hash)
          const searchParams = new URLSearchParams(paramsURLCalled);
          // If there is a hash we put it in the URL
          // And as all next data are "coded" in the Hash...
          // We can clear the URL from those (aka storableParams)
          const newHash = resp?.requestParameters?.data;
          if (newHash) {
            // We delete the potential old hash
            searchParams.delete('data');

            resp?.requestParameters?.storableParameters?.forEach((key) => {
              if (key !== 'data_type') {
                searchParams.delete(key);
              }
            });

            // Adding Hash (in "data" key)
            searchParams.append('data', newHash);
          }

          // We can always clean those "tech" parameters from the URL
          searchParams.delete('display_type');
          searchParams.delete('page');
          searchParams.delete('action');
          searchParams.delete('get_results');
          searchParams.delete('get_column_definition');
          searchParams.delete('get_filters');
          searchParams.delete('display_rp');
          searchParams.delete('detailed_rp');
          searchParams.delete('offset');
          searchParams.delete('get_result_count');
          searchParams.delete('filters_for_all');

          // The following code clean the url of any default value
          if (searchParams.get('limit') === '50') {
            searchParams.delete('limit');
          }
          if (searchParams.get('pageType') === 'experiments') {
            searchParams.delete('pageType');
          }
          if (searchParams.get('pageNumber') === '1') {
            searchParams.delete('pageNumber');
          }
          if (searchParams.get('sex') === 'all') {
            searchParams.delete('sex');
          }
          if (searchParams.get('cell_type_descendant') === 'true') {
            searchParams.delete('cell_type_descendant');
          }
          if (searchParams.get('stage_descendant') === 'true') {
            searchParams.delete('stage_descendant');
          }
          if (searchParams.get('anat_entity_descendant') === 'true') {
            searchParams.delete('anat_entity_descendant');
          }
          if (searchParams.get('only_propagated') === 'false') {
            searchParams.delete('only_propagated');
          }
          if (isFirstSearch) {
            history.replace({
              search: searchParams.toString(),
              pathname: `${URL_ROOT}${loc.pathname}`,
            });
          } else {
            history.push({
              search: searchParams.toString(),
              pathname: `${URL_ROOT}${loc.pathname}`,
            });
          }
        }

        // The search form will be collapsed if this is not the first time we're on the page
        if (!isFirstSearch) {
          setShow(false);
        }

        // Finally, we set the values we are interested in
        setIsLoading(false);
        setSearchResult(resp?.data);
        setLocalCount(
          isExprCalls
            ? { assayCount: resp?.data?.expressionCallCount }
            : resp?.data?.resultCount?.[dataType]
        );
      })
      .catch(() => {
        // We remove all the parameters that we may have sent
        history.replace(`${URL_ROOT}${loc.pathname}`);
        setIsLoading(false);
      })
      .finally(() => {
        // The next searches will not be considered as the first
        // --> Filters will now be used for the next requests
        setIsFirstSearch(false);
      });
  };

  const triggerCounts = async (
    cleanFilters = false,
    bypassInitSearchParam = false
  ) => {
    const params = getSearchParams();
    if (cleanFilters) {
      params.filters = {};
      setFilters({});
    }

    if (!isExprCalls) {
      setIsCountLoading(true);
      api.search.rawData
        .search(params, true, bypassInitSearchParam)
        .then(({ resp }) => {
          if (resp.code === 200) {
            setIsCountLoading(false);
            setAllCounts(resp?.data?.resultCount);
          }
        })
        .catch(() => {
          // gene not found or some errors !
          setIsCountLoading(false);
          setAllCounts({});
        });
    }
  };

  const getSexesAndDevStageForSpecies = () => {
    api.search.species
      .speciesDevelopmentSexe(selectedSpecies.value)
      .then((resp) => {
        if (resp.code === 200) {
          setSpeciesSexes(resp.data?.requestDetails?.requestedSpeciesSexes);
          setDevStages(
            resp.data?.requestDetails?.requestedSpeciesDevStageOntology
          );
        } else {
          setSpeciesSexes([]);
        }
      });
  };

  const AutoCompleteByType = (type, mappingFn) =>
    useCallback(
      async (query) => {
        if (query) {
          return api.search.genes
            .AutoCompleteByType(type, query, selectedSpecies.value)
            .then((resp) => {
              if (resp.code === 200) {
                const results =
                  resp.data.result.searchMatches ||
                  resp.data.result.geneMatches;
                let list = [];
                list = results.map(mappingFn);
                return list;
              }
              return [];
            });
        }
        console.warn('Empty species or query !');
        return [];
      },
      [selectedSpecies.value]
    );

  const getSpeciesLabel = (specie) => {
    if (specie.name !== '') {
      return `${specie.genus} ${specie.speciesName} - ${specie.name}`;
    }
    return `${specie.genus} ${specie.speciesName}`;
  };

  const toggleSex = (sexName) => {
    const i = selectedSexes.indexOf(sexName);
    // Edge case where "all" is set
    if (selectedSexes.length === 1 && selectedSexes[0] === 'all') {
      setSelectedSexes([sexName]);
    }

    if (i === -1) {
      setSelectedSexes([...selectedSexes, sexName]);
    } else {
      const nextSexes = [...selectedSexes];
      nextSexes.splice(i, 1);
      setSelectedSexes(nextSexes);
    }
  };

  const resetForm = (isSpeciesChange = false, pageWillBeReset = false) => {
    setSelectedCellTypes([]);
    setSelectedGene([]);
    setSelectedStrain([]);
    setSelectedTissue([]);
    setSelectedSexes([]);
    setSelectedDevStages([]);
    setHasCellTypeSubStructure(true);
    setHasTissueSubStructure(true);
    setDevStageSubStructure(true);
    setOnlyPropagated(isExprCalls);
    if (!isSpeciesChange) {
      setSelectedSpecies(EMPTY_SPECIES_VALUE);
      setSelectedExpOrAssay([]);
    }
    if (pageWillBeReset) {
      setNeedToResetThePage(true);
    }
  };

  return {
    searchResult,
    allCounts,
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
    localCount,
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
    setPageType,
    setFilters,
    setIsLoading,
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
    setOnlyPropagated,
    setDataType,
    setShow,
    AutoCompleteByType,
    onSubmit,
    resetForm,
    triggerSearch,
    triggerCounts,
    addConditionalParam,
    getSearchParams,
  };
};

export default useLogic;
