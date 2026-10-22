// Cell-type root (GO:0005575). An organ-only row uses this id.
export const CELL_TYPE_ROOT_ID = 'GO:0005575';

export type ExpandedConditionRow = {
  id: string;
  label: string;
  anatEntityId: string;
  anatEntityLabel: string;
  cellTypeId: string;
  cellTypeLabel: string;
  depth: number;
  isTopLevelTerm: boolean;
  isExpanded: boolean;
  isPopulated: boolean;
  hasBeenQueried: boolean;
  isSingleCell: boolean;
  // Drawn as the cell-type name alone. The parent row already names the organ.
  groupedUnderAnatEntity?: boolean;
  // Header inserted when an organ has cell-type rows and no organ-only call.
  isSyntheticSingleCellGroup?: boolean;
  children?: ExpandedConditionRow[];
};

const asCellTypeRow = (row: ExpandedConditionRow, depth: number): ExpandedConditionRow => ({
  ...row,
  label: row.cellTypeLabel || row.label,
  depth,
  groupedUnderAnatEntity: true,
  isExpanded: false,
  hasBeenQueried: false,
  children: [],
});

/**
 * Nest single-cell rows under the anatomical entity they belong to.
 * Cell types of the expanded term stay direct children of that term: it is already their group.
 * A sub-organ that has an organ-only call becomes the header. Otherwise a header is inserted
 * so those cell types still share one collapsible row. Sibling order is applied later.
 */
export function groupExpandedConditionRows(
  rows: ExpandedConditionRow[],
  {
    parentId,
    parentDepth,
    parentAnatEntityId,
    cellTypesExpanded = true,
  }: {
    parentId: string;
    parentDepth: number;
    parentAnatEntityId: string;
    cellTypesExpanded?: boolean;
  }
): ExpandedConditionRow[] {
  const groups = new Map<string, { organ: ExpandedConditionRow | null; cells: ExpandedConditionRow[] }>();
  const order: string[] = [];

  rows.forEach((row) => {
    let group = groups.get(row.anatEntityId);
    if (!group) {
      group = { organ: null, cells: [] };
      groups.set(row.anatEntityId, group);
      order.push(row.anatEntityId);
    }
    if (row.isSingleCell) group.cells.push(row);
    else if (!group.organ) group.organ = row;
  });

  const grouped: ExpandedConditionRow[] = [];
  const headerDepth = parentDepth + 1;

  order.forEach((anatEntityId) => {
    const group = groups.get(anatEntityId);
    if (!group) return;

    if (anatEntityId === parentAnatEntityId) {
      group.cells.forEach((cell) => grouped.push(asCellTypeRow(cell, headerDepth)));
      return;
    }

    const cellRows = group.cells.map((cell) => asCellTypeRow(cell, headerDepth + 1));

    if (group.organ) {
      grouped.push({
        ...group.organ,
        depth: headerDepth,
        isExpanded: cellRows.length > 0 && cellTypesExpanded,
        // The cell types arrived with this expansion. The toggle only shows or hides them.
        hasBeenQueried: cellRows.length > 0,
        children: cellRows,
      });
      return;
    }

    if (cellRows.length === 0) return;

    const sample = group.cells[0];
    grouped.push({
      id: `${parentId}--${anatEntityId}`,
      label: sample.anatEntityLabel,
      anatEntityId,
      anatEntityLabel: sample.anatEntityLabel,
      cellTypeId: CELL_TYPE_ROOT_ID,
      cellTypeLabel: 'cellular component',
      depth: headerDepth,
      isTopLevelTerm: false,
      isExpanded: cellTypesExpanded,
      isPopulated: true,
      hasBeenQueried: true,
      isSingleCell: false,
      isSyntheticSingleCellGroup: true,
      children: cellRows,
    });
  });

  return grouped;
}
