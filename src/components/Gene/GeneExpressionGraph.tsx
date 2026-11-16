import { useState, useEffect, useMemo, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router';
import Bulma from '../Bulma';
import api from '../../api';
import Heatmap from '../Heatmap/Heatmap';
import { callDescendantExpressionScore } from '../Heatmap/descendantScore';
import GENE_DETAILS_HTML_IDS from '../../helpers/constants/GeneDetailsHtmlIds';
import { getSpeciesLabel } from '../../helpers/getSpeciesLabel';
import useQuery from '../../hooks/useQuery';
import config from '../../config.json';
import { appendOthersBucket } from '../../helpers/othersAnatomicalBucket';
import { cellTypeGroupIds, readCollapseSingleCell, setCellTypeGroupsExpanded } from '../Heatmap/singleCellRows';
import { CELL_TYPE_ROOT_ID, groupExpandedConditionRows } from './groupExpandedConditionRows';
import type { ExpandedConditionRow } from './groupExpandedConditionRows';

const APP_VERSION = config.version;
const URL_VERSION = APP_VERSION.replaceAll('.', '-');
const URL_ROOT = `${config.archive ? `/${URL_VERSION}` : ''}`;

const logApiError = (context, error, extra = {}) => {
  const responseData = error?.response?.data;
  const payload = {
    message: error?.message || String(error),
    name: error?.name,
    code: error?.code,
    status: error?.response?.status,
    statusText: error?.response?.statusText,
    responseData,
    stack: error?.stack,
    ...extra,
  };

  console.error(`${context} - ERROR`, payload);
};

const DATA_TYPES = [
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

const sameDataTypeSelection = (left: string[], right: string[]) => {
  if (left.length !== right.length) return false;
  const rightKeys = new Set(right);
  return left.every((key) => rightKeys.has(key));
};

const dataTypesFromQuery = (queryValue) => {
  const allowed = new Set(ALL_DATA_TYPES);
  const selected = (queryValue?.toString().split(',') || []).filter((key) => allowed.has(key));
  return selected.length > 0 ? selected : null;
};
export const ROOT_TERM_ANAT_ENTITY = 'UBERON:0001062-GO:0005575';
export const BASE_LIMIT = '10000';
export const EXPR_CALLS = 'expr_calls';

type ExpressionSearchParams = {
  hash: string | null;
  isFirstSearch: boolean;
  initSearch: URLSearchParams;
  pageType: string;
  dataType: string[];
  dataQuality: string;
  selectedExpOrAssay: string[];
  selectedSpecies: unknown;
  selectedGene: string[];
  selectedTissue: string[];
  selectedCellTypes: string[];
  selectedStrain: string[];
  selectedDevStages: string[];
  selectedSexes: string[];
  hasTissueSubStructure: number;
  limit?: string;
  conditionalParam2?: string[];
  condObserved?: number;
  observedData?: boolean;
  discardAnatEntityAndChildrenId?: string;
};

const termPropsFromRow = (row: ExpandedConditionRow) => ({
  label: row.label,
  anatEntityId: row.anatEntityId,
  anatEntityLabel: row.anatEntityLabel,
  cellTypeId: row.cellTypeId,
  cellTypeLabel: row.cellTypeLabel,
  isTopLevelTerm: row.isTopLevelTerm,
  isExpanded: row.isExpanded,
  isPopulated: row.isPopulated,
  hasBeenQueried: row.hasBeenQueried,
  isSingleCell: row.isSingleCell,
  groupedUnderAnatEntity: row.groupedUnderAnatEntity,
  isSyntheticSingleCellGroup: row.isSyntheticSingleCellGroup,
});

type GeneExpressionGraphProps = {
  geneId?: string;
  speciesId?: unknown;
  geneName?: string;
};

const GeneExpressionGraph = ({ geneId, geneName, speciesId }: GeneExpressionGraphProps) => {
  // Init from URL
  const location = useLocation();
  const initSearch = new URLSearchParams(location.search);
  const initHash = initSearch.get('data');
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingChildren, setIsLoadingChildren] = useState(false);
  const [searchResult, setSearchResult] = useState<any>();
  const geneTerms = [
    {
      label: geneName ? `${geneId} - ${geneName}` : geneId,
      value: geneId,
    },
  ];
  const [anatomicalTerms, setAnatomicalTerms] = useState<ExpandedConditionRow[]>([]);
  const collapseSingleCellRef = useRef(readCollapseSingleCell());
  const [anatomicalTermsProps, setAnatomicalTermsProps] = useState<Record<string, any>>({});
  const [dataType, setDataTypes] = useState<string[]>(ALL_DATA_TYPES);
  const dataTypeKey = 'data_type';
  const dataTypeExpr = useQuery(dataTypeKey);

  // Sync local state with URL parameter
  useEffect(() => {
    setDataTypes(dataTypesFromQuery(dataTypeExpr) || ALL_DATA_TYPES);
  }, [dataTypeExpr]);

  const dataTypeFieldsRef = useRef<HTMLDivElement>(null);
  // Checkboxes the user sees. Read at click time so Update is not stuck on a selection
  // that React has not committed yet.
  const selectedDataTypes = () => {
    const inputs = dataTypeFieldsRef.current?.querySelectorAll<HTMLInputElement>('input[type="checkbox"][data-key]');
    if (!inputs?.length) return dataType;
    const checked = new Set(
      [...inputs].filter((input) => input.checked && input.dataset.key).map((input) => input.dataset.key as string)
    );
    return DATA_TYPES.map((type) => type.key).filter((key) => checked.has(key));
  };

  // In order to disable the search button if the search has already been made
  const formSearchButtonIsDisabled = useMemo(() => {
    const oldDataType = dataTypesFromQuery(dataTypeExpr) || ALL_DATA_TYPES;
    return sameDataTypeSelection(dataType, oldDataType);
  }, [dataType, dataTypeExpr]);

  const getSearchParams = (): ExpressionSearchParams => {
    const params: ExpressionSearchParams = {
      hash: initHash,
      isFirstSearch: true,
      initSearch,
      pageType: EXPR_CALLS,
      dataType: dataTypesFromQuery(dataTypeExpr) || ALL_DATA_TYPES,
      // SUMMARY calls ignore this and request bronze. Expansion uses it.
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

  // Top-level calls arrive as one flat list. Cell types are nested under the
  // anatomical entity they belong to, the same way the expression matrix does.
  const prepTermHierarchy = (expressionCalls) => {
    const root: ExpandedConditionRow = {
      id: ROOT_TERM_ANAT_ENTITY,
      label: 'anatomical entity',
      anatEntityId: 'UBERON:0001062',
      anatEntityLabel: 'anatomical entity',
      cellTypeId: CELL_TYPE_ROOT_ID,
      cellTypeLabel: 'cellular component',
      depth: 0,
      isTopLevelTerm: true,
      isExpanded: true,
      isPopulated: true,
      hasBeenQueried: true,
      isSingleCell: false,
      children: [],
    };

    const flatRows: ExpandedConditionRow[] = [];
    const seenRowIds = new Set<string>();
    expressionCalls.forEach((exprCall) => {
      const { id: anatEntityId, name: anatEntityName } = exprCall.condition.anatEntity;
      const { id: cellTypeId, name: cellTypeName } = exprCall.condition.cellType;
      const isSingleCell = cellTypeId !== CELL_TYPE_ROOT_ID;
      if (anatEntityId === 'SUMMARY') return;

      const id = `${anatEntityId}-${cellTypeId}`;
      if (id === ROOT_TERM_ANAT_ENTITY || seenRowIds.has(id)) return;
      seenRowIds.add(id);
      flatRows.push({
        id,
        label: isSingleCell ? `${cellTypeName} in ${anatEntityName}` : anatEntityName,
        anatEntityId,
        anatEntityLabel: anatEntityName,
        cellTypeId,
        cellTypeLabel: cellTypeName,
        depth: 0,
        isTopLevelTerm: !isSingleCell,
        isExpanded: false,
        isPopulated: true,
        hasBeenQueried: false,
        isSingleCell,
        children: [],
      });
    });

    root.children = groupExpandedConditionRows(flatRows, {
      parentId: ROOT_TERM_ANAT_ENTITY,
      parentDepth: 0,
      parentAnatEntityId: 'UBERON:0001062',
      cellTypesExpanded: !collapseSingleCellRef.current,
      groupHeadersAreTopLevel: true,
    });

    const termProps: Record<string, ReturnType<typeof termPropsFromRow>> = {};
    const addTermProps = (node: ExpandedConditionRow) => {
      termProps[node.id] = termPropsFromRow(node);
      node.children?.forEach(addTermProps);
    };
    addTermProps(root);

    const anatTerms = [root];
    appendOthersBucket(anatTerms, termProps);
    return { anatTerms, termProps };
  };

  const triggerInitialSearch = async () => {
    const params = getSearchParams();

    // console.log(`[GeneExpressionGraph.triggerInitialSearch] selected gene:\n${JSON.stringify(params.selectedGene)}`);
    // console.log(`[GeneExpressionGraph.triggerInitialSearch] selected species:\n${JSON.stringify(params.selectedSpecies)}`);
    // console.log(`[GeneExpressionGraph.triggerInitialSearch] params:\n${JSON.stringify(params)}`);

    setIsLoading(true);

    try {
      const { resp } = await api.search.geneExpressionMatrix.initialSearch(params);

      if (resp.code === 200) {
        const { anatTerms, termProps } = prepTermHierarchy(resp.data.expressionData.expressionCalls);
        setAnatomicalTerms(anatTerms);
        setAnatomicalTermsProps(termProps);
        setIsLoading(false);
        setSearchResult(resp.data);
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      logApiError('[GeneExpressionGraph.triggerInitialSearch]', error, {
        params: getSearchParams(),
      });
      setIsLoading(false);
    } finally {
      // console.log(`[GeneExpressionGraph.triggerInitialSearch] finally.`)
    }
  };

  useEffect(() => {
    triggerInitialSearch();
  }, [geneId, speciesId, dataTypeExpr]);

  // Perform API data request for subordinate terms
  const triggerSearchChildren = async (parentId, selectedTissueId) => {
    // DEBUG: remove console log in prod
    console.log(`[GeneExpressionGraph] triggerSearchChildren:\n"${parentId}"`);

    const params = getSearchParams();
    params.isFirstSearch = false;
    // Set parent anatomical term as selected tissue
    params.selectedTissue = [selectedTissueId];
    // Do not send cell_type_id — child expansion is anatomical terms only.
    params.hasTissueSubStructure = 1; // we want children of parent term!
    params.limit = BASE_LIMIT;
    params.conditionalParam2 = ['anat_entity']; // restrict to anatomical terms
    params.condObserved = 1;
    params.observedData = true;
    // Partition the SUMMARY forest: punch out other top-level organ subtrees.
    // The backend ignores discard seeds that are ancestors of the include term, so this
    // is safe for nested SUMMARY organs (e.g. CNS) as well as the residual bucket.
    params.discardAnatEntityAndChildrenId = 'SUMMARY';

    setIsLoadingChildren(true);
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

        // Child calls use a parent prefix so the same condition under two organs
        // stays a distinct row. Cell types are then nested under their organ.
        const newCalls = (resp?.data?.expressionData?.expressionCalls || []).map((exprCall) => ({
          ...exprCall,
          condition: {
            ...exprCall.condition,
            anatEntity: {
              ...exprCall.condition.anatEntity,
              dataId: `${parentId}--${exprCall.condition.anatEntity.id}`,
            },
          },
        }));

        const flatRows: ExpandedConditionRow[] = [];
        const seenRowIds = new Set<string>();
        newCalls.forEach((exprCall) => {
          const { id: anatEntityId, name: anatEntityName } = exprCall.condition.anatEntity;
          const { id: cellTypeId, name: cellTypeName } = exprCall.condition.cellType;
          const isSingleCell = cellTypeId !== CELL_TYPE_ROOT_ID;
          if (anatEntityId === 'SUMMARY') return;
          // The expanded organ stays the parent row. Its own cell types are still children.
          if (anatEntityId === selectedTissueId && !isSingleCell) return;

          const id = `${parentId}--${anatEntityId}-${cellTypeId}`;
          if (seenRowIds.has(id)) return;
          seenRowIds.add(id);
          flatRows.push({
            id,
            label: isSingleCell ? `${cellTypeName} in ${anatEntityName}` : anatEntityName,
            anatEntityId,
            anatEntityLabel: anatEntityName,
            cellTypeId,
            cellTypeLabel: cellTypeName,
            depth: 0,
            isTopLevelTerm: false,
            isExpanded: false,
            isPopulated: true,
            hasBeenQueried: false,
            isSingleCell,
            children: [],
          });
        });

        function findNodeDepth(nodes: ExpandedConditionRow[] | undefined, id: string): number | undefined {
          if (!Array.isArray(nodes)) return undefined;
          for (const node of nodes) {
            if (node.id === id) return node.depth ?? 0;
            const childDepth = findNodeDepth(node.children, id);
            if (childDepth !== undefined) return childDepth;
          }
          return undefined;
        }

        function addChildren(
          hierarchy: ExpandedConditionRow[],
          termId: string,
          children: ExpandedConditionRow[]
        ): ExpandedConditionRow[] {
          function traverse(node: ExpandedConditionRow[]): ExpandedConditionRow[] {
            if (!node || !Array.isArray(node)) return [];

            return node.map((item) => {
              const newItem = { ...item, children: [...(item.children || [])] };
              if (item.id === termId) {
                children.forEach((child) => {
                  if (child.id !== newItem.id) newItem.children.push(child);
                });
                newItem.isExpanded = true;
                newItem.hasBeenQueried = true;
              }
              newItem.children = traverse(newItem.children);
              return newItem;
            });
          }

          return traverse(hierarchy);
        }

        if (flatRows.length > 0) {
          const parentDepth = findNodeDepth(anatomicalTerms, parentId) ?? 0;
          const grouped = groupExpandedConditionRows(flatRows, {
            parentId,
            parentDepth,
            parentAnatEntityId: selectedTissueId,
            cellTypesExpanded: !collapseSingleCellRef.current,
          });
          setAnatomicalTerms((prevTerms) => addChildren(prevTerms, parentId, grouped));
          setAnatomicalTermsProps((prevProps) => {
            const newAnatTermsProps = { ...prevProps };
            const walk = (nodes: ExpandedConditionRow[]) => {
              nodes.forEach((child) => {
                if (!(child.id in newAnatTermsProps)) {
                  newAnatTermsProps[child.id] = termPropsFromRow(child);
                }
                if (child.children?.length) walk(child.children);
              });
            };
            walk(grouped);
            return newAnatTermsProps;
          });
        }

        // add additional data to previous ones
        setSearchResult((prevResult) => {
          if (!prevResult?.expressionData?.expressionCalls) return prevResult;
          return {
            ...prevResult,
            expressionData: {
              ...prevResult.expressionData,
              expressionCalls: [...prevResult.expressionData.expressionCalls, ...newCalls],
            },
          };
        });

        // Finally, we set the values we are interested in
      })
      .catch((error) => {
        logApiError('[GeneExpressionGraph] triggerSearchChildren', error, {
          parentId,
          selectedTissueId,
          params,
        });
      })
      .finally(() => {
        setIsLoadingChildren(false);
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

  // Collapse hides cell types and leaves [+] on each group. Opening one group
  // does not turn the option off.
  const handleCollapseSingleCellChange = (collapsed: boolean) => {
    collapseSingleCellRef.current = collapsed;
    const expanded = !collapsed;
    setAnatomicalTerms((prev) => setCellTypeGroupsExpanded(prev, expanded));
    setAnatomicalTermsProps((prev) => {
      const next = { ...prev };
      cellTypeGroupIds(anatomicalTerms).forEach((id) => {
        if (!next[id]) return;
        next[id] = { ...next[id], isExpanded: expanded };
      });
      return next;
    });
  };

  const heatmapData =
    searchResult?.expressionData?.expressionCalls?.map((result) => {
      const { geneId: gId, name: gName } = result.gene;
      const specId = result.gene.species.id;
      const { id: anatEntityId, name: anatEntityName, dataId: anatEntityDataId } = result.condition.anatEntity;
      const { id: cellTypeId, name: cellTypeName } = result.condition.cellType;
      const termId = anatEntityDataId ? `${anatEntityDataId}-${cellTypeId}` : `${anatEntityId}-${cellTypeId}`;
      const termName = cellTypeId !== 'GO:0005575' ? `${anatEntityName} : ${cellTypeName}` : anatEntityName;
      const expScore = result.expressionScore.expressionScore;
      const isExpressed = result.expressionState === 'expressed';
      const maxExp = callDescendantExpressionScore(result);

      return {
        x: gId, // Use geneId for x coordinate (matches xTerms.value for scale domain)
        y: termId,
        termId,
        termName,
        geneId: gId,
        geneName: gName,
        speciesId: specId,
        speciesLabel: getSpeciesLabel(result.gene.species),
        anatEntityId,
        anatEntityName,
        cellTypeId,
        cellTypeName,
        value: expScore,
        ...(maxExp != null ? { maxExp } : {}),
        isExpressed,
        expressionQuality: result.expressionQuality,
        hasDataInSitu: result.dataTypesWithData.IN_SITU,
        hasDataRnaSeq: result.dataTypesWithData.RNA_SEQ,
        hasDataScRnaSeq: result.dataTypesWithData.SC_RNA_SEQ,
        ylvl: 0,
      };
    }) || [];
  const isBusy = isLoading || isLoadingChildren;

  return (
    <>
      <Bulma.Title size={4} className="gradient-underline" id={GENE_DETAILS_HTML_IDS.EXPRESSION_GRAPH} renderAs="h2">
        Expression graph
      </Bulma.Title>
      <div>
        {isBusy && (
          <progress className="progress is-small" max="100" style={{ animationDuration: '4s' }}>
            80%
          </progress>
        )}

        <div ref={dataTypeFieldsRef} className="is-flex is-flex-wrap-wrap gene-expr-fields-wrapper mt-2">
          {DATA_TYPES.map((c) => (
            <label className="checkbox ml-2 is-size-7 is-flex is-align-items-center" key={c.key}>
              <input
                type="checkbox"
                data-key={c.key}
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
            disabled={sameDataTypeSelection(dataType, ALL_DATA_TYPES)}
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
              const selected = selectedDataTypes();
              const queryParams = new URLSearchParams(window.location.search);
              if (!sameDataTypeSelection(selected, ALL_DATA_TYPES) && selected.length > 0)
                queryParams.set(dataTypeKey, selected.join(','));
              else queryParams.delete(dataTypeKey);

              navigate(`${URL_ROOT}${location.pathname}?${queryParams.toString()}`, {
                replace: true,
                preventScrollReset: true,
              });
            }}
          >
            Update
          </Bulma.Button>
        </div>

        {!isLoading && searchResult && anatomicalTerms.length > 0 && (
          <Heatmap
            data={heatmapData}
            getChildData={triggerSearchChildren}
            xTerms={geneTerms}
            yTerms={anatomicalTerms}
            termProps={anatomicalTermsProps}
            onToggleExpandCollapse={onToggleExpandCollapse}
            onCollapseSingleCellChange={handleCollapseSingleCellChange}
            isLoading={isLoading}
            width={800}
            height={800}
            backgroundColor="white"
            descendantScoreMode="border"
          />
        )}
        {!isLoading && searchResult && anatomicalTerms.length === 0 && heatmapData.length === 0 && (
          <div className="is-flex is-justify-content-center is-align-items-center">
            <p className="is-size-4">No data found</p>
          </div>
        )}
      </div>
    </>
  );
};

export default GeneExpressionGraph;
