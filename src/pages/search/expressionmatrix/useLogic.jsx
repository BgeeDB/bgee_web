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

// Temporary kill-switch: multispecies complementary call currently has performance issues.
// Set to `true` to re-enable orphan/complementary expression retrieval.
const ENABLE_MULTISPEC_COMPLEMENTARY_FETCH = false;

const useLogic = (options = {}) => {
  const { setMultiSpeciesGenes, multiSpeciesGenes } = options;
  const navigate = useNavigate();
  // Init from URL
  const loc = useLocation();
  const initSearch = new URLSearchParams(loc.search);
  const initHash = initSearch.get('data');
  const [isFirstSearch, setIsFirstSearch] = useState(true);

  const initDataType = initSearch.get('data_type') || DATA_TYPES[0].id;
  const initDataTypeExpCalls = initSearch.getAll('data_type') || ALL_DATA_TYPES_ID;

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
  const [dataQuality, setDataQuality] = useState(SILVER);
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

    // Tissues (anatEntities)
    const cellTypesAndTissues = requestDetails?.requestedAnatEntitesAndCellTypes || [];
    if (requestParameters?.anat_entity_id?.length > 0) {
      const initTissues = selectedTissue;
      // HD: add top-level anatomical terms

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
      const initCelleTypes = selectedCellTypes;
      requestParameters?.cell_type_id.forEach((cellTypeId) => {
        const foundCellType = cellTypesAndTissues.find((t) => t.id === cellTypeId);
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
      setDataTypesExpCalls(requestParameters?.data_type);
    }

    // Data quality
    if (requestParameters?.data_qual?.length > 0) {
      setDataQuality(requestParameters?.data_qual);
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

    const dataTypeForExpCalls = dataTypesExpCalls.length === 0 ? ALL_DATA_TYPES_ID : dataTypesExpCalls;
    params.dataType = dataTypeForExpCalls;
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
            const orphanCalls = complementaryResult.resp.data.expressionData.expressionCalls.map((call) => ({
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

        // "Mirroring" management in URL's parameter (multispec API may not return requestParameters)
        const searchParams = new URLSearchParams(paramsURLCalled1);
        const newHash = resp1?.requestParameters?.data;
        if (newHash && resp1?.requestParameters?.storableParameters) {
          searchParams.delete('data');
          resp1.requestParameters.storableParameters.forEach((key) => {
            if (key !== 'data_type') {
              searchParams.delete(key);
            }
          });
          searchParams.append('data', newHash);
        }

        // Clean URL parameters
        searchParams.delete('display_type');
        searchParams.delete('page');
        searchParams.delete('action');
        searchParams.delete('limit');
        searchParams.delete('get_results');
        searchParams.delete('get_column_definition');
        searchParams.delete('get_filters');
        searchParams.delete('display_rp');
        searchParams.delete('detailed_rp');
        searchParams.delete('offset');
        searchParams.delete('get_result_count');
        searchParams.delete('filters_for_all');

        if (searchParams.get('pageType') === 'experiments') {
          searchParams.delete('pageType');
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

        if (!isFirstSearch) {
          setShow(false);
        }

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
          if (searchParams.get('pageType') === 'experiments') {
            searchParams.delete('pageType');
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

        // The search form will be collapsed if this is not the first time we're on the page
        if (!isFirstSearch) {
          setShow(false);
        }

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
    if (baseParams.selectedCellTypes?.length === 0) {
      baseParams.selectedCellTypes = ['GO:0005575']; // "cellular_component"
    }
    baseParams.hasTissueSubStructure = 1;
    baseParams.conditionalParam2 = ['anat_entity'];

    if (parentId === 'UBERON:0000468-GO:0005575') {
      baseParams.discardAnatEntityAndChildrenId = 'SUMMARY';
    }

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

        // Check for gene_list first before processing other parameters
        if (simpleParams.gene_list && simpleParams.species_id) {
          // Join array items with newlines and encode for URL
          const encodedGeneList = simpleParams.gene_list.join('%0A');
          // Redirect to same page with gene_list parameter
          navigate(
            {
              pathname: loc.pathname,
              search: `?gene_list=${encodedGeneList}`,
            },
            { replace: true, preventScrollReset: true }
          );
          return; // Exit the entire function
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
          const { requestDetails } = resp2.resp.data;
          //const { requestedSpecies, requestedGenes, requestedAnatEntitesAndCellTypes } = requestDetails;
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
    const geneIds = geneListParam.split(/[\r\n]+/).filter(Boolean);

    try {
      const searchResults = await Promise.all(geneIds.map((geneId) => api.search.genes.geneSearchResult(geneId)));

      const validResults = searchResults.filter(
        (result) => result.code === 200 && result.data.result.totalMatchCount === 1
      );

      if (validResults.length === 0) return;

      // Build multiSpeciesGenes with correct species per gene (supports multi-species)
      const multiSpeciesGenes = validResults.map((result) => {
        const { gene } = result.data.result.geneMatches[0];
        return {
          speciesId: gene.species.id,
          speciesLabel: `${gene.species.genus} ${gene.species.speciesName}`,
          geneId: gene.geneId,
          geneLabel: getGeneLabel(gene),
        };
      });

      if (setMultiSpeciesGenes) {
        setMultiSpeciesGenes(multiSpeciesGenes);
      }

      setSelectedSpeciesFromUrl({
        label: getSpeciesLabel(validResults[0].data.result.geneMatches[0].gene.species),
        value: validResults[0].data.result.geneMatches[0].gene.species.id,
      });
      setIsInitializingFromUrl(true);
    } catch (error) {
      console.error('Error processing gene list:', error);
    } finally {
      setIsProcessingGeneList(false);
    }
  };

  return {
    searchResult,
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
