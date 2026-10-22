export const COLLAPSE_SINGLE_CELL_STORAGE_KEY = 'bgee-heatmap-collapse-single-cell';

export function readCollapseSingleCell() {
  try {
    const stored = localStorage.getItem(COLLAPSE_SINGLE_CELL_STORAGE_KEY);
    if (stored == null) return false;
    return JSON.parse(stored) === true;
  } catch {
    return false;
  }
}

// A grouping row whose children are only cell-type calls.
export function isCellTypeGroup(node) {
  const children = node?.children || [];
  return children.length > 0 && children.every((child) => child.isSingleCell);
}

// Hide cell-type rows that sit directly under an anatomical term.
// Rows nested under a cell-type group stay on that group so it can show [+]/[-].
export function hideLooseSingleCellRows(nodes) {
  if (!nodes?.length) return nodes || [];
  const visible = [];
  nodes.forEach((node) => {
    if (node.isSingleCell) return;
    const children = isCellTypeGroup(node) ? node.children || [] : hideLooseSingleCellRows(node.children);
    visible.push({ ...node, children });
  });
  return visible;
}

export function setCellTypeGroupsExpanded(nodes, expanded) {
  if (!nodes?.length) return nodes || [];
  return nodes.map((node) => {
    const group = isCellTypeGroup(node);
    const children = node.children?.length ? setCellTypeGroupsExpanded(node.children, expanded) : node.children;
    if (!group) return { ...node, children };
    return { ...node, children, isExpanded: expanded };
  });
}

export function cellTypeGroupIds(nodes, ids = []) {
  (nodes || []).forEach((node) => {
    if (isCellTypeGroup(node)) ids.push(node.id);
    if (node.children?.length) cellTypeGroupIds(node.children, ids);
  });
  return ids;
}
