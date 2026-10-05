import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router';

import api from '../../../api';
import { getGeneLabel } from '../../../helpers/gene';
import { getIdAndNameLabel, getOptionsForFilter } from '../../../helpers/selects';
import { flattenDevStagesList } from './components/filters/DevelopmentalAndLifeStages/useLogic';
import { EMPTY_SPECIES_VALUE } from './components/filters/Species/Species';
import config from '../../../config.json';
import { FULL_LENGTH_LABEL } from '../../../api/prod/constant';
import { URL_ROOT } from '~/helpers/constants';
// DEBUG: remove in PROD
// import maxExpScoreCsv from '../../../assets/maxExpScore.csv'

// to workaround backend server issues
// import apiResp1 from '../../../assets/response_query1.INS.json';
// import apiResp2 from '../../../assets/response_query2.INS.json';

// TODO: create an API endpoint to query root terms for condition params?
export const ROOT_TERM_ANAT_ENTITY = 'UBERON:0001062-GO:0005575';
const CELL_TYPE_ROOT_ID = 'GO:0005575';

const getCallAnatIds = (call) => {
  const anats = call.multiSpeciesCondition?.anatEntities;
  if (Array.isArray(anats) && anats.length > 0) {
    return anats.map((a) => a.id).filter(Boolean);
  }
  const id = call.condition?.anatEntity?.id;
  return id ? [id] : [];
};

const isCellTypeRootCall = (call) => {
  const cellTypes = call.multiSpeciesCondition?.cellTypes;
  if (Array.isArray(cellTypes)) {
    return cellTypes.length === 0 || cellTypes.every((ct) => !ct?.id || ct.id === CELL_TYPE_ROOT_ID);
  }
  const cellTypeId = call.condition?.cellType?.id;
  return !cellTypeId || cellTypeId === CELL_TYPE_ROOT_ID;
};

// building the page_type array depending on config.json
// TODO: in future, adapt for display of different condition params?
export const EXPERIMENTS = 'experiments';
export const RAW_DATA_ANNOTS = 'raw_data_annots';
export const PROC_EXPR_VALUES = 'proc_expr_values';
export const EXPR_CALLS = 'expr_calls';

// TODO: remove?
export const TAB_PAGE = [
  {
    id: EXPERIMENTS,
    label: 'Experiments',
    searchLabel: 'Search for Experiments',
    resultLabel: 'Experiments',
  },
  {
    id: RAW_DATA_ANNOTS,
    label: 'Curated annotations',
    searchLabel: 'Search for Curated annotations',
    resultLabel: 'Curated annotations results',
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
  label: 'Expression graph',
  searchLabel: 'Search for expression calls',
  resultLabel: 'Expression graph',
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
    position: config.dataType_IN_SITU,
    type: {
      id: IN_SITU,
      label: 'In situ hybridization',
      sourceLetter: 'I',
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

const expressionCallDataTypes = (ids) => {
  const allowed = new Set(ALL_DATA_TYPES_ID);
  const selected = (ids || []).filter((id) => allowed.has(id));
  return selected.length > 0 ? selected : ALL_DATA_TYPES_ID;
};
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

// Temporary kill-switch: multispecies complementary call currently has performance issues.
// Set to `true` to re-enable orphan/complementary expression retrieval.
const ENABLE_MULTISPEC_COMPLEMENTARY_FETCH = true;

// URL params kept only when they differ from the form defaults.
const DEFAULT_ANAT_ENTITY_ID = 'SUMMARY';
const DEFAULT_CELL_TYPE_ID = 'SUMMARY';
const FILTER_URL_KEYS = ['anat_entity_id', 'cell_type_id', 'data_qual', 'data_type'];
const TECHNICAL_URL_KEYS = [
  'display_type',
  'page',
  'action',
  'limit',
  'get_results',
  'get_column_definition',
  'get_filters',
  'display_rp',
  'detailed_rp',
  'offset',
  'get_result_count',
  'filters_for_all',
];

const paramValues = (source, key) => {
  if (!source) return [];
  if (typeof source.getAll === 'function') return source.getAll(key).filter(Boolean);
  const value = source[key];
  if (value == null || value === '') return [];
  return (Array.isArray(value) ? value : [value]).map(String).filter(Boolean);
};

const isSameIdSet = (left, right) => {
  if (left.length !== right.length) return false;
  const a = [...left].sort();
  const b = [...right].sort();
  return a.every((id, index) => id === b[index]);
};

const isDefaultFilterParam = (key, values) => {
  if (key === 'anat_entity_id') {
    return values.length === 0 || values.every((id) => id === DEFAULT_ANAT_ENTITY_ID);
  }
  if (key === 'cell_type_id') {
    return values.length === 0 || values.every((id) => id === DEFAULT_CELL_TYPE_ID);
  }
  if (key === 'data_qual') {
    return values.length === 0 || values[0] === SILVER;
  }
  if (key === 'data_type') {
    return values.length === 0 || isSameIdSet(values, ALL_DATA_TYPES_ID);
  }
  return false;
};

const concreteFilterValues = (key, values) => {
  if (key === 'anat_entity_id') return values.filter((id) => id !== DEFAULT_ANAT_ENTITY_ID);
  if (key === 'cell_type_id') return values.filter((id) => id !== DEFAULT_CELL_TYPE_ID);
  return values;
};

const appendNonDefaultFilters = (target, source) => {
  FILTER_URL_KEYS.forEach((key) => {
    const values = concreteFilterValues(key, paramValues(source, key));
    if (isDefaultFilterParam(key, values)) return;
    values.forEach((value) => target.append(key, value));
  });
};

// Mirror the API request into the page URL. A stored hash replaces storable
// parameters, except filter values that differ from the defaults.
const buildExpressionMatrixUrlParams = (paramsURLCalled, requestParameters) => {
  const searchParams = new URLSearchParams(paramsURLCalled || '');
  const newHash = requestParameters?.data;
  const storableParameters = requestParameters?.storableParameters;

  if (newHash && storableParameters) {
    searchParams.delete('data');
    storableParameters.forEach((key) => {
      const values = concreteFilterValues(key, searchParams.getAll(key));
      if (FILTER_URL_KEYS.includes(key) && !isDefaultFilterParam(key, values)) return;
      searchParams.delete(key);
    });
    searchParams.append('data', newHash);
  }

  TECHNICAL_URL_KEYS.forEach((key) => searchParams.delete(key));

  if (searchParams.get('pageType') === 'experiments') searchParams.delete('pageType');
  if (searchParams.get('sex') === 'all') searchParams.delete('sex');
  if (searchParams.get('cell_type_descendant') === 'true') searchParams.delete('cell_type_descendant');
  if (searchParams.get('stage_descendant') === 'true') searchParams.delete('stage_descendant');
  if (searchParams.get('anat_entity_descendant') === 'true') searchParams.delete('anat_entity_descendant');

  FILTER_URL_KEYS.forEach((key) => {
    const values = concreteFilterValues(key, searchParams.getAll(key));
    searchParams.delete(key);
    if (isDefaultFilterParam(key, values)) return;
    values.forEach((value) => searchParams.append(key, value));
  });

  return searchParams;
};

const termOptionsFromIds = (ids, details) =>
  ids.map((id) => {
    const found = (details || []).find((term) => term.id === id);
    return {
      label: found ? getIdAndNameLabel(found) : id,
      value: id,
    };
  });

const useLogic = (options = {}) => {
  const { setMultiSpeciesGenes, multiSpeciesGenes } = options;
  const navigate = useNavigate();
  // Init from URL
  const loc = useLocation();
  const initSearch = new URLSearchParams(loc.search);
  const initHash = initSearch.get('data');
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  const initDataType = initSearch.get('data_type') || DATA_TYPES[0].id;
  const initDataTypeFromUrl = initSearch.getAll('data_type');
  const initDataTypeExpCalls =
    initDataTypeFromUrl.length === 0 ? ALL_DATA_TYPES_ID : expressionCallDataTypes(initDataTypeFromUrl);

  // Page Type / Data Type
  // Page type = data in search params !
  const pageType = EXPR_CALLS;
  const [dataType, setDataType] = useState(initDataType);
  const [dataTypesExpCalls, setDataTypesExpCalls] = useState(initDataTypeExpCalls);

  // Add state for tracking initialization from URL params
  const [isInitializingFromUrl, setIsInitializingFromUrl] = useState(false);
  // Add state for tracking gene list initialization
  const [isProcessingGeneList, setIsProcessingGeneList] = useState(false);

  // lists
  const [speciesSexes, setSpeciesSexes] = useState([]);
  const [devStages, setDevStages] = useState([]);

  // Form
  const [selectedSpecies, setSelectedSpecies] = useState(EMPTY_SPECIES_VALUE);
  const [selectedTissue, setSelectedTissue] = useState(() =>
    termOptionsFromIds(
      initSearch.getAll('anat_entity_id').filter((id) => id && id !== DEFAULT_ANAT_ENTITY_ID),
      []
    )
  );
  const [selectedStrain, setSelectedStrain] = useState([]);
  const [selectedCellTypes, setSelectedCellTypes] = useState(() =>
    termOptionsFromIds(
      initSearch.getAll('cell_type_id').filter((id) => id && id !== DEFAULT_CELL_TYPE_ID),
      []
    )
  );
  const [selectedGene, setSelectedGene] = useState([]);
  const [selectedSexes, setSelectedSexes] = useState([]);
  const [selectedExpOrAssay, setSelectedExpOrAssay] = useState([]);
  const [selectedDevStages, setSelectedDevStages] = useState([]);
  const [hasCellTypeSubStructure, setHasCellTypeSubStructure] = useState(true);
  const [hasTissueSubStructure, setHasTissueSubStructure] = useState(true);
  const [hasDevStageSubStructure, setDevStageSubStructure] = useState(true);
  const [dataQuality, setDataQuality] = useState(initSearch.get('data_qual') || SILVER);
  const [callTypes, setCallTypes] = useState([NOT_EXPRESSED, EXPRESSED]);
  const [condObserved, setCondObserved] = useState(false);
  const [conditionalParam2, setConditionalParam2] = useState([
    COND_PARAM2_ANAT_KEY,
    COND_PARAM2_DEVSTAGE_KEY,
    COND_PARAM2_SEX_KEY,
    COND_PARAM2_STRAIN_KEY,
  ]);

  // results
  const [isLoading, setIsLoading] = useState(false);
  const [show, setShow] = useState(true);
  const [searchResult, setSearchResult] = useState(null);
  // const [maxExpScore, setMaxExpScore] = useState({});
  const maxExpScore = [];

  // filters
  const [filters, setFilters] = useState({});

  const updateSelectedSpecies = (newSpecies, preserveGenes = false) => {
    setSelectedSpecies(newSpecies);
    if (newSpecies.value !== EMPTY_SPECIES_VALUE.value) {
      getSexesAndDevStageForSpecies();
      resetForm(true, preserveGenes); // Pass preserveGenes flag to resetForm
    }
  };

  const onChangeSpecies = (newSpecies) => {
    updateSelectedSpecies(newSpecies, false); // Don't preserve genes for manual species changes
  };

  useEffect(() => {
    if (selectedSpecies.value !== EMPTY_SPECIES_VALUE.value && !isInitializingFromUrl) {
      getSexesAndDevStageForSpecies();
      resetForm(true, false); // Don't preserve genes for user interactions
    }
  }, [selectedSpecies]);

  const onSubmit = (multiSpeciesGenes = null) => {
    triggerInitialSearch(null, multiSpeciesGenes);
  };

  const addConditionalParam = (id) => {
    const indexOfValue = conditionalParam2.indexOf(id);
    if (indexOfValue === -1) {
      setConditionalParam2([...conditionalParam2, id]);
    }
  };

  const initFormFromDetailedRP = (resp, preserveGenes = false) => {
    const { requestParameters, data } = resp || {};
    const requestDetails = data?.requestDetails;
    // console.log(`[useLogic.initFormFromDetailedRP] requestParameters:\n${JSON.stringify(requestParameters)}`);
    // console.log(`[useLogic.initFormFromDetailedRP] requestDetails:\n${JSON.stringify(requestDetails)}`);

    // Data type
    const nextDataType = requestParameters.data_type?.[0];
    if (nextDataType) {
      setDataType(nextDataType);
    }

    // Species
    if (requestDetails?.requestedSpecies) {
      setSelectedSpecies(
        {
          label: getSpeciesLabel(requestDetails?.requestedSpecies),
          value: requestDetails?.requestedSpecies?.id,
        },
        preserveGenes
      );
    }

    // Genes - only set if not preserving existing genes
    if (!preserveGenes && requestDetails?.requestedGenes?.length > 0) {
      const initGenes = requestDetails?.requestedGenes.map((g) => ({
        label: getGeneLabel(g),
        value: g.geneId,
      }));
      setSelectedGene(initGenes);
    }

    // Tissues and cell types. Replace rather than append so a repeated init
    // does not duplicate chips, and drop the SUMMARY placeholder.
    const cellTypesAndTissues = requestDetails?.requestedAnatEntitesAndCellTypes || [];
    if (requestParameters?.anat_entity_id) {
      const tissueIds = paramValues(requestParameters, 'anat_entity_id').filter((id) => id !== DEFAULT_ANAT_ENTITY_ID);
      setSelectedTissue(termOptionsFromIds(tissueIds, cellTypesAndTissues));
    }

    if (requestParameters?.cell_type_id) {
      const cellTypeIds = paramValues(requestParameters, 'cell_type_id').filter((id) => id !== DEFAULT_CELL_TYPE_ID);
      setSelectedCellTypes(termOptionsFromIds(cellTypeIds, cellTypesAndTissues));
    }

    // Dev Stage
    if (requestParameters?.stage_id?.length > 0) {
      const initDevStage = [];
      const flattenedList = flattenDevStagesList(requestDetails?.requestedSpeciesDevStageOntology);
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
      setSelectedStrain(requestParameters?.strain.map((s) => ({ value: s, label: s })));
    }

    // Exp or Assay ID
    if (requestParameters?.exp_assay_id?.length > 0) {
      const initExpOrAssay = [];
      requestParameters?.exp_assay_id.forEach((expOrAssayId) => {
        const foundExpOrAssay = requestDetails?.requestedExperimentAndAssays?.find((t) => t.id === expOrAssayId);
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
    if (requestParameters?.anat_entity_descendant === 'false') setHasTissueSubStructure(false);
    if (requestParameters?.cell_type_descendant === 'false') setHasCellTypeSubStructure(false);
    if (requestParameters?.stage_descendant === 'false') setDevStageSubStructure(false);

    // Filters
    const filtersToCheck = data?.filters || {};
    const searchParams = new URLSearchParams(requestParameters);
    const initFilters = {};
    Object.entries(filtersToCheck).forEach(([, f]) => {
      const ids = searchParams.getAll(f.urlParameterName);
      const nextValues = f.values.filter((v) => ids.includes(v.id));

      const nextValuesMapped = getOptionsForFilter(nextValues, f?.informativeId, f?.informativeName);
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

    // Call types
    if (requestParameters?.expr_type?.length > 0) {
      setCallTypes(requestParameters?.expr_type);
    }

    // data_type expres calls
    if (requestParameters?.data_type?.length > 0) {
      setDataTypesExpCalls(expressionCallDataTypes(requestParameters.data_type));
    }

    // Data quality (API may return a string or a one-element list)
    const dataQualValues = paramValues(requestParameters, 'data_qual');
    if (dataQualValues.length > 0) {
      setDataQuality(dataQualValues[0]);
    }

    // Conditional parameter 2
    if (requestParameters?.cond_param2?.length > 0) {
      setConditionalParam2(requestParameters?.cond_param2);
    }

    // Conditions observed
    if (requestParameters?.cond_observed === 'true') {
      setCondObserved(true);
    } else {
      setCondObserved(false);
    }
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
      queryGenes: [],
    };

    params.dataType = expressionCallDataTypes(dataTypesExpCalls);
    params = {
      ...params,
      dataQuality,
      callTypes,
      conditionalParam2,
      condObserved,
    };

    return params;
  };

  // API QUERY 1: Get gene expression data for top-level anatomical terms
  // Uses multispec_expr_calls API when multiSpeciesGenes is provided, else expr_calls per species
  const triggerInitialSearch = async (initParams, multiSpeciesGenes = null) => {
    const baseParams = initParams || getSearchParams();
    const doComplementarySearch = baseParams.selectedTissue.length === 0 && baseParams.selectedCellTypes.length === 0;
    const shouldFetchMultispecComplementary = ENABLE_MULTISPEC_COMPLEMENTARY_FETCH && doComplementarySearch;

    setIsLoading(true);

    try {
      let combinedData = null;
      let paramsURLCalled1 = null;
      let firstResultResp = null;

      if (multiSpeciesGenes && multiSpeciesGenes.length > 0) {
        // Use multispec API: single call for all genes across species
        const [initialResult, complementaryResult] = await Promise.all([
          api.search.geneExpressionMatrix.multispecInitialSearch(baseParams, multiSpeciesGenes),
          shouldFetchMultispecComplementary
            ? api.search.geneExpressionMatrix.multispecInitialSearchComplementary(baseParams, multiSpeciesGenes)
            : Promise.resolve(null),
        ]);

        const { resp, paramsURLCalled } = initialResult;
        firstResultResp = resp;
        if (resp.code === 200) {
          combinedData = { ...resp.data };
          paramsURLCalled1 = paramsURLCalled;

          if (shouldFetchMultispecComplementary && complementaryResult?.resp?.code === 200) {
            const initialCellTypeRootAnatIds = new Set(
              combinedData.expressionData.expressionCalls.filter(isCellTypeRootCall).flatMap(getCallAnatIds)
            );
            const orphanCalls = complementaryResult.resp.data.expressionData.expressionCalls
              .filter((call) => {
                // Leftover organs at the cell-type root only — not a global cell-type list.
                if (!isCellTypeRootCall(call)) return false;
                // Hide a duplicate GO:0005575 / empty-cellTypes row already shown by request 1.
                const anatIds = getCallAnatIds(call);
                return anatIds.length > 0 && !anatIds.some((id) => initialCellTypeRootAnatIds.has(id));
              })
              .map((call) => ({
                ...call,
                isOrphan: true,
              }));
            combinedData.expressionData.expressionCalls.push(...orphanCalls);
          }
        }
      } else {
        // Fallback: original multi-call per species
        const speciesGroups = [
          {
            speciesId: baseParams.selectedSpecies,
            speciesLabel: selectedSpecies.label || '',
            genes: baseParams.selectedGene,
          },
        ];

        const searchPromises = speciesGroups.map((group) => {
          const params = { ...baseParams };
          params.selectedSpecies = group.speciesId;
          params.selectedGene = group.genes;
          return api.search.geneExpressionMatrix.initialSearch(params);
        });

        const complementaryPromises = doComplementarySearch
          ? speciesGroups.map((group) => {
              const params = { ...baseParams };
              params.selectedSpecies = group.speciesId;
              params.selectedGene = group.genes;
              return api.search.geneExpressionMatrix.initialSearchComplementary(params);
            })
          : [];

        const allResults = await Promise.all([...searchPromises, ...complementaryPromises]);
        const initialResults = allResults.slice(0, speciesGroups.length);
        const complementaryResults = allResults.slice(speciesGroups.length);

        initialResults.forEach((result, idx) => {
          const { resp, paramsURLCalled } = result;
          if (resp.code === 200) {
            if (idx === 0) firstResultResp = resp;
            if (!combinedData) {
              combinedData = { ...resp.data };
              paramsURLCalled1 = paramsURLCalled;
            } else {
              combinedData.expressionData.expressionCalls.push(...resp.data.expressionData.expressionCalls);
            }
          }
        });

        if (doComplementarySearch) {
          complementaryResults.forEach((result) => {
            const { resp } = result;
            if (resp?.code === 200) {
              const orphanCalls = resp.data.expressionData.expressionCalls.map((call) => ({
                ...call,
                isOrphan: true,
              }));
              combinedData.expressionData.expressionCalls.push(...orphanCalls);
            }
          });
        }
      }

      if (combinedData) {
        const resp1 = {
          code: 200,
          data: combinedData,
          requestParameters: firstResultResp?.requestParameters || firstResultResp,
        };

        // After First search we update the filters via detailed_rp
        if (isFirstSearch) {
          try {
            // console.log(`[useLogic.triggerInitialSearch] initFormFromDetailedRP...`);
            const preserveGenes = isInitializingFromUrl;
            initFormFromDetailedRP(resp1, preserveGenes);
          } catch (e) {
            console.error('Error when parsing URL e = ', e);
          }
        }

        // Keep non-default filters in the URL; the hash still stores the full query.
        const searchParams = buildExpressionMatrixUrlParams(paramsURLCalled1, resp1?.requestParameters);

        if (isFirstSearch) {
          navigate(
            {
              search: searchParams.toString(),
              pathname: `${URL_ROOT}${loc.pathname}`,
            },
            { replace: true, preventScrollReset: true }
          );
        } else {
          navigate({
            search: searchParams.toString(),
            pathname: `${URL_ROOT}${loc.pathname}`,
          });
        }

        // Keep the search form visible after Submit so the user can tweak filters
        // and re-submit without having to re-open the form. The "Selected Genes"
        // panel collapses separately to direct attention to the Expression Graph.

        setIsLoading(false);
        setSearchResult(combinedData);
      }
    } catch (error) {
      console.error(`[useLogic.triggerInitialSearch] ERROR:\n${JSON.stringify(error)}`);
      navigate(`${URL_ROOT}${loc.pathname}`, { replace: true, preventScrollReset: true });
      setIsLoading(false);
    } finally {
      // console.log(`[useLogic.triggerInitialSearch] finally.`)
      setIsFirstSearch(false);
    }
  };

  const triggerSearch = async (cleanFilters = false) => {
    const params = getSearchParams();
    if (cleanFilters) {
      params.filters = {};
      setFilters({});
    }

    // HD: if only one gene was selected -> get gene homologs
    // console.log(`[useLogic.triggerSearch] selected gene:\n${JSON.stringify(params.selectedGene)}`);
    // console.log(`[useLogic.triggerSearch] selected species:\n${JSON.stringify(params.selectedSpecies)}`);
    const queryGenes = new Set();
    if (params.selectedGene.length === 1) {
      const geneId = params.selectedGene[0];
      const speciesId = params.selectedSpecies;
      api.search.genes.homologs(geneId, speciesId).then((result) => {
        // console.log(`[useLogic.triggerSearch] homologs:\n${JSON.stringify(result.data)}`);

        // collect homologous genes
        result.data.orthologsByTaxon.forEach((entry) => {
          entry.genes.forEach((gene) => {
            queryGenes.add(
              JSON.stringify({
                geneId: gene.geneId,
                speciesId: gene.species.id,
                geneName: gene.name,
                speciesName: `${gene.species.genus} ${gene.species.speciesName}`,
              })
            );
          });
        });
        // console.log(`[useLogic.triggerSearch] queryGenes:\n${JSON.stringify([...queryGenes])}`);
        // console.log(`[useLogic.triggerSearch] queryGenes:\n${[...queryGenes].length}`);

        // params.queryGenes = queryGenes;
      });
    }

    // HD: Fix other condition params to top-level terms (overrides form fields!)
    params.selectedCellTypes = ['GO:0005575']; // "cellular_component"
    params.selectedDevStages = ['UBERON:0000104']; // "life cycle"
    params.selectedStrain = ['wild-type'];
    params.hasCellTypeSubStructure = 0;
    params.hasTissueSubStructure = 0;
    params.hasDevStageSubStructure = 0;

    setIsLoading(true);
    return api.search.geneExpressionMatrix
      .search(params, false)
      .then(({ resp, paramsURLCalled }) => {
        if (resp.code === 200) {
          // HD
          // console.log(JSON.stringify(resp.data));
          // console.log(`[useLogic.triggerSearch] params:\n${JSON.stringify(params)}`)
          // After First search ( => hash !== null ) we update the filters via detailed_rp
          if (isFirstSearch) {
            try {
              initFormFromDetailedRP(resp);
            } catch (e) {
              console.error('Error when parsing URL e = ', e);
            }
          }

          const searchParams = buildExpressionMatrixUrlParams(paramsURLCalled, resp?.requestParameters);
          if (isFirstSearch) {
            navigate(
              {
                search: searchParams.toString(),
                pathname: `${URL_ROOT}${loc.pathname}`,
              },
              { replace: true, preventScrollReset: true }
            );
          } else {
            navigate({
              search: searchParams.toString(),
              pathname: `${URL_ROOT}${loc.pathname}`,
            });
          }
        }

        // Keep the search form visible after Submit (see triggerInitialSearch above).

        // Finally, we set the values we are interested in
        setIsLoading(false);
        // TODO: CONTINUE - how to handle initial view?
        setSearchResult(resp?.data);

        // TODO: add result count to previous one?
        // setLocalCount(
        //   isExprCalls
        //     ? { assayCount: resp?.data?.expressionCallCount }
        //     : resp?.data?.resultCount?.[dataType]
        // );
      })
      .catch(() => {
        // We remove all the parameters that we may have sent
        navigate(`${URL_ROOT}${loc.pathname}`, { replace: true, preventScrollReset: true });
        setIsLoading(false);
      })
      .finally(() => {
        // The next searches will not be considered as the first
        // --> Filters will now be used for the next requests
        setIsFirstSearch(false);
      });
  };

  // Homologous organs arrive as several terms on one condition (e.g. lung + swim bladder).
  // Keep every id and name so the row label and detail view show the full set.
  const aggregateTerms = (terms, fallbackTerm) => {
    if (!Array.isArray(terms) || terms.length === 0) return fallbackTerm;
    const validTerms = terms.filter((term) => term?.id && term?.name);
    if (validTerms.length === 0) return fallbackTerm;
    return {
      id: validTerms.map((term) => term.id).join(','),
      name: validTerms.map((term) => term.name).join(', '),
    };
  };

  // Transform multispec multiSpeciesCondition to condition format for heatmap
  const transformMultispecCall = (call) => {
    if (call.condition) return call;
    const msc = call.multiSpeciesCondition;
    const anatEntity = aggregateTerms(msc?.anatEntities, {
      id: 'UBERON:0001062',
      name: 'anatomical entity',
    });
    // Empty cellTypes means cell-type root (organ-only row); GO:0005575 is omitted in JSON.
    const cellType = aggregateTerms(msc?.cellTypes, {
      id: 'GO:0005575',
      name: 'cellular component',
    });
    return { ...call, condition: { anatEntity, cellType } };
  };

  // HD: perform API data request for subordinate terms
  // Returns only the expression calls, letting GeneExpressionHeatmap handle hierarchy management
  const triggerSearchChildren = async (parentId, selectedTissueId, multiSpeciesGenes = null) => {
    const baseParams = getSearchParams();

    // Set parent anatomical term as selected tissue
    baseParams.selectedTissue = [selectedTissueId];
    baseParams.hasTissueSubStructure = 1;
    baseParams.conditionalParam2 = ['anat_entity'];
    // Do not send cell_type_id — child expansion is anatomical terms only.
    baseParams.selectedCellTypes = [];
    baseParams.hasCellTypeSubStructure = false;
    // Partition the SUMMARY forest: punch out other top-level organ subtrees.
    // The backend ignores discard seeds that are ancestors of the include term, so this
    // is safe for nested SUMMARY organs (e.g. CNS) as well as the residual bucket.
    baseParams.discardAnatEntityAndChildrenId = 'SUMMARY';
    baseParams.observedData = true;

    try {
      if (multiSpeciesGenes && multiSpeciesGenes.length > 0) {
        // Use multispec API
        const { resp } = await api.search.geneExpressionMatrix.multispecSearch(baseParams, multiSpeciesGenes);
        if (resp.code !== 200) return [];
        const calls = resp.data.expressionData.expressionCalls.map(transformMultispecCall);
        calls.forEach((exprCall) => {
          exprCall.condition.anatEntity.dataId = `${parentId}--${exprCall.condition.anatEntity.id}`;
        });
        return calls;
      }

      // Fallback: single species
      const params = { ...baseParams };
      params.selectedSpecies = baseParams.selectedSpecies;
      params.selectedGene = baseParams.selectedGene;
      const { resp } = await api.search.geneExpressionMatrix.search(params, false);
      if (resp.code !== 200) return [];
      const calls = resp.data.expressionData.expressionCalls;
      calls.forEach((exprCall) => {
        exprCall.condition.anatEntity.dataId = `${parentId}--${exprCall.condition.anatEntity.id}`;
      });
      return calls;
    } catch (error) {
      console.error(`[useLogic.triggerSearchChildren] ERROR:\n${JSON.stringify(error)}`);
      return [];
    }
  };

  const getSexesAndDevStageForSpecies = () => {
    api.search.species.speciesDevelopmentSexe(selectedSpecies.value).then((resp) => {
      if (resp.code === 200) {
        setSpeciesSexes(resp.data?.requestDetails?.requestedSpeciesSexes);
        setDevStages(resp.data?.requestDetails?.requestedSpeciesDevStageOntology);
      } else {
        setSpeciesSexes([]);
      }
    });
  };

  const AutoCompleteByType = (type, mappingFn) =>
    useCallback(
      async (query) => {
        if (query) {
          return api.search.genes.AutoCompleteByType(type, query, selectedSpecies.value).then((resp) => {
            if (resp.code === 200) {
              const results = resp.data.result.searchMatches || resp.data.result.geneMatches;
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

  const setSelectedSpeciesFromUrl = (species) => {
    setSelectedSpecies(species);
    if (species.value !== EMPTY_SPECIES_VALUE.value) {
      getSexesAndDevStageForSpecies();
      resetForm(true, true); // Always preserve genes during URL init
    }
  };

  const initFromUrlParams = async () => {
    const params = {
      hash: initHash,
      isFirstSearch: true,
      initSearch,
    };

    try {
      setIsInitializingFromUrl(true);

      const resp1 = await api.search.geneExpressionMatrix.getRequestParams(params, false);
      if (resp1.resp.code === 200) {
        // console.log(`[useLogic.initFromUrlParams] simple RP resp:\n${JSON.stringify(resp1, null, 2)}`);

        const simpleParams = resp1.resp.requestParameters;
        // console.log(`[useLogic.initFromUrlParams] simpleParams:\n${JSON.stringify(simpleParams)}`);

        // A stored gene_list is enough to restore the search, including multi-species
        // queries that have no species_id. Hand off to the gene_list URL flow.
        const geneListValues = [].concat(simpleParams.gene_list || []).filter(Boolean);
        if (geneListValues.length > 0) {
          const nextSearch = new URLSearchParams();
          nextSearch.set('gene_list', geneListValues.join('\n'));
          appendNonDefaultFilters(nextSearch, simpleParams);
          navigate(
            {
              pathname: loc.pathname,
              search: `?${nextSearch.toString()}`,
            },
            { replace: true, preventScrollReset: true }
          );
          return;
        }

        const searchParamsNew = new URLSearchParams();

        // Process other parameters
        Object.entries(simpleParams).forEach(([key, value]) => {
          if (key === 'gene_id' || key === 'cond_param2') {
            // multiple values possible
            value.forEach((geneId) => {
              searchParamsNew.append(key, geneId);
            });
          } else if (key === 'anat_entity_id' || key === 'cell_type_id') {
            value.forEach((id) => {
              if (id !== 'SUMMARY') {
                searchParamsNew.append(key, id);
              }
            });
          } else if (key === 'species_id') {
            searchParamsNew.append(key, value);
          }
        });
        params.initSearch = searchParamsNew;

        // Step 2: get detailed request parameters
        const resp2 = await api.search.geneExpressionMatrix.getRequestParams(params, true);
        if (resp2.resp.code === 200) {
          // console.log(`[useLogic.initFromUrlParams] detailed RP resp:\n${JSON.stringify(resp2, null, 2)}`);
          const requestDetails = resp2.resp.data?.requestDetails;
          if (!requestDetails) {
            setIsInitializingFromUrl(false);
            return;
          }
          const { requestedSpecies, requestedGenes } = requestDetails;
          // const { anat_entity_id: anatEntityId, cell_type_id: cellTypeId } = resp2.resp.requestParameters;
          // Find the requestedAnatEntitesAndCellTypes that matches the anatEntityId
          // const requestedAnatEntities =
          //   requestedAnatEntitesAndCellTypes?.filter((term) => anatEntityId?.includes(term.id)) || [];

          // const requestedCellTypes =
          //   requestedAnatEntitesAndCellTypes?.filter((term) => cellTypeId?.includes(term.id)) || [];

          // Use wrapper for species initialization
          if (requestedSpecies) {
            setSelectedSpeciesFromUrl({
              label: getSpeciesLabel(requestedSpecies),
              value: requestedSpecies.id,
            });
          }

          // Set genes after species
          if (requestedGenes?.length > 0) {
            setSelectedGene(
              requestedGenes.map((gene) => ({
                label: getGeneLabel(gene),
                value: gene.geneId,
              }))
            );
          }
        }
      }
    } catch (error) {
      console.error('[initFromUrlParams] Error:', error);
    } finally {
      // setIsInitializingFromUrl(false);
    }
  };

  // Add useEffect to trigger search when initialization is complete (e.g. from gene_list URL)
  useEffect(() => {
    if (
      isFirstSearch &&
      isInitializingFromUrl &&
      selectedSpecies.value !== EMPTY_SPECIES_VALUE.value &&
      ((multiSpeciesGenes && multiSpeciesGenes.length > 0) || selectedGene.length > 0)
    ) {
      triggerInitialSearch(null, multiSpeciesGenes && multiSpeciesGenes.length > 0 ? multiSpeciesGenes : null);
      setIsInitializingFromUrl(false);
    }
  }, [selectedGene, selectedSpecies, multiSpeciesGenes, isInitializingFromUrl]);

  // URL change handler
  useEffect(() => {
    //  console.log(`[useLogic.js] loc.search CHANGED:`, loc.search);

    const searchParams = new URLSearchParams(loc.search);
    const geneList = searchParams.get('gene_list');
    if (geneList) {
      processGeneList(geneList);
    } else if (!loc.search && !isFirstSearch && !isLoading) {
      console.log(`[useLogic.js] reset form...`);
      resetForm(false, true);
    } else if (loc.search?.length > 0 && !isInitializingFromUrl && !isProcessingGeneList) {
      // console.log(`[useLogic.js] init from url params...`);
      initFromUrlParams();
    }
  }, [loc.search]);

  const resetForm = (isSpeciesChange = false, preserveGenes = false) => {
    // console.log(`[useLogic.resetForm] resetForm called with:`, {isSpeciesChange, preserveGenes});
    if (!preserveGenes) {
      // console.log(`[useLogic.resetForm] Clearing genes in resetForm`);
      setSelectedGene([]);
    }
    setSelectedCellTypes([]);
    setSelectedStrain([]);
    setSelectedTissue([]);
    setSelectedSexes([]);
    setSelectedDevStages([]);
    setHasCellTypeSubStructure(true);
    setHasTissueSubStructure(true);
    setDevStageSubStructure(true);
    if (!isSpeciesChange) {
      setSelectedSpecies(EMPTY_SPECIES_VALUE);
      setSelectedExpOrAssay([]);
    }
  };

  // Add function to process gene list (from URL ?gene_list=ID1%0AID2...)
  const processGeneList = async (geneListParam) => {
    if (!geneListParam) return;

    setIsProcessingGeneList(true);
    // Trim, drop empties, and deduplicate the input IDs so duplicates in the URL
    // do not inflate multiSpeciesGenes (and consequently the gene_list sent back to the API).
    const geneIds = Array.from(
      new Set(
        geneListParam
          .split(/[\r\n]+/)
          .map((id) => id.trim())
          .filter(Boolean)
      )
    );

    try {
      const searchResults = await Promise.all(geneIds.map((geneId) => api.search.genes.geneSearchResult(geneId)));

      const validResults = searchResults.filter(
        (result) => result.code === 200 && result.data.result.totalMatchCount === 1
      );

      if (validResults.length === 0) return;

      // Build multiSpeciesGenes with correct species per gene (supports multi-species)
      // Also guard against the (unlikely) case where two distinct input IDs resolve
      // to the same speciesId:geneId pair.
      const seenKeys = new Set();
      const multiSpeciesGenes = [];
      validResults.forEach((result) => {
        const { gene } = result.data.result.geneMatches[0];
        const key = `${gene.species.id}:${gene.geneId}`;
        if (seenKeys.has(key)) return;
        seenKeys.add(key);
        multiSpeciesGenes.push({
          speciesId: gene.species.id,
          speciesLabel: `${gene.species.genus} ${gene.species.speciesName}${
            gene.species.name ? ` - ${gene.species.name}` : ''
          }`,
          geneId: gene.geneId,
          geneLabel: getGeneLabel(gene),
        });
      });

      if (setMultiSpeciesGenes) {
        setMultiSpeciesGenes(multiSpeciesGenes);
      }

      setSelectedSpeciesFromUrl({
        label: getSpeciesLabel(validResults[0].data.result.geneMatches[0].gene.species),
        value: validResults[0].data.result.geneMatches[0].gene.species.id,
      });
      // resetForm inside setSelectedSpeciesFromUrl clears tissue and cell type.
      // Re-apply URL filters afterwards so a shared link restores them.
      const urlFilters = new URLSearchParams(loc.search);
      setSelectedTissue(
        termOptionsFromIds(
          urlFilters.getAll('anat_entity_id').filter((id) => id && id !== DEFAULT_ANAT_ENTITY_ID),
          []
        )
      );
      setSelectedCellTypes(
        termOptionsFromIds(
          urlFilters.getAll('cell_type_id').filter((id) => id && id !== DEFAULT_CELL_TYPE_ID),
          []
        )
      );
      setDataQuality(urlFilters.get('data_qual') || SILVER);
      const typesFromUrl = urlFilters.getAll('data_type');
      setDataTypesExpCalls(typesFromUrl.length === 0 ? ALL_DATA_TYPES_ID : expressionCallDataTypes(typesFromUrl));
      setIsInitializingFromUrl(true);
    } catch (error) {
      console.error('Error processing gene list:', error);
    } finally {
      setIsProcessingGeneList(false);
    }
  };

  return {
    searchResult,
    setSearchResult,
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
    selectedExpOrAssay,
    selectedTissue,
    speciesSexes,
    selectedSexes,
    isLoading,
    isFirstSearch,
    filters,
    dataTypesExpCalls,
    dataQuality,
    conditionalParam2,
    callTypes,
    condObserved,
    setCondObserved,
    setCallTypes,
    setConditionalParam2,
    setDataQuality,
    setDataTypesExpCalls,
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
    setDataType,
    setShow,
    AutoCompleteByType,
    onSubmit,
    resetForm,
    triggerSearch,
    triggerSearchChildren,
    addConditionalParam,
    getSearchParams,
    processGeneList,
  };
};

export default useLogic;
