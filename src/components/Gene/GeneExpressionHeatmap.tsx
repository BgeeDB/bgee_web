import { useState, useEffect, useMemo } from 'react';

import Heatmap from '../Heatmap/Heatmap';

const ROOT_TERM_ANAT_ENTITY = 'UBERON:0001062-GO:0005575';

export interface Gene {
  id: string;
  label: string;
  name?: string;
  value?: string;
}

export interface ExpressionCall {
  gene: { geneId: string; name: string; species: { id: string } };
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
  dataTypesWithData: {
    AFFYMETRIX: boolean;
    EST: boolean;
    IN_SITU: boolean;
    RNA_SEQ: boolean;
    SC_RNA_SEQ: boolean;
  };
  isOrphan?: boolean;
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
}: GeneExpressionHeatmapProps) => {
  const [anatomicalTerms, setAnatomicalTerms] = useState<any[]>([]);
  const [anatomicalTermsProps, setAnatomicalTermsProps] = useState<Record<string, any>>({});
  const [isExpanding, setIsExpanding] = useState(false);
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
      const isOrphan = exprCall.isOrphan || false;

      if (!(termId in termProps)) {
        termProps[termId] = {
          label: termLabel,
          anatEntityId,
          anatEntityLabel: anatEntityName,
          cellTypeId,
          cellTypeLabel: cellTypeName,
          isTopLevelTerm: !isOrphan, // Orphans are not expandable
          isExpanded: true,
          isPopulated: false,
          hasBeenQueried: true,
          isSingleCell: termIsSingleCell,
        };

        if (termId !== ROOT_TERM_ANAT_ENTITY) {
          parents[termId] = [ROOT_TERM_ANAT_ENTITY];
          children[ROOT_TERM_ANAT_ENTITY].push(termId);
        }
      } else if (isOrphan) {
        // If we see an orphan duplicate, ensure isTopLevelTerm is false
        termProps[termId].isTopLevelTerm = false;
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

    const anatTerms = roots.map((root) => createNestedStructure(root));
    return { anatTerms, termProps };
  };

  // Sort children: orphans (isTopLevelTerm === false) first, then normal terms (isTopLevelTerm === true)
  const sortChildrenRecursively = (terms: any[]): any[] => {
    return terms.map((term) => {
      if (term.children && term.children.length > 0) {
        // Sort children: orphans first, then normal terms
        term.children.sort((a, b) => {
          if (a.isTopLevelTerm === b.isTopLevelTerm) return 0;
          return a.isTopLevelTerm ? 1 : -1;
        });
        // Recursively sort children
        term.children = sortChildrenRecursively(term.children);
      }
      return term;
    });
  };

  // Sync allExpressionCalls when expressionCalls prop changes
  useEffect(() => {
    if (expressionCalls && expressionCalls.length > 0) {
      setAllExpressionCalls(expressionCalls);
    }
  }, [expressionCalls]);

  // Initialize hierarchy only from initial expressionCalls (ignore expanded children)
  useEffect(() => {
    if (expressionCalls && expressionCalls.length > 0) {
      // Build hierarchy from expressionCalls (which now contains isOrphan flag)
      // Only use calls without dataId (initial calls), not expanded children
      const initialCalls = expressionCalls.filter((call) => !call.condition.anatEntity.dataId);
      const { anatTerms, termProps } = prepTermHierarchy(initialCalls);
      // Sort to ensure orphans appear before normal terms
      const sortedAnatTerms = sortChildrenRecursively(anatTerms);
      setAnatomicalTerms(sortedAnatTerms);
      setAnatomicalTermsProps(termProps);
    }
  }, [expressionCalls]);

  // Handle fetching children data
  const triggerSearchChildren = async (parentId: string, selectedTissueId: string) => {
    if (!onFetchChildren) return;

    const newCalls = await onFetchChildren(parentId, selectedTissueId);
    if (!newCalls || newCalls.length === 0) return;

    // Add new calls to allExpressionCalls to populate heatmap data
    setAllExpressionCalls((prev) => [...prev, ...newCalls]);

    // Extract child terms from new calls
    const newChildTerms = new Set<any>();
    newCalls.forEach((exprCall) => {
      const { id: anatEntityId, name: anatEntityName } = exprCall.condition.anatEntity;
      const { id: cellTypeId, name: cellTypeName } = exprCall.condition.cellType;
      const isSingleCell = cellTypeId !== 'GO:0005575';

      if (!(anatEntityId === selectedTissueId) || isSingleCell) {
        newChildTerms.add(
          JSON.stringify({
            id: `${parentId}--${anatEntityId}-${cellTypeId}`,
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

    // Helper function to add children to hierarchy
    function addChildren(hierarchy: any[], termId: string, children: string[]) {
      function traverse(node: any): any[] {
        if (!node || !Array.isArray(node)) return [];

        return node.map((item: any) => {
          const newItem = { ...item };
          if (item.id === termId) {
            children.forEach((childStr) => {
              const child = JSON.parse(childStr);
              if (child.id !== newItem.id) {
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
              }
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
    if (newChildTerms.size > 0) {
      const newAnatTerms = addChildren(anatomicalTerms, parentId, [...newChildTerms]);
      setAnatomicalTerms(newAnatTerms);

      // Update term props
      const newAnatTermsProps = { ...anatomicalTermsProps };
      newChildTerms.forEach((childStr) => {
        const child = JSON.parse(childStr);
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
              newTermProps[term.id].hasBeenQueried = true;
              newTermProps[term.id].isExpanded = true;
            } else {
              // Toggle expansion state
              newItem.isExpanded = !item.isExpanded;
              newTermProps[term.id].isExpanded = !item.isExpanded;
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
    });
  }, [allExpressionCalls]);

  // Generate xTerms from genes
  const xTerms = useMemo(() => {
    return genes.map((gene) => {
      // Handle both {id, name} format (from GeneExpressionGraph) and {label, value} format (from useLogic)
      const geneId = gene.id || gene.value;
      const geneName = gene.name || (gene.label && gene.label.includes(' - ') ? gene.label.split(' - ')[1] : null);

      return {
        label: geneName ? `${geneId} - ${geneName}` : geneId,
        value: geneId,
      };
    });
  }, [genes]);

  if (allExpressionCalls.length === 0) {
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
