// Selected Genes and the expression-graph columns share this order.
// A freshly resolved list is grouped by species. Later edits insert a gene
// into its species, or move a row, and leave every other gene where it is.

export type OrderedGene = {
  speciesId: string | number;
  speciesLabel: string;
  geneId: string;
  geneLabel: string;
};

export type SpeciesGeneSelection = {
  speciesId: string | number;
  speciesLabel: string;
  selected: Array<{ label: string; value: string }>;
};

const geneKey = (gene: OrderedGene) => `${String(gene.speciesId)}:${gene.geneId}`;

// speciesLabel is "Genus species" or "Genus species - common name".
const scientificName = (speciesLabel: string) => {
  const separator = ' - ';
  const separatorIndex = speciesLabel.indexOf(separator);
  return (separatorIndex === -1 ? speciesLabel : speciesLabel.slice(0, separatorIndex)).trim();
};

const byScientificName = (left: OrderedGene, right: OrderedGene) =>
  scientificName(left.speciesLabel).localeCompare(scientificName(right.speciesLabel), undefined, {
    sensitivity: 'base',
  });

// Species blocks are alphabetical by scientific name. Genes inside a species
// keep the order they arrived in.
export const groupGenesBySpecies = <T extends OrderedGene>(genes: T[]): T[] => {
  const groups = new Map<string, T[]>();
  genes.forEach((gene) => {
    const speciesId = String(gene.speciesId);
    const group = groups.get(speciesId);
    if (group) group.push(gene);
    else groups.set(speciesId, [gene]);
  });

  return [...groups.entries()]
    .sort(([speciesIdA, genesA], [speciesIdB, genesB]) => {
      const byName = byScientificName(genesA[0], genesB[0]);
      if (byName !== 0) return byName;
      return speciesIdA.localeCompare(speciesIdB);
    })
    .flatMap(([, group]) => group);
};

const insertSpeciesBlock = <T extends OrderedGene>(current: T[], block: T[]): T[] => {
  const speciesId = String(block[0].speciesId);
  let lastIndex = -1;
  current.forEach((gene, index) => {
    if (String(gene.speciesId) === speciesId) lastIndex = index;
  });

  const next = [...current];
  if (lastIndex >= 0) {
    next.splice(lastIndex + 1, 0, ...block);
    return next;
  }

  const incomingName = scientificName(block[0].speciesLabel);
  let insertAt = next.length;
  for (let index = 0; index < next.length; index += 1) {
    const compared = scientificName(next[index].speciesLabel).localeCompare(incomingName, undefined, {
      sensitivity: 'base',
    });
    if (compared > 0) {
      insertAt = index;
      break;
    }
  }
  next.splice(insertAt, 0, ...block);
  return next;
};

// Genes of a species already in the list go after the last gene of that species.
// A species that is not in the list yet is inserted among the existing rows by
// scientific name, without moving those rows relative to each other.
export const insertGenesBySpecies = <T extends OrderedGene>(current: T[], incoming: T[]): T[] => {
  if (incoming.length === 0) return current;

  const seen = new Set(current.map(geneKey));
  const fresh = incoming.filter((gene) => {
    const key = geneKey(gene);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
  if (fresh.length === 0) return current;

  const blocks: T[][] = [];
  groupGenesBySpecies(fresh).forEach((gene) => {
    const last = blocks[blocks.length - 1];
    if (last && String(last[0].speciesId) === String(gene.speciesId)) last.push(gene);
    else blocks.push([gene]);
  });

  return blocks.reduce((list, block) => insertSpeciesBlock(list, block), current);
};

// Replace one species' membership in place. Genes that stay selected keep their
// positions. Newly selected genes are inserted with that species.
export const mergeSpeciesSelection = <T extends OrderedGene>(current: T[], selection: SpeciesGeneSelection): T[] => {
  const speciesId = String(selection.speciesId);
  const selectedIds = new Set(selection.selected.map((gene) => gene.value));
  const existingIds = new Set(
    current.filter((gene) => String(gene.speciesId) === speciesId).map((gene) => gene.geneId)
  );
  const sameGenes =
    existingIds.size === selectedIds.size && [...existingIds].every((geneId) => selectedIds.has(geneId));
  if (sameGenes) return current;

  const kept = current.filter((gene) => String(gene.speciesId) !== speciesId || selectedIds.has(gene.geneId));
  const toAdd = selection.selected
    .filter((gene) => gene.value && !existingIds.has(gene.value))
    .map((gene) => ({
      speciesId,
      speciesLabel: selection.speciesLabel,
      geneId: gene.value,
      geneLabel: gene.label,
    })) as T[];

  return insertGenesBySpecies(kept, toAdd);
};

// Swap a gene with the previous or next visible row. Hidden rows stay put, so a
// filtered table still moves the row the user is looking at.
export const moveVisibleGene = <T>(
  genes: T[],
  targetKey: string,
  direction: -1 | 1,
  keyOf: (gene: T) => string,
  isVisible: (gene: T) => boolean
): T[] => {
  const visibleIndexes: number[] = [];
  genes.forEach((gene, index) => {
    if (isVisible(gene)) visibleIndexes.push(index);
  });
  const position = visibleIndexes.findIndex((index) => keyOf(genes[index]) === targetKey);
  const swapPosition = position + direction;
  if (position < 0 || swapPosition < 0 || swapPosition >= visibleIndexes.length) return genes;

  const next = [...genes];
  const from = visibleIndexes[position];
  const to = visibleIndexes[swapPosition];
  [next[from], next[to]] = [next[to], next[from]];
  return next;
};
