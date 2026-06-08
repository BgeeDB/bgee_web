import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router';

import axios from 'axios';
import api from '../../../api';
import { getGeneLabel } from '../../../helpers/gene';
import { getIdAndNameLabel, getOptionsForFilter } from '../../../helpers/selects';
import { flattenDevStagesList } from './components/filters/DevelopmentalAndLifeStages/useLogic';
import { EMPTY_SPECIES_VALUE } from './components/filters/Species/Species';
import config from '../../../config.json';
import { FULL_LENGTH_LABEL } from '../../../api/prod/constant';
import { URL_ROOT } from '~/helpers/constants';
import { ensureDrilldownAndTermProps } from './buildDrilldownFromCalls';
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

const useLogic = (isExprCalls) => {
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
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [show, setShow] = useState(true);
  const [searchResult, setSearchResult] = useState(null);
  const searchResultRef = useRef(searchResult);
  searchResultRef.current = searchResult;
  // const [maxExpScore, setMaxExpScore] = useState({});
  const maxExpScore = [];

  // filters
  const [filters, setFilters] = useState({});

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

  const onSubmit = () => {
    triggerInitialSearch();
  };

  const addConditionalParam = (id) => {
    const indexOfValue = conditionalParam2.indexOf(id);
    if (indexOfValue === -1) {
      setConditionalParam2([...conditionalParam2, id]);
    }
  };

  const initFormFromDetailedRP = (resp, preserveGenes = false) => {
    const { requestParameters, data } = resp;
    const { requestDetails } = data;
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
    const filtersToCheck = (isExprCalls ? data?.filters : data?.filters?.[nextDataType]) || {};
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
      isExprCalls,
      condObserved,
    };

    return params;
  };

  // API QUERY 1: Get gene expression data for top-level anatomical terms
  // TODO: factor out repetitive code (between this function and triggerSearch, triggerInitialSearchComplementary)
  const triggerInitialSearch = async (initParams) => {
    const params = initParams || getSearchParams();
    const doComplementarySearch = params.selectedTissue.length === 0 && params.selectedCellTypes.length === 0;

    // console.log(`[useLogic.triggerInitialSearch] selected gene:\n${JSON.stringify(params.selectedGene)}`);
    // console.log(`[useLogic.triggerInitialSearch] selected species:\n${JSON.stringify(params.selectedSpecies)}`);
    // console.log(`[useLogic.triggerInitialSearch] params:\n${JSON.stringify(params)}`);

    setIsLoading(true);

    try {
      // console.log(`[useLogic.triggerInitialSearch] submitting API requests...`);
      const [result1, result2] = await Promise.all([
        api.search.geneExpressionMatrix.initialSearch(params),
        doComplementarySearch ? api.search.geneExpressionMatrix.initialSearchComplementary(params) : null,
      ]);

      const { resp: resp1, paramsURLCalled: paramsURLCalled1 } = result1;
      const { resp: resp2 } = doComplementarySearch ? result2 : { resp: null };

      if (resp1.code === 200) {
        // console.log(JSON.stringify(resp1));
        // console.log(JSON.stringify(resp2));

        const { data } = resp1;
        // Mark orphan terms from complementary search and combine with initial calls
        if (resp2?.code === 200) {
          const orphanCalls = resp2.data.expressionData.expressionCalls.map((call) => ({
            ...call,
            isOrphan: true,
          }));
          data.expressionData.expressionCalls.push(...orphanCalls);
        }

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

        // "Mirroring" management in URL's parameter
        const searchParams = new URLSearchParams(paramsURLCalled1);
        const newHash = resp1?.requestParameters?.data;
        if (newHash) {
          searchParams.delete('data');
          resp1?.requestParameters?.storableParameters?.forEach((key) => {
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
        setSearchResult(ensureDrilldownAndTermProps(data));
      }
    } catch (error) {
      if (axios.isCancel(error)) {
        setIsLoading(false);
      } else {
        console.error(`[useLogic.triggerInitialSearch] ERROR:\n${JSON.stringify(error)}`);
        navigate(`${URL_ROOT}${loc.pathname}`, { replace: true, preventScrollReset: true });
        setIsLoading(false);
      }
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
        if (resp?.code === 200 && resp.data) {
          setSearchResult(ensureDrilldownAndTermProps(resp.data));
        }

        // TODO: add result count to previous one?
        // setLocalCount(
        //   isExprCalls
        //     ? { assayCount: resp?.data?.expressionCallCount }
        //     : resp?.data?.resultCount?.[dataType]
        // );
      })
      .catch((error) => {
        if (axios.isCancel(error)) {
          setIsLoading(false);
          return;
        }
        navigate(`${URL_ROOT}${loc.pathname}`, { replace: true, preventScrollReset: true });
        setIsLoading(false);
      })
      .finally(() => {
        // The next searches will not be considered as the first
        // --> Filters will now be used for the next requests
        setIsFirstSearch(false);
      });
  };

  // HD: perform API data request for subordinate terms
  // Returns only the expression calls, letting GeneExpressionHeatmap handle hierarchy management
  const triggerSearchChildren = async (parentId, selectedTissueId) => {
    const params = getSearchParams();

    // Set parent anatomical term as selected tissue
    params.selectedTissue = [selectedTissueId];
    // Fix other condition params to top-level terms
    if (params.selectedCellTypes?.length === 0) {
      params.selectedCellTypes = ['GO:0005575']; // "cellular_component"
    }
    params.hasTissueSubStructure = 1; // we want children of parent term!
    params.conditionalParam2 = ['anat_entity']; // HD: restrict to anatomical terms
    // Child fetch must use explicit anat/cell params — never merge initSearch (hash) while
    // isFirstSearch is true, or SUMMARY from the top-level query is sent and the API returns 400.
    params.isFirstSearch = false;
    // HD: discard top-level terms from search results
    if (parentId === 'UBERON:0000468-GO:0005575') {
      params.discardAnatEntityAndChildrenId = 'SUMMARY';
    }

    setIsLoadingChildren(true);
    // DEBUG: remove console log in prod
    // console.log(`[useLogic] triggerSearchChildren - triggered!`);
    return api.search.geneExpressionMatrix
      .search(params, false, true)
      .then(({ resp, paramsURLCalled }) => {
        // DEBUG: remove in prod
        // console.log(`[useLogic] triggerSearchChildren - response:\n${JSON.stringify(resp)}`);
        if (resp.code === 200) {
          // DEBUG: remove console log in prod
          // console.log(`[useLogic] triggerSearchChildren - resp.data:\n${JSON.stringify(resp.data)}`);
          // console.log(`[useLogic] triggerSearchChildren - params:\n${JSON.stringify(params)}`)

          // TODO: make sure, URL reflects current query state
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
        }

        // update anatomical terms
        const newChildTerms = new Set();
        resp?.data?.expressionData?.expressionCalls?.forEach((exprCall) => {
          const { id: anatEntityId, name: anatEntityName } = exprCall.condition.anatEntity;
          const { id: cellTypeId, name: cellTypeName } = exprCall.condition.cellType;
          const isSingleCell = cellTypeId !== 'GO:0005575';
          // if (!(anatEntityId === selectedTissueId && cellTypeId === 'GO:0005575')) {
          if (!(anatEntityId === selectedTissueId) || isSingleCell) {
            newChildTerms.add(
              JSON.stringify({
                id: `${anatEntityId}-${cellTypeId}`,
                // label: cellTypeId !== '' ? `${anatEntityName} : ${cellTypeName}` : anatEntityName,
                label: isSingleCell ? `${anatEntityName} : ${cellTypeName}` : anatEntityName,
                anatEntityId,
                anatEntityLabel: anatEntityName,
                cellTypeId,
                cellTypeLabel: cellTypeName,
                isTopLevelTerm: false,
                isExpanded: false,
                isPopulated: false,
                hasBeenQueried: false,
                isSingleCell,
              })
            );
          }
        });
        // DEBUG: remove console log in prod
        // console.log(`[useLogic] triggerSearchChildren newChildTerms:\n${JSON.stringify([...newChildTerms])}`);
        function addChildren(hierarchy, termId, children) {
          // Helper function to recursively traverse the array
          function traverse(node) {
            if (!node || !Array.isArray(node)) return []; // break condition

            // Add property to each element in the current level
            return node.map((item) => {
              const newItem = { ...item, children: [...(item.children || [])] };
              if (item.id === termId) {
                // add children
                // console.log(`[Heatmap useLogic] adding children for:\n${termId} -> ${JSON.stringify([...children])}`);
                children.forEach((childStr) => {
                  const child = JSON.parse(childStr);
                  if (child.id !== newItem.id)
                    newItem.children.push({
                      id: child.id,
                      label: child.label,
                      anatEntityId: child.anatEntityId,
                      anatEntityLabel: child.anatEntityLabel,
                      cellTypeId: child.cellTypeId,
                      cellTypeLabel: child.cellTypeLabel,
                      depth: newItem.depth + 1,
                      isTopLevelTerm: false,
                      isExpanded: false,
                      isPopulated: false,
                      hasBeenQueried: false,
                      isSingleCell: child.isSingleCell,
                      children: [],
                    });
                });
                newItem.isExpanded = true;
                newItem.hasBeenQueried = true;
              }
              newItem.children = traverse(newItem.children); // Recursively traverse children
              return newItem;
            });
          }
          // Start traversal from the root
          return traverse(hierarchy);
        }
        // add additional data to previous ones (drilldown / termProps + expression calls)
        setSearchResult((prevResult) => {
          if (!prevResult?.expressionData?.expressionCalls) return prevResult;
          const newCalls = resp?.data?.expressionData?.expressionCalls || [];
          let nextDrilldown = prevResult.expressionData.drilldown ?? [];
          const nextTermProps = { ...(prevResult.expressionData.termProps ?? {}) };
          if (newChildTerms.size > 0) {
            nextDrilldown = addChildren(nextDrilldown, parentId, [...newChildTerms]);
            newChildTerms.forEach((childStr) => {
              const child = JSON.parse(childStr);
              if (!(child.id in nextTermProps)) {
                nextTermProps[child.id] = {
                  isTopLevel: child.isTopLevelTerm,
                  isExpanded: child.isExpanded,
                  isPopulated: child.isPopulated,
                  hasBeenQueried: child.hasBeenQueried,
                  isSingleCell: child.isSingleCell,
                };
              }
            });
          }
          return {
            ...prevResult,
            expressionData: {
              ...prevResult.expressionData,
              drilldown: nextDrilldown,
              termProps: nextTermProps,
              expressionCalls: [...prevResult.expressionData.expressionCalls, ...newCalls],
            },
          };
        });

        // Finally, we set the values we are interested in
        setIsLoading(false);
      })
      .catch((error) => {
        if (!axios.isCancel(error)) {
          // keep behavior consistent: ignore non-cancel errors here
        }
      })
      .finally(() => {
        setIsLoadingChildren(false);
        // The next searches will not be considered as the first
        // --> Filters will now be used for the next requests
        setIsFirstSearch(false);
      });
  };

  const AutoCompleteByType = (type, mappingFn) =>
    useCallback(
      async (query) => {
        if (query) {
          return api.search.genes.AutoCompleteByType(type, query, selectedSpecies.value).then((resp) => {
            if (resp.code === 200) {
              const results = resp.data.result.searchMatches || resp.data.result.geneMatches;
              // let list = [];
              const list = results.map(mappingFn);
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
    let shouldResetInitializationFlag = true;
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
            // Keep the flag set so the follow-up effect can trigger the initial search.
            shouldResetInitializationFlag = false;
          }
        }
      }
    } catch (error) {
      console.error('[initFromUrlParams] Error:', error);
    } finally {
      if (shouldResetInitializationFlag) {
        setIsInitializingFromUrl(false);
      }
    }
  };

  // Add useEffect to trigger search when initialization is complete
  useEffect(() => {
    // console.log(
    //   '[useEffect] Triggering search from URL params',
    //   isFirstSearch,
    //   isInitializingFromUrl,
    //   selectedGene,
    //   selectedSpecies,
    //   EMPTY_SPECIES_VALUE
    // );
    if (
      isFirstSearch &&
      isInitializingFromUrl &&
      selectedGene.length > 0 &&
      selectedSpecies.value !== EMPTY_SPECIES_VALUE.value
    ) {
      // console.log('[useEffect] Triggering search from URL params2', isInitializingFromUrl);
      triggerInitialSearch();
      setIsInitializingFromUrl(false); // Reset flag after triggering search
    }
  }, [selectedGene, selectedSpecies]);

  // URL change handler
  useEffect(() => {
    //  console.log(`[useLogic.js] loc.search CHANGED:`, loc.search);

    // Add function to process gene list
    const processGeneList = async (geneListParam) => {
      if (!geneListParam) return;

      setIsProcessingGeneList(true);
      const geneIds = geneListParam.split(/[\r\n]+/);

      try {
        // Get search results for all genes
        const searchResults = await Promise.all(geneIds.map((geneId) => api.search.genes.geneSearchResult(geneId)));

        // Process results
        const validResults = searchResults.filter(
          (result) => result.code === 200 && result.data.result.totalMatchCount === 1
        );

        // Set species
        const firstSpecies = validResults[0].data.result.geneMatches[0].gene.species;
        const speciesValue = {
          label: getSpeciesLabel(firstSpecies),
          value: firstSpecies.id,
        };

        // Set genes
        const genes = validResults.map((result) => {
          const { gene } = result.data.result.geneMatches[0];
          return {
            label: getGeneLabel(gene),
            value: gene.geneId,
          };
        });

        // Update state with species and genes
        setIsInitializingFromUrl(true);
        setSelectedSpeciesFromUrl(speciesValue);
        setSelectedGene(genes);
      } catch (error) {
        console.error('Error processing gene list:', error);
      } finally {
        setIsProcessingGeneList(false);
      }
    };

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

  // Expand or collapse a term
  const onToggleExpandCollapse = (term) => {
    // console.log(`[useLogic] onToggleExpandCollapse:\n${JSON.stringify(term)}`);
    const prev = searchResultRef.current;
    if (!prev?.expressionData) return;
    const anatomicalTerms = prev.expressionData.drilldown ?? [];
    const anatomicalTermsProps = prev.expressionData.termProps ?? {};

    function updateExpandedStateHierarchically(terms) {
      const newTermProps = { ...anatomicalTermsProps };

      // Helper function to recursively traverse the array
      function traverse(node) {
        if (!node || !Array.isArray(node)) return []; // break condition

        // Add property to each element in the current level
        return node.map((item) => {
          const newItem = JSON.parse(JSON.stringify(item));
          if (item.id === term.id) {
            // get data for descendants
            if (!item.hasBeenQueried) {
              // console.log(`[useLogic] onToggleExpandCollapse - get child data for:\n${term.id}`);
              triggerSearchChildren(term.id, term.anatEntityId);
              newItem.hasBeenQueried = true;
              newItem.isExpanded = true;
              newTermProps[term.id].hasBeenQueried = true;
              newTermProps[term.id].isExpanded = true;
            } else {
              // console.log(`[useLogic] flipping item.isExpanded from ${item.isExpanded} to ${!item.isExpanded}.`);
              newItem.isExpanded = !item.isExpanded;
              newItem.isPopulated = item.isPopulated;
              // Update term props
              newTermProps[term.id].isExpanded = !item.isExpanded;
            }
          }
          newItem.children = traverse(newItem.children);
          return newItem;
        });
      }

      // Start traversal from the root
      const newDrilldown = traverse(terms);
      return { newDrilldown, newTermProps };
    }

    const { newDrilldown, newTermProps } = updateExpandedStateHierarchically(anatomicalTerms);

    setSearchResult((latest) => {
      if (!latest?.expressionData) return latest;
      return {
        ...latest,
        expressionData: {
          ...latest.expressionData,
          drilldown: newDrilldown,
          termProps: newTermProps,
        },
      };
    });

    // console.log(`[useLogic] DONE onToggleExpandCollapse.`);
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
    isLoadingChildren,
    isFirstSearch,
    isInitializingFromUrl,
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
    onToggleExpandCollapse,
    processGeneList,
  };
};

export default useLogic;
