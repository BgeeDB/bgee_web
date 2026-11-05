// Taxonomy returned as data.speciesByTaxon by multispec_expr_calls.
// Internal nodes are ancestral taxa. Species hang off the tip taxa.
// preferredDisplayOrder is the left-to-right order of a drawn tree.

export type TaxonSpecies = {
  id: string;
  label: string;
  scientificName: string;
  preferredDisplayOrder: number;
};

export type TaxonTree = {
  id: string;
  label: string;
  species: TaxonSpecies[];
  children: TaxonTree[];
};

export type SpeciesAxisLeaf = {
  speciesId: string;
  label: string;
  start: number;
  end: number;
};

export type SpeciesAxisBracket = {
  key: string;
  label: string;
  depth: number;
  start: number;
  end: number;
  children: Array<{ start: number; end: number; depth: number }>;
};

export type SpeciesAxisModel = {
  leaves: SpeciesAxisLeaf[];
  brackets: SpeciesAxisBracket[];
  depth: number;
};

type SpeciesIdCarrier = { speciesId: string | number };

const speciesLabelOf = (species: {
  id?: string | number;
  name?: string;
  genus?: string;
  speciesName?: string;
}): string => {
  const common = species.name?.trim();
  if (common) return common;
  const scientific = [species.genus, species.speciesName].filter(Boolean).join(' ').trim();
  return scientific || String(species.id ?? '');
};

const parseNode = (raw: unknown): TaxonTree | null => {
  if (!raw || typeof raw !== 'object') return null;
  const record = raw as {
    taxon?: { id?: string | number; scientificName?: string; name?: string };
    species?: Array<{
      id?: string | number;
      name?: string;
      genus?: string;
      speciesName?: string;
      preferredDisplayOrder?: number;
    }>;
    children?: unknown[];
  };
  const taxon = record.taxon;
  if (!taxon) return null;
  const id = taxon.id != null ? String(taxon.id) : String(taxon.scientificName || taxon.name || '');
  if (!id) return null;
  const species = (Array.isArray(record.species) ? record.species : [])
    .filter((entry) => entry?.id != null)
    .map((entry) => {
      const order = Number(entry.preferredDisplayOrder);
      return {
        id: String(entry.id),
        label: speciesLabelOf(entry),
        scientificName: [entry.genus, entry.speciesName].filter(Boolean).join(' ').trim(),
        preferredDisplayOrder: Number.isFinite(order) ? order : Number.MAX_SAFE_INTEGER,
      };
    })
    .sort((left, right) => left.preferredDisplayOrder - right.preferredDisplayOrder || left.id.localeCompare(right.id));
  const children = (Array.isArray(record.children) ? record.children : [])
    .map((child) => parseNode(child))
    .filter((child): child is TaxonTree => child != null);
  return {
    id,
    label: String(taxon.scientificName || taxon.name || id),
    species,
    children,
  };
};

export const parseSpeciesByTaxon = (raw: unknown): TaxonTree | null => parseNode(raw);

export const speciesTreeSignature = (tree: TaxonTree | null): string => {
  if (!tree) return '';
  const walk = (node: TaxonTree): string => {
    const species = node.species.map((entry) => `${entry.id}:${entry.preferredDisplayOrder}`).join(',');
    const children = node.children.map((child) => walk(child)).join(',');
    return `${node.id}(${species}|${children})`;
  };
  return walk(tree);
};

export const speciesRank = (tree: TaxonTree): Map<string, number> => {
  const rank = new Map<string, number>();
  const walk = (node: TaxonTree) => {
    node.species.forEach((species) => {
      if (!rank.has(species.id)) rank.set(species.id, species.preferredDisplayOrder);
    });
    node.children.forEach(walk);
  };
  walk(tree);
  return rank;
};

const scientificNameOf = (gene: SpeciesIdCarrier & { speciesLabel?: string }) => {
  const label = gene.speciesLabel || '';
  const separator = ' - ';
  const separatorIndex = label.indexOf(separator);
  return (separatorIndex === -1 ? label : label.slice(0, separatorIndex)).trim();
};

// Contiguous species blocks, left to right. Null when a species is split.
export const speciesBlockIds = (genes: SpeciesIdCarrier[]): string[] | null => {
  const blocks: string[] = [];
  const seen = new Set<string>();
  let previous = '';
  for (let index = 0; index < genes.length; index += 1) {
    const id = String(genes[index].speciesId);
    if (!id) return null;
    if (id === previous) continue;
    if (seen.has(id)) return null;
    seen.add(id);
    blocks.push(id);
    previous = id;
  }
  return blocks;
};

const descendantSpan = (
  node: TaxonTree,
  indexBySpecies: Map<string, number>
): { min: number; max: number; count: number } | null | false => {
  let min = Infinity;
  let max = -Infinity;
  let count = 0;
  node.species.forEach((species) => {
    const index = indexBySpecies.get(species.id);
    if (index == null) return;
    min = Math.min(min, index);
    max = Math.max(max, index);
    count += 1;
  });
  for (let childIndex = 0; childIndex < node.children.length; childIndex += 1) {
    const child = descendantSpan(node.children[childIndex], indexBySpecies);
    if (child === false) return false;
    if (child == null) continue;
    min = Math.min(min, child.min);
    max = Math.max(max, child.max);
    count += child.count;
  }
  if (count === 0) return null;
  if (max - min + 1 !== count) return false;
  return { min, max, count };
};

// True when every species is one block and every clade's species are one block.
// Sister species may be swapped. A species between the two members of a clade is not.
export const isTreeLinearization = (genes: SpeciesIdCarrier[], tree: TaxonTree | null): boolean => {
  if (!tree) return false;
  const blocks = speciesBlockIds(genes);
  if (!blocks) return false;
  const rank = speciesRank(tree);
  if (blocks.some((id) => !rank.has(id))) return false;
  const indexBySpecies = new Map(blocks.map((id, index) => [id, index]));
  return descendantSpan(tree, indexBySpecies) !== false;
};

// Left-to-right species order for a drawing of the tree. Sisters, and the species
// directly under one taxon, are ordered by preferredDisplayOrder. A raw sort on that
// number is not used: human is 1 and mouse is 2, which would put mouse between the
// two hominins and the brackets would cross.
const cladeDisplayOrder = (node: TaxonTree): number => {
  let order = Number.POSITIVE_INFINITY;
  node.species.forEach((species) => {
    order = Math.min(order, species.preferredDisplayOrder);
  });
  node.children.forEach((child) => {
    order = Math.min(order, cladeDisplayOrder(child));
  });
  return order;
};

export const canonicalSpeciesOrder = (tree: TaxonTree): string[] => {
  const walk = (node: TaxonTree): string[] => {
    const parts: Array<{ order: number; ids: string[] }> = node.species.map((species) => ({
      order: species.preferredDisplayOrder,
      ids: [species.id],
    }));
    node.children.forEach((child) => {
      parts.push({ order: cladeDisplayOrder(child), ids: walk(child) });
    });
    parts.sort((left, right) => left.order - right.order);
    return parts.flatMap((part) => part.ids);
  };
  return walk(tree);
};

export const isPreferredSpeciesOrder = (genes: SpeciesIdCarrier[], tree: TaxonTree | null): boolean => {
  if (!tree) return false;
  const blocks = speciesBlockIds(genes);
  if (!blocks) return false;
  const present = new Set(blocks);
  const wanted = canonicalSpeciesOrder(tree).filter((id) => present.has(id));
  if (wanted.length !== blocks.length) return false;
  return wanted.every((id, index) => id === blocks[index]);
};

// Species blocks follow the tree, with sisters ordered by preferredDisplayOrder.
// Genes inside a species stay put. Species the tree does not mention follow the
// ranked blocks, in scientific-name order.
export const orderGenesByPreferredDisplay = <T extends SpeciesIdCarrier & { speciesLabel?: string }>(
  genes: T[],
  tree: TaxonTree | null
): T[] => {
  if (!tree || genes.length === 0) return genes;
  const canonical = canonicalSpeciesOrder(tree);
  const indexBySpecies = new Map(canonical.map((id, index) => [id, index]));
  const groups = new Map<string, T[]>();
  const arrival: string[] = [];
  genes.forEach((gene) => {
    const id = String(gene.speciesId);
    const group = groups.get(id);
    if (group) group.push(gene);
    else {
      groups.set(id, [gene]);
      arrival.push(id);
    }
  });
  const orderedIds = [...arrival].sort((leftId, rightId) => {
    const leftIndex = indexBySpecies.get(leftId);
    const rightIndex = indexBySpecies.get(rightId);
    const leftKnown = leftIndex != null;
    const rightKnown = rightIndex != null;
    if (leftKnown && rightKnown && leftIndex !== rightIndex) return leftIndex - rightIndex;
    if (leftKnown !== rightKnown) return leftKnown ? -1 : 1;
    const leftName = scientificNameOf(groups.get(leftId)![0]);
    const rightName = scientificNameOf(groups.get(rightId)![0]);
    const byName = leftName.localeCompare(rightName, undefined, { sensitivity: 'base' });
    if (byName !== 0) return byName;
    return leftId.localeCompare(rightId);
  });
  const next = orderedIds.flatMap((id) => groups.get(id)!);
  if (next.length === genes.length && next.every((gene, index) => gene === genes[index])) return genes;
  return next;
};

type CollapsedNode = {
  kind: 'leaf' | 'node';
  key: string;
  label: string;
  speciesId?: string;
  start: number;
  end: number;
  depth: number;
  children: CollapsedNode[];
};

const geneSpans = (speciesIds: string[]): Map<string, { start: number; end: number }> | null => {
  const spans = new Map<string, { start: number; end: number }>();
  let previous = '';
  for (let index = 0; index < speciesIds.length; index += 1) {
    const id = speciesIds[index];
    if (!id) return null;
    if (id === previous) {
      const span = spans.get(id);
      if (span) span.end = index;
      continue;
    }
    if (spans.has(id)) return null;
    spans.set(id, { start: index, end: index });
    previous = id;
  }
  return spans;
};

const collapseTaxon = (node: TaxonTree, spans: Map<string, { start: number; end: number }>): CollapsedNode | null => {
  const parts: Array<{ start: number; node: CollapsedNode }> = [];
  node.species.forEach((species) => {
    const span = spans.get(species.id);
    if (!span) return;
    parts.push({
      start: span.start,
      node: {
        kind: 'leaf',
        key: `species:${species.id}`,
        label: species.label,
        speciesId: species.id,
        start: span.start,
        end: span.end,
        depth: 0,
        children: [],
      },
    });
  });
  node.children.forEach((child) => {
    const collapsed = collapseTaxon(child, spans);
    if (!collapsed) return;
    parts.push({ start: collapsed.start, node: collapsed });
  });
  if (parts.length === 0) return null;
  parts.sort((left, right) => left.start - right.start);
  if (parts.length === 1) return parts[0].node;
  const children = parts.map((part) => part.node);
  const start = Math.min(...children.map((child) => child.start));
  const end = Math.max(...children.map((child) => child.end));
  const depth = 1 + Math.max(...children.map((child) => child.depth));
  return {
    kind: 'node',
    key: `${node.id}:${start}-${end}`,
    label: node.label,
    start,
    end,
    depth,
    children,
  };
};

// Null unless the columns are a non-crossing drawing of the tree with at least two species.
// Unary ranks (a genus above its only species) are omitted.
export const speciesAxisModel = (
  speciesIds: Array<string | number | undefined>,
  tree: TaxonTree | null
): SpeciesAxisModel | null => {
  if (!tree) return null;
  const ids = speciesIds.map((id) => (id == null ? '' : String(id)));
  if (
    !isTreeLinearization(
      ids.map((speciesId) => ({ speciesId })),
      tree
    )
  )
    return null;
  const spans = geneSpans(ids);
  if (!spans || spans.size < 2) return null;
  const root = collapseTaxon(tree, spans);
  if (!root || root.kind === 'leaf') return null;

  const leaves: SpeciesAxisLeaf[] = [];
  const brackets: SpeciesAxisBracket[] = [];
  const walk = (node: CollapsedNode) => {
    if (node.kind === 'leaf' && node.speciesId) {
      leaves.push({ speciesId: node.speciesId, label: node.label, start: node.start, end: node.end });
      return;
    }
    brackets.push({
      key: node.key,
      label: node.label,
      depth: node.depth,
      start: node.start,
      end: node.end,
      children: node.children.map((child) => ({ start: child.start, end: child.end, depth: child.depth })),
    });
    node.children.forEach(walk);
  };
  walk(root);
  leaves.sort((left, right) => left.start - right.start);
  return { leaves, brackets, depth: root.depth };
};
