import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  groupGenesBySpecies,
  insertGenesBySpecies,
  mergeSpeciesSelection,
  moveVisibleGene,
  type OrderedGene,
} from './geneOrder.ts';

const gene = (speciesId: string, speciesLabel: string, geneId: string): OrderedGene => ({
  speciesId,
  speciesLabel,
  geneId,
  geneLabel: geneId,
});

const homo = (geneId: string) => gene('9606', 'Homo sapiens - human', geneId);
const mus = (geneId: string) => gene('10090', 'Mus musculus - mouse', geneId);
const danio = (geneId: string) => gene('7955', 'Danio rerio - zebrafish', geneId);

const ids = (genes: OrderedGene[]) => genes.map((entry) => entry.geneId);

test('groups a new list by scientific name and keeps arrival order within a species', () => {
  const grouped = groupGenesBySpecies([mus('m1'), homo('h1'), danio('d1'), homo('h2')]);
  assert.deepEqual(ids(grouped), ['d1', 'h1', 'h2', 'm1']);
});

test('inserts a gene of an existing species after the last gene of that species', () => {
  const next = insertGenesBySpecies([homo('h1'), mus('m1')], [homo('h2')]);
  assert.deepEqual(ids(next), ['h1', 'h2', 'm1']);
});

test('inserts a new species by scientific name without moving the genes already selected', () => {
  const next = insertGenesBySpecies([mus('m1'), homo('h1')], [danio('d1')]);
  assert.deepEqual(ids(next), ['d1', 'm1', 'h1']);
});

test('places several new species from one batch into scientific-name order', () => {
  const next = insertGenesBySpecies([homo('h1')], [mus('m1'), danio('d1')]);
  assert.deepEqual(ids(next), ['d1', 'h1', 'm1']);
});

test('keeps a species in place when the same genes are selected in another order', () => {
  const current = [homo('h2'), homo('h1'), mus('m1')];
  const next = mergeSpeciesSelection(current, {
    speciesId: '9606',
    speciesLabel: 'Homo sapiens - human',
    selected: [
      { label: 'h1', value: 'h1' },
      { label: 'h2', value: 'h2' },
    ],
  });
  assert.equal(next, current);
});

test('drops a deselected gene and leaves the surrounding genes where they are', () => {
  const next = mergeSpeciesSelection([homo('h1'), mus('m1'), homo('h2')], {
    speciesId: '9606',
    speciesLabel: 'Homo sapiens - human',
    selected: [{ label: 'h2', value: 'h2' }],
  });
  assert.deepEqual(ids(next), ['m1', 'h2']);
});

test('moves a visible gene past a hidden neighbor', () => {
  const genes = [homo('h1'), mus('m1'), danio('d1')];
  const visible = new Set(['9606:h1', '7955:d1']);
  const next = moveVisibleGene(
    genes,
    '7955:d1',
    -1,
    (entry) => `${entry.speciesId}:${entry.geneId}`,
    (entry) => visible.has(`${entry.speciesId}:${entry.geneId}`)
  );
  assert.deepEqual(ids(next), ['d1', 'm1', 'h1']);
});

test('leaves the list unchanged when a gene is already at that end', () => {
  const genes = [homo('h1'), mus('m1')];
  const next = moveVisibleGene(
    genes,
    '9606:h1',
    -1,
    (entry) => `${entry.speciesId}:${entry.geneId}`,
    () => true
  );
  assert.equal(next, genes);
});
