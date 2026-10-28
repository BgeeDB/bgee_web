import { useState, useEffect, useMemo, useRef } from 'react';

import { getSpeciesLabel } from '../../helpers/getSpeciesLabel';
import { appendOthersBucket } from '../../helpers/othersAnatomicalBucket';
import Heatmap from '../Heatmap/Heatmap';
import { CELL_TYPE_ROOT_ID, groupExpandedConditionRows } from './groupExpandedConditionRows';
import { cellTypeGroupIds, readCollapseSingleCell, setCellTypeGroupsExpanded } from '../Heatmap/singleCellRows';
import type { ExpandedConditionRow } from './groupExpandedConditionRows';

const ROOT_TERM_ANAT_ENTITY = 'UBERON:0001062-GO:0005575';

// Content signature for the calls that define the initial tree. Array identity is not
// enough: parents often map the same results into a new array on an unrelated re-render.
const expressionCallsContentKey = (calls: ExpressionCall[] | undefined): string => {
  if (!calls?.length) return '';
  return calls
    .map((call) => {
      const anat = call.condition?.anatEntity;
      const cell = call.condition?.cellType;
      const types = call.dataTypesWithData;
      return [
        call.gene?.geneId ?? '',
        anat?.id ?? '',
        anat?.name ?? '',
        anat?.dataId ?? '',
        cell?.id ?? '',
        cell?.name ?? '',
        call.expressionScore?.expressionScore ?? '',
        call.expressionState ?? '',
        call.expressionQuality ?? '',
        types?.IN_SITU ? 1 : 0,
        types?.RNA_SEQ ? 1 : 0,
        types?.SC_RNA_SEQ ? 1 : 0,
      ].join('\u001f');
    })
    .join('\u001e');
};

const getSpeciesDisplayName = (species?: { name?: string; genus?: string; speciesName?: string }) => {
  const commonName = species?.name?.trim();
  if (commonName) {
    return commonName;
  }
  const genus = species?.genus?.trim();
  const speciesName = species?.speciesName?.trim();
  if (genus && speciesName) {
    return `${genus} ${speciesName}`;
  }
  return 'Unknown species';
};

const getAxisLabels = ({
  geneId,
  geneName,
  species,
  isMultispecies,
}: {
  geneId: string;
  geneName?: string | null;
  species?: { name?: string; genus?: string; speciesName?: string };
  isMultispecies: boolean;
}) => {
  const trimmedName = geneName?.trim();
  // One line only. A second line (the gene id under the name) overlaps its neighbors
  // once columns shrink to fit a long gene list.
  const bottomLabel = trimmedName || geneId;
  if (!isMultispecies) {
    return {
      topLabel: '',
      bottomLabel,
    };
  }
  return {
    topLabel: getSpeciesDisplayName(species),
    bottomLabel,
  };
};

export interface Gene {
  id: string;
  label: string;
  name?: string;
  value?: string;
  species?: {
    id?: string | number;
    name?: string;
    genus?: string;
    speciesName?: string;
  };
}

export interface ExpressionCall {
  gene: {
    geneId: string;
    name: string;
    species: { id: string; name?: string; genus?: string; speciesName?: string };
  };
  condition: {
    anatEntity: {
      id: string;
      name: string;
      dataId?: string;
    };
    cellType: {
      id: string;
      name: string;
    };
  };
  expressionScore: { expressionScore: number };
  expressionState: string;
  expressionQuality?: string;
  dataTypesWithData: {
    IN_SITU: boolean;
    RNA_SEQ: boolean;
    SC_RNA_SEQ: boolean;
  };
}

export interface GeneExpressionHeatmapProps {
  // Input data
  expressionCalls: ExpressionCall[];
  genes: Gene[];

  // Optional configuration
  species?: any | null;
  tissues?: any[] | null;
  cellTypes?: any[] | null;
  dataTypes?: string[];
  dataQuality?: string | null;

  // Callbacks
  onFetchChildren?: (parentId: string, tissueId: string) => Promise<ExpressionCall[]>;
  onToggleExpandCollapse?: (term: any) => void;

  // Display options
  width?: number;
  height?: number;
  backgroundColor?: string;
  isLoading?: boolean;
  xLabelRotation?: number;
  maxGraphWidth?: number;
  cellHeight?: number;
  showResetButton?: boolean;
  rendererMargins?: { top: number; right: number; bottom: number; left: number };
  // Default SUMMARY view: show the expandable "others" bucket under the anatomical root.
  showOthersBucket?: boolean;
}

const GeneExpressionHeatmap = ({
  expressionCalls,
  genes,
  onFetchChildren,
  onToggleExpandCollapse,
  width = 800,
  height = 800,
  backgroundColor = 'white',
  isLoading = false,
  xLabelRotation = 0,
  maxGraphWidth = 800,
  cellHeight = 15,
  showResetButton = false,
  rendererMargins,
  showOthersBucket = true,
}: GeneExpressionHeatmapProps) => {
  const [anatomicalTerms, setAnatomicalTerms] = useState<any[]>([]);
  const [anatomicalTermsProps, setAnatomicalTermsProps] = useState<Record<string, any>>({});
  const [isExpanding, setIsExpanding] = useState(false);
  const collapseSingleCellRef = useRef(readCollapseSingleCell());
  const [allExpressionCalls, setAllExpressionCalls] = useState<ExpressionCall[]>([]);

  // prepare term hierarchy from gene expression call data
  const prepTermHierarchy = (calls: ExpressionCall[]) => {
    const termProps = {
      [ROOT_TERM_ANAT_ENTITY]: {
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

    calls.forEach((exprCall) => {
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

    function createNestedStructure(termId: string, depth = 0): any {
      const term = termProps[termId];
      if (!term) {
        console.error(`[GeneExpressionHeatmap.prepTermHierarchy] term not found: ${termId}`);
        return null;
      }

      const nestedTerm: any = {
        id: termId,
        label: term.isSingleCell ? `${term.label} : ${term.cellTypeLabel}` : term.label,
        anatEntityId: term.anatEntityId,
        anatEntityLabel: term.anatEntityLabel,
        cellTypeId: term.cellTypeId,
        cellTypeLabel: term.cellTypeLabel,
        depth,
        isTopLevelTerm: term.isTopLevelTerm,
        isExpanded: depth === 0,
        isPopulated: true,
        hasBeenQueried: depth === 0,
        isSingleCell: term.isSingleCell,
        children: [],
      };

      if (children[termId]) {
        nestedTerm.children = children[termId].map((childId) => createNestedStructure(childId, depth + 1));
      }

      return nestedTerm;
    }

    const anatTerms = roots.map((root) => createNestedStructure(root)).filter(Boolean);
    return { anatTerms, termProps };
  };

  // Same calls in a new array (for example the Selected Genes panel toggling) must not
  // count as a new search. Rebuilding here sets isExpanded only on the root and drops
  // children fetched by expanding a term.
  const expressionCallsKey = useMemo(() => expressionCallsContentKey(expressionCalls), [expressionCalls]);

  // Sync allExpressionCalls when the search results change.
  useEffect(() => {
    if (expressionCalls) {
      setAllExpressionCalls(expressionCalls);
    }
  }, [expressionCallsKey]);

  // Initialize hierarchy only from initial expressionCalls (ignore expanded children).
  useEffect(() => {
    const hasCalls = expressionCalls && expressionCalls.length > 0;
    if (!hasCalls && !showOthersBucket) {
      setAnatomicalTerms([]);
      setAnatomicalTermsProps({});
      return;
    }
    // Only use calls without dataId (initial calls), not expanded children
    const initialCalls = (expressionCalls || []).filter((call) => !call.condition.anatEntity.dataId);
    const { anatTerms, termProps } = prepTermHierarchy(initialCalls);
    if (showOthersBucket) appendOthersBucket(anatTerms, termProps);
    setAnatomicalTerms(anatTerms);
    setAnatomicalTermsProps(termProps);
  }, [expressionCallsKey, showOthersBucket]);

  // Handle fetching children data
  const triggerSearchChildren = async (parentId: string, selectedTissueId: string) => {
    if (!onFetchChildren) return;

    const newCalls = await onFetchChildren(parentId, selectedTissueId);
    if (!newCalls || newCalls.length === 0) return;

    // Add new calls to allExpressionCalls to populate heatmap data
    setAllExpressionCalls((prev) => [...prev, ...newCalls]);

    // Extract child terms from new calls. Cell types of one organ are nested under that organ.
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

    function findNodeDepth(nodes: any[] | undefined, id: string): number | undefined {
      if (!Array.isArray(nodes)) return undefined;
      for (const node of nodes) {
        if (node.id === id) return node.depth ?? 0;
        const childDepth = findNodeDepth(node.children, id);
        if (childDepth !== undefined) return childDepth;
      }
      return undefined;
    }

    // Helper function to add children to hierarchy
    function addChildren(hierarchy: any[], termId: string, children: ExpandedConditionRow[]) {
      function traverse(node: any): any[] {
        if (!node || !Array.isArray(node)) return [];

        return node.map((item: any) => {
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

    // Update hierarchy if there are new children
    if (flatRows.length > 0) {
      const parentDepth = findNodeDepth(anatomicalTerms, parentId) ?? 0;
      const grouped = groupExpandedConditionRows(flatRows, {
        parentId,
        parentDepth,
        parentAnatEntityId: selectedTissueId,
        cellTypesExpanded: !collapseSingleCellRef.current,
      });
      const newAnatTerms = addChildren(anatomicalTerms, parentId, grouped);
      setAnatomicalTerms(newAnatTerms);

      const propsNodes: ExpandedConditionRow[] = [];
      const walk = (nodes: ExpandedConditionRow[]) => {
        nodes.forEach((node) => {
          propsNodes.push(node);
          if (node.children?.length) walk(node.children);
        });
      };
      walk(grouped);

      // Update term props
      const newAnatTermsProps = { ...anatomicalTermsProps };
      propsNodes.forEach((child) => {
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
            groupedUnderAnatEntity: child.groupedUnderAnatEntity,
            isSyntheticSingleCellGroup: child.isSyntheticSingleCellGroup,
          };
        }
      });
      setAnatomicalTermsProps(newAnatTermsProps);
    }
  };

  // Handle expand/collapse
  const handleToggleExpandCollapse = async (term: any) => {
    function updateExpandedStateHierarchically(terms: any[]) {
      const newTermProps = { ...anatomicalTermsProps };

      function traverse(node: any): any[] {
        if (!node || !Array.isArray(node)) return [];

        return node.map((item: any) => {
          const newItem = JSON.parse(JSON.stringify(item));
          if (item.id === term.id) {
            if (!item.hasBeenQueried) {
              // Fetch children on first expand
              setIsExpanding(true);
              triggerSearchChildren(term.id, term.anatEntityId).finally(() => {
                setIsExpanding(false);
              });
              newItem.hasBeenQueried = true;
              newItem.isExpanded = true;
              if (newTermProps[term.id]) {
                newTermProps[term.id].hasBeenQueried = true;
                newTermProps[term.id].isExpanded = true;
              }
            } else {
              // Toggle expansion state
              newItem.isExpanded = !item.isExpanded;
              if (newTermProps[term.id]) {
                newTermProps[term.id].isExpanded = !item.isExpanded;
              }
            }
          }
          newItem.children = traverse(newItem.children);
          return newItem;
        });
      }

      const newDrilldown = traverse(terms);
      return { newDrilldown, newTermProps };
    }

    const { newDrilldown, newTermProps } = updateExpandedStateHierarchically(anatomicalTerms);

    setAnatomicalTermsProps(newTermProps);
    setAnatomicalTerms(newDrilldown);

    // Call external handler if provided
    if (onToggleExpandCollapse) {
      onToggleExpandCollapse(term);
    }
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

  // Species for axis labels. Requested genes supply a fallback so a gene with no
  // calls still shows its species when the search spans more than one species.
  const geneIdToSpecies = useMemo(() => {
    const map = new Map<string, { name?: string; genus?: string; speciesName?: string }>();
    genes.forEach((gene) => {
      const geneId = gene.id || gene.value;
      if (geneId && gene.species) {
        map.set(geneId, gene.species);
      }
    });
    allExpressionCalls.forEach((result) => {
      if (result.gene?.geneId && result.gene.species) {
        map.set(result.gene.geneId, result.gene.species);
      }
    });
    return map;
  }, [allExpressionCalls, genes]);

  const isMultispecies = useMemo(() => {
    const speciesIds = new Set<string>();
    const addSpeciesId = (id?: string | number | null) => {
      if (id === undefined || id === null || String(id) === '') return;
      speciesIds.add(String(id));
    };
    allExpressionCalls.forEach((result) => addSpeciesId(result.gene?.species?.id));
    genes.forEach((gene) => addSpeciesId(gene.species?.id));
    return speciesIds.size > 1;
  }, [allExpressionCalls, genes]);

  // Transform expression calls to heatmap data format
  const heatmapData = useMemo(() => {
    return allExpressionCalls.map((result) => {
      const { geneId: gId, name: gName } = result.gene;
      const specId = result.gene.species.id;
      const { id: anatEntityId, name: anatEntityName, dataId: anatEntityDataId } = result.condition.anatEntity;
      const { id: cellTypeId, name: cellTypeName } = result.condition.cellType;
      const termId = anatEntityDataId ? `${anatEntityDataId}-${cellTypeId}` : `${anatEntityId}-${cellTypeId}`;
      const termName = cellTypeId !== 'GO:0005575' ? `${anatEntityName} : ${cellTypeName}` : anatEntityName;
      const expScore = result.expressionScore.expressionScore;
      const isExpressed = result.expressionState === 'expressed';

      return {
        // Use geneId as x-domain key so columns are unique even when species prefix
        // and gene name collide (renderer reads top/bottom labels separately for display).
        x: gId,
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
        isExpressed,
        expressionQuality: result.expressionQuality,
        hasDataInSitu: result.dataTypesWithData.IN_SITU,
        hasDataRnaSeq: result.dataTypesWithData.RNA_SEQ,
        hasDataScRnaSeq: result.dataTypesWithData.SC_RNA_SEQ,
        ylvl: 0,
      };
    });
  }, [allExpressionCalls]);

  // Generate xTerms from genes (value = unique key for scale, label = display text)
  const xTerms = useMemo(() => {
    return genes.map((gene) => {
      // Handle both {id, name} format (from GeneExpressionGraph) and {label, value} format (from useLogic)
      const geneId = gene.id || gene.value || 'Unknown';
      const geneName = gene.name || (gene.label && gene.label.includes(' - ') ? gene.label.split(' - ')[1] : null);
      const species = geneIdToSpecies.get(geneId);
      const axisLabels = getAxisLabels({ geneId, geneName, species, isMultispecies });

      return {
        // Use geneId as the x-domain key (unique per gene); renderer reads top/bottom labels separately for display.
        value: geneId,
        label: axisLabels.bottomLabel,
        topLabel: axisLabels.topLabel,
        bottomLabel: axisLabels.bottomLabel,
      };
    });
  }, [genes, isMultispecies, geneIdToSpecies]);

  if (allExpressionCalls.length === 0 && anatomicalTerms.length === 0) {
    return (
      <div className="is-flex is-justify-content-center is-align-items-center">
        <p className="is-size-4">No data found</p>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <Heatmap
        data={heatmapData}
        getChildData={onFetchChildren}
        xTerms={xTerms}
        yTerms={anatomicalTerms}
        termProps={anatomicalTermsProps}
        onToggleExpandCollapse={handleToggleExpandCollapse}
        onCollapseSingleCellChange={handleCollapseSingleCellChange}
        width={width}
        height={height}
        backgroundColor={backgroundColor}
        isLoading={isLoading || isExpanding}
        defaultXLabelRotation={xLabelRotation}
        defaultMaxGraphWidth={maxGraphWidth}
        defaultCellHeight={cellHeight}
        showResetButton={showResetButton}
        rendererMargins={rendererMargins}
      />
      {isExpanding && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
          }}
        >
          <progress className="progress is-small" max="100" style={{ animationDuration: '4s', width: '80%' }}>
            80%
          </progress>
        </div>
      )}
    </div>
  );
};

export default GeneExpressionHeatmap;
