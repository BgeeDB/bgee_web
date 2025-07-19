import { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';

import Bulma from '../Bulma';
import api from '../../api';
import Heatmap from '../Heatmap/Heatmap';
import GENE_DETAILS_HTML_IDS from '../../helpers/constants/GeneDetailsHtmlIds';
import useQuery from '../../hooks/useQuery';
import { URL_ROOT } from '~/helpers/constants';

const DATA_TYPES = [
  {
    key: 'AFFYMETRIX',
    text: 'Affymetrix',
  },
  {
    key: 'EST',
    text: 'EST',
  },
  {
    key: 'IN_SITU',
    text: 'In Situ',
  },
  {
    key: 'RNA_SEQ',
    text: 'RNA Seq',
  },
  {
    key: 'SC_RNA_SEQ',
    text: 'scRNA-Seq',
  },
];
export const ALL_DATA_TYPES = DATA_TYPES.map((data) => data.key);
export const ROOT_TERM_ANAT_ENTITY = 'UBERON:0001062-GO:0005575';
export const BASE_LIMIT = '10000';
export const EXPR_CALLS = 'expr_calls';

const GeneExpressionGraph = ({ geneId, geneName, speciesId }) => {
  // Init from URL
  const loc = useLocation();
  const initSearch = new URLSearchParams(loc.search);
  const initHash = initSearch.get('data');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [searchResult, setSearchResult]: any = useState();
  const [geneTerms, setGeneTerms]: any = useState([{ label: `${geneId} - ${geneName}`, value: geneId }]);
  const [anatomicalTerms, setAnatomicalTerms]: [any[], any] = useState([]);
  const [anatomicalTermsProps, setAnatomicalTermsProps] = useState({});
  const [dataType, setDataTypes] = useState(ALL_DATA_TYPES);
  const dataTypeKey = 'data_type';
  const dataTypeExpr = useQuery(dataTypeKey);

  // Sync local state with URL parameter
  useEffect(() => {
    if (dataTypeExpr) {
      setDataTypes(dataTypeExpr.toString().split(','));
    } else {
      setDataTypes(ALL_DATA_TYPES);
    }
  }, [dataTypeExpr]);

  // In order to disable the search button if the search has already been made
  const formSearchButtonIsDisabled = useMemo(() => {
    const oldDataType = (dataTypeExpr?.toString().split(',') || DATA_TYPES.map((d) => d.key)).sort();

    return JSON.stringify(dataType.sort()) === JSON.stringify(oldDataType);
  }, [dataType, dataTypeExpr]);

  const getSearchParams = (): any => {
    const params = {
      hash: initHash,
      isFirstSearch: true,
      initSearch,
      pageType: EXPR_CALLS,
      dataType: dataTypeExpr?.toString().split(',') || ALL_DATA_TYPES,
      dataQuality: 'SILVER',
      selectedExpOrAssay: [],
      selectedSpecies: speciesId,
      selectedGene: geneId ? [geneId] : [],
      selectedTissue: [],
      selectedCellTypes: [],
      selectedStrain: [],
      selectedDevStages: [],
      selectedSexes: ['all'],
      // hasCellTypeSubStructure: 0,
      // hasDevStageSubStructure: 0,
      hasTissueSubStructure: 0,
    };

    return params;
  };

  // prepare term hierarchy from gene expression call data
  const prepTermHierarchy = (expressionCalls) => {
    const termProps = {
      'UBERON:0001062-GO:0005575': {
        label: 'anatomical entity',
        anatEntityId: 'UBERON:0001062',
        anatEntityLabel: 'anatomical entity',
        cellTypeId: 'GO:0005575',
        cellTypeLabel: 'cellular component',
        isTopLevelTerm: true,
        isExpanded: true,
        isPopulated: false,
        hasBeenQueried: true,
        isSingleCell: false,
      },
    };
    const parents = { [ROOT_TERM_ANAT_ENTITY]: [] };
    const children: { [key: string]: string[] } = { [ROOT_TERM_ANAT_ENTITY]: [] };
    expressionCalls.forEach((exprCall) => {
      const { id: anatEntityId, name: anatEntityName } = exprCall.condition.anatEntity;
      const { id: cellTypeId, name: cellTypeName } = exprCall.condition.cellType;
      const termIsSingleCell = cellTypeId !== 'GO:0005575';
      const termId = `${anatEntityId}-${cellTypeId}`;
      const termLabel = termIsSingleCell ? `${anatEntityName} : ${cellTypeName}` : anatEntityName;
      if (!(termId in termProps)) {
        termProps[termId] = {
          label: termLabel,
          anatEntityId,
          anatEntityLabel: anatEntityName,
          cellTypeId,
          cellTypeLabel: cellTypeName,
          isTopLevelTerm: true,
          isExpanded: true,
          isPopulated: false,
          hasBeenQueried: true,
          isSingleCell: termIsSingleCell,
        };

        if (termId !== ROOT_TERM_ANAT_ENTITY) {
          parents[termId] = [ROOT_TERM_ANAT_ENTITY];
          children[ROOT_TERM_ANAT_ENTITY].push(termId);
        }
      }
    });

    // identify root terms
    const roots = Object.keys(parents).filter((id) => parents[id].length === 0);

    function createNestedStructure(termId, depth = 0) {
      // console.log(`[createNestedStructure] ${termId} - ${depth}`);
      // Get the term's properties
      const term = termProps[termId];
      if (!term) {
        console.error(`[GeneExpressionGraph.prepTermHierarchy] term not found: ${termId}`);
      }
      // Initialize the nested structure
      const nestedTerm: any = {
        id: termId,
        label: term.isSingleCell ? `${term.label} : ${term.cellTypeLabel}` : term.label,
        anatEntityId: term.anatEntityId,
        anatEntityLabel: term.anatEntityLabel,
        cellTypeId: term.cellTypeId,
        cellTypeLabel: term.cellTypeLabel,
        depth,
        isTopLevelTerm: true,
        isExpanded: depth === 0,
        isPopulated: true,
        hasBeenQueried: depth === 0,
        isSingleCell: term.isSingleCell,
        children: [],
      };

      // If the term has children, recursively create their nested structure
      if (children[termId]) {
        nestedTerm.children = children[termId].map((childId) => createNestedStructure(childId, depth + 1));
      }

      return nestedTerm;
    }

    // Create the nested structure for each root term
    // console.log(`[GeneExpressionGraph.prepTermHierarchy] termProps:\n${JSON.stringify(termProps)}`);
    // console.log(`[GeneExpressionGraph.prepTermHierarchy] roots:\n${JSON.stringify(roots)}`);
    const anatTerms = roots.map((root) => createNestedStructure(root));
    // console.log(`[GeneExpressionGraph.triggerInitialSearch] anatTerms (top-level):\n${JSON.stringify(anatTerms, null, 2)}`);

    return { anatTerms, termProps };
  };

  // add lower level ontology terms to existing hierarchy based on exression call data
  const addLowLevelTerms = (parentId, nestedStructure, terms, expressionCalls) => {
    // Make a copy of termProps to avoid reassigning the parameter directly
    const newTerms = {};

    // Helper function to recursively find the term by id and add children
    const addChildren = (term) => {
      // Check if the current term's id matches the parentId
      if (term.id === parentId) {
        // Loop through each expressionCall and add children to the term
        expressionCalls.forEach((call) => {
          const { anatEntity, cellType } = call.condition;
          const termId = `${anatEntity.id}-${cellType.id}`;
          const termLabel = cellType.id !== 'GO:0005575' ? `${anatEntity.name} : ${cellType.name}` : anatEntity.name;
          if (!(termId in terms) && !(termId in newTerms)) {
            const newChild = {
              id: termId,
              label: termLabel,
              anatEntityId: anatEntity.id,
              anatEntityLabel: anatEntity.name,
              cellTypeId: cellType.id,
              cellTypeLabel: cellType.name,
              depth: term.depth + 1,
              isTopLevelTerm: false,
              children: [],
            };
            term.children.push(newChild);
            // Add the new term to termProps
            newTerms[termId] = {
              label: termLabel,
              isTopLevel: false,
            };
          }
        });
      } else {
        // If not the matching term, recurse into its children
        term.children.forEach((child) => addChildren(child));
      }
    };

    // Start the recursive search from each root term in the nested structure
    nestedStructure.forEach((root) => addChildren(root));

    // Return the updated termProps
    return newTerms;
  };

  const triggerInitialSearch = async () => {
    const params = getSearchParams();

    // console.log(`[GeneExpressionGraph.triggerInitialSearch] selected gene:\n${JSON.stringify(params.selectedGene)}`);
    // console.log(`[GeneExpressionGraph.triggerInitialSearch] selected species:\n${JSON.stringify(params.selectedSpecies)}`);
    // console.log(`[GeneExpressionGraph.triggerInitialSearch] params:\n${JSON.stringify(params)}`);

    setIsLoading(true);

    try {
      // console.log(`[GeneExpressionGraph.triggerInitialSearch] submitting API requests...`);
      const [result1, result2] = await Promise.all([
        api.search.geneExpressionMatrix.initialSearch(params),
        api.search.geneExpressionMatrix.initialSearchComplementary(params),
      ]);

      const { resp: resp1 } = result1;
      const { resp: resp2 } = result2;

      if (resp1.code === 200 && resp2.code === 200) {
        // console.log(JSON.stringify(resp1));
        // console.log(JSON.stringify(resp2));

        const { anatTerms, termProps } = prepTermHierarchy(resp1.data.expressionData.expressionCalls);
        // console.log(`[GeneExpressionGraph.triggerInitialSearch] anatTerms:\n${JSON.stringify(anatTerms)}`);
        setAnatomicalTerms(anatTerms);
        // console.log(`[GeneExpressionGraph.triggerInitialSearch] termProps:\n${JSON.stringify(termProps)}`);
        const newTermProps = addLowLevelTerms(
          ROOT_TERM_ANAT_ENTITY,
          anatTerms,
          termProps,
          resp2.data.expressionData.expressionCalls
        );
        Object.assign(termProps, newTermProps);
        setAnatomicalTermsProps(termProps);

        const { data } = resp1;
        data.expressionData.expressionCalls.push(...resp2.data.expressionData.expressionCalls);

        setIsLoading(false);
        setSearchResult(data);
      }
    } catch (error) {
      console.log(`[GeneExpressionGraph.triggerInitialSearch] ERROR:\n${JSON.stringify(error)}`);
      setIsLoading(false);
    } finally {
      // console.log(`[GeneExpressionGraph.triggerInitialSearch] finally.`)
    }
  };

  useEffect(() => {
    const params = getSearchParams();
    triggerInitialSearch();
  }, [geneId, speciesId, dataTypeExpr]);

  // Perform API data request for subordinate terms
  const triggerSearchChildren = async (parentId: string, selectedTissueId: string) => {
    const params = getSearchParams();
    params.isFirstSearch = false;
    // Set parent anatomical term as selected tissue
    params.selectedTissue = [selectedTissueId];
    // Fix other condition params to top-level terms (overrides form fields!)
    params.hasTissueSubStructure = 1; // we want children of parent term!
    params.limit = BASE_LIMIT;
    params.conditionalParam2 = ['anat_entity']; // restrict to anatomical terms
    params.condObserved = 1;
    // HD: discard top-level terms from search results
    // NOTE: use only when we want to get children of "multicellular organism"
    if (parentId === 'UBERON:0000468-GO:0005575') {
      console.log(`[GeneExpressionGraph] !use discardAnatEntityAndChildrenId: SUMMARY!`);
      params.discardAnatEntityAndChildrenId = 'SUMMARY';
    }

    setIsLoading(true);
    // DEBUG: remove console log in prod
    // console.log(`[GeneExpressionGraph] triggerSearchChildren - triggered!`);
    // console.log(`[GeneExpressionGraph] triggerSearchChildren - params:\n${JSON.stringify(params)}`);
    return api.search.geneExpressionMatrix
      .search(params, false)
      .then(({ resp, paramsURLCalled }) => {
        // DEBUG: remove in prod
        // console.log(`[GeneExpressionGraph] triggerSearchChildren - response:\n${JSON.stringify(resp)}`);
        if (resp.code === 200) {
          // DEBUG: remove console log in prod
          // console.log(`[GeneExpressionGraph] triggerSearchChildren - resp.data:\n${JSON.stringify(resp.data)}`);
          // console.log(`[GeneExpressionGraph] triggerSearchChildren - params:\n${JSON.stringify(params)}`)

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
        }

        // update anatomical terms
        const newChildTerms = new Set<any>();
        resp?.data.expressionData.expressionCalls.forEach((exprCall) => {
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

        function addChildren(hierarchy, termId, children) {
          // Helper function to recursively traverse the array
          function traverse(node) {
            if (!node || !Array.isArray(node)) return []; // break condition

            // Add property to each element in the current level
            return node.map((item) => {
              const newItem = { ...item };
              if (item.id === termId) {
                // add children
                // console.log(`[Heatmap GeneExpressionGraph] adding children for:\n${termId} -> ${JSON.stringify([...children])}`);
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

        // console.log(`[GeneExpressionGraph] triggerSearchChildren newChildTerms:\n${JSON.stringify([...newChildTerms], null, 2)}`);
        if (newChildTerms.size > 0) {
          const newAnatTerms = addChildren(anatomicalTerms, parentId, [...newChildTerms]);
          // DEBUG: remove console log in prod
          // console.log(`[GeneExpressionGraph] triggerSearchChildren anatomicalTerms:\n${JSON.stringify(anatomicalTerms)}`);
          // console.log(`[GeneExpressionGraph] triggerSearchChildren newAnatTerms:\n${JSON.stringify(newAnatTerms)}`);
          // console.log(`[GeneExpressionGraph] CALL setAnatomicalTerms`);
          setAnatomicalTerms(newAnatTerms);
          // add term props for new terms
          const newAnatTermsProps = { ...anatomicalTermsProps };
          newChildTerms.forEach((childStr) => {
            const child = JSON.parse(childStr); // Parse the stringified child object
            if (!(child.id in newAnatTermsProps)) {
              newAnatTermsProps[child.id] = {
                label: child.label,
                anatEntityId: child.anatEntityId,
                anatEntityLabel: child.anatEntityLabel,
                cellTypeId: child.cellTypeId,
                cellTypeLabel: child.cellTypeLabel,
                isTopLevelTerm: child.isTopLevelTerm,
                isExpanded: child.isExpanded,
                isPopulated: child.isPopulated,
                hasBeenQueried: child.hasBeenQueried,
                isSingleCell: child.isSingleCell,
              };
            }
          });
          // console.log(`[GeneExpressionGraph] triggerSearchChildren newAnatTermsProps:\n${JSON.stringify(newAnatTermsProps)}`);
          setAnatomicalTermsProps(newAnatTermsProps);
        }

        // add additional data to previous ones
        const exprData = searchResult;
        if (resp) exprData.expressionData.expressionCalls.push(...resp.data.expressionData.expressionCalls);
        setSearchResult(exprData);

        // Finally, we set the values we are interested in
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(`[GeneExpressionGraph] triggerSearchChildren - ERROR:\n${JSON.stringify(error)}`);
        setIsLoading(false);
      });
  };

  // updates component state!
  const onToggleExpandCollapse = (term) => {
    // console.log(`[GeneExpressionGraph] onToggleExpandCollapse:\n${JSON.stringify(term)}`);

    function updateExpandedStateHierarchically(terms) {
      const newTermProps = { ...anatomicalTermsProps };
      // Helper function to recursively traverse the array
      function traverse(node) {
        if (!node || !Array.isArray(node)) return []; // break condition

        // Add property to each element in the current level
        return node.map((item) => {
          const newItem = JSON.parse(JSON.stringify(item)); // { ...item };
          if (item.id === term.id) {
            // get data for descendants
            if (!item.hasBeenQueried) {
              // console.log(`[GeneExpressionGraph] onToggleExpandCollapse - get child data for:\n${term.id}`);
              triggerSearchChildren(term.id, term.anatEntityId);
              newItem.hasBeenQueried = true;
              newItem.isExpanded = true;
              newTermProps[term.id].hasBeenQueried = true;
              newTermProps[term.id].isExpanded = true;
            } else {
              // console.log(`[GeneExpressionGraph] flipping item.isExpanded from ${item.isExpanded} to ${!item.isExpanded}.`);
              newItem.isExpanded = !item.isExpanded; // Flip expanded state
              newItem.isPopulated = item.isPopulated; // Keep populated state
            }
          }
          newItem.children = traverse(newItem.children); // Recursively traverse children
          if (item.termId === term.id) {
            // console.log(JSON.stringify(newItem));
          }
          return newItem;
        });
      }

      // Start traversal from the root
      const newDrilldown = traverse(terms);
      return { newDrilldown, newTermProps };
    }

    const { newDrilldown, newTermProps } = updateExpandedStateHierarchically(anatomicalTerms);
    // console.log(`[GeneExpressionGraph] CALL setAnatomicalTermsProps...`);
    setAnatomicalTermsProps(newTermProps);
    // console.log(`[GeneExpressionGraph] CALL setAnatomicalTerms...`);
    setAnatomicalTerms(newDrilldown);
    // console.log(`[GeneExpressionGraph] DONE onToggleExpandCollapse.`);
  };

  const heatmapData =
    searchResult?.expressionData?.expressionCalls?.map((result) => {
      const { geneId: gId, name: gName } = result.gene;
      const specId = result.gene.species.id;
      const { id: anatEntityId, name: anatEntityName } = result.condition.anatEntity;
      const { id: cellTypeId, name: cellTypeName } = result.condition.cellType;
      const termId = `${anatEntityId}-${cellTypeId}`;
      const termName = cellTypeId !== 'GO:0005575' ? `${anatEntityName} : ${cellTypeName}` : anatEntityName;
      const expScore = result.expressionScore.expressionScore;
      const isExpressed = result.expressionState === 'expressed';

      return {
        x: gName?.length > 0 ? gName : gId,
        y: termId,
        termId,
        termName,
        geneId: gId,
        geneName: gName,
        speciesId: specId,
        anatEntityId,
        anatEntityName,
        cellTypeId,
        cellTypeName,
        value: expScore,
        isExpressed,
        hasDataAffy: result.dataTypesWithData.AFFYMETRIX,
        hasDataEst: result.dataTypesWithData.EST,
        hasDataInSitu: result.dataTypesWithData.IN_SITU,
        hasDataRnaSeq: result.dataTypesWithData.RNA_SEQ,
        hasDataScRnaSeq: result.dataTypesWithData.SC_RNA_SEQ,
        ylvl: 0,
      };
    }) || [];

  return (
    <>
      <Bulma.Title size={4} className="gradient-underline" id={GENE_DETAILS_HTML_IDS.EXPRESSION_GRAPH} renderAs="h2">
        Expression graph
      </Bulma.Title>
      <div>
        {isLoading && (
          <progress className="progress is-small" max="100" style={{ animationDuration: '4s' }}>
            80%
          </progress>
        )}

        <div className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper mt-2">
          {DATA_TYPES.map((c) => (
            <label className="checkbox ml-2 is-size-7 is-flex is-align-items-center" key={c.key}>
              <input
                type="checkbox"
                checked={!!dataType.find((d) => d === c.key)}
                onChange={(e) => {
                  setDataTypes((prev) => {
                    const curr = [...prev];
                    if (e.target.checked) {
                      curr.push(c.key);
                    } else {
                      const pos = curr.findIndex((d) => d === c.key);
                      if (pos >= 0) curr.splice(pos, 1);
                    }
                    return curr;
                  });
                }}
              />
              <b className="mx-1">{c.text}</b>
            </label>
          ))}
          <Bulma.Button
            className="search-form"
            disabled={JSON.stringify(dataType.sort()) === JSON.stringify(DATA_TYPES.map((d) => d.key).sort())}
            onClick={() => setDataTypes(DATA_TYPES.map((d) => d.key))}
          >
            Select All
          </Bulma.Button>
          <Bulma.Button className="search-form" disabled={dataType.length === 0} onClick={() => setDataTypes([])}>
            Unselect All
          </Bulma.Button>
        </div>
        <div className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper mt-2 mb-4">
          <Bulma.Button
            className="search-form"
            disabled={formSearchButtonIsDisabled}
            onClick={() => {
              const queryParams = new URLSearchParams(window.location.search);
              if (
                JSON.stringify(dataType.sort()) !== JSON.stringify(DATA_TYPES.map((d) => d.key).sort()) &&
                dataType.length > 0
              )
                queryParams.set(dataTypeKey, dataType.join(','));
              else queryParams.delete(dataTypeKey);

              navigate(`${URL_ROOT}${loc.pathname}?${queryParams.toString()}`, {
                replace: true,
                preventScrollReset: true,
              });
            }}
          >
            Update
          </Bulma.Button>
        </div>

        {!isLoading && searchResult && heatmapData.length > 0 && (
          <Heatmap
            data={heatmapData}
            getChildData={triggerSearchChildren}
            xTerms={geneTerms}
            yTerms={anatomicalTerms}
            termProps={anatomicalTermsProps}
            onToggleExpandCollapse={onToggleExpandCollapse}
            width={800}
            height={800}
            backgroundColor="white"
          />
        )}
        {!isLoading && searchResult && heatmapData.length === 0 && (
          <div className="is-flex is-justify-content-center is-align-items-center">
            <p className="is-size-4">No data found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default GeneExpressionGraph;
