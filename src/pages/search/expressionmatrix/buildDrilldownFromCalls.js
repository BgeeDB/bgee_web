/**
 * Build heatmap drilldown + termProps from expression calls (API does not always send these).
 * Logic aligned with GeneExpressionHeatmap / GeneExpressionGraph prepTermHierarchy.
 */

const ROOT_TERM_ANAT_ENTITY = 'UBERON:0001062-GO:0005575';

function prepTermHierarchy(expressionCalls) {
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
  const children = { [ROOT_TERM_ANAT_ENTITY]: [] };

  (expressionCalls || []).forEach((exprCall) => {
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
        isTopLevelTerm: !isOrphan,
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
      termProps[termId].isTopLevelTerm = false;
    }
  });

  const roots = Object.keys(parents).filter((id) => parents[id].length === 0);

  function createNestedStructure(termId, depth = 0) {
    const term = termProps[termId];
    if (!term) {
      console.error(`[buildDrilldownFromCalls] term not found: ${termId}`);
      return null;
    }

    const nestedTerm = {
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
}

function sortChildrenRecursively(terms) {
  return terms.map((term) => {
    if (term.children && term.children.length > 0) {
      term.children.sort((a, b) => {
        if (a.isTopLevelTerm === b.isTopLevelTerm) return 0;
        return a.isTopLevelTerm ? 1 : -1;
      });
      term.children = sortChildrenRecursively(term.children);
    }
    return term;
  });
}

/** Augment API `data` with heatmap drilldown + termProps derived from expression calls. */
export function ensureDrilldownAndTermProps(data) {
  if (!data?.expressionData?.expressionCalls) return data;
  const calls = data.expressionData.expressionCalls;
  const initialCalls = calls.filter((c) => !c.condition?.anatEntity?.dataId);
  const hierarchyCalls = initialCalls.length ? initialCalls : calls;
  const { anatTerms, termProps } = prepTermHierarchy(hierarchyCalls);
  const drilldown = sortChildrenRecursively(anatTerms);
  return {
    ...data,
    expressionData: {
      ...data.expressionData,
      drilldown,
      termProps,
    },
  };
}
