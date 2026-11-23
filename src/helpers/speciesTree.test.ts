import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  isPreferredSpeciesOrder,
  isTreeLinearization,
  orderGenesByPreferredDisplay,
  parseSpeciesByTaxon,
  speciesAxisModel,
  type TaxonTree,
} from './speciesTree.ts';

const gene = (speciesId: string, geneId = speciesId) => ({
  speciesId,
  speciesLabel: geneId,
  geneId,
});

// mouse and human are sisters under Glires for the small cases.
// The primate/rodent tree is the interleaving case.
const rawTree = {
  taxon: { scientificName: 'Euarchontoglires', id: 1 },
  children: [
    {
      taxon: { scientificName: 'Primates', id: 2 },
      children: [
        {
          taxon: { scientificName: 'Homo', id: 3 },
          species: [{ id: 9606, name: 'human', genus: 'Homo', speciesName: 'sapiens', preferredDisplayOrder: 1 }],
        },
        {
          taxon: { scientificName: 'Pan', id: 4 },
          species: [
            { id: 9598, name: 'chimpanzee', genus: 'Pan', speciesName: 'troglodytes', preferredDisplayOrder: 2 },
          ],
        },
      ],
    },
    {
      taxon: { scientificName: 'Rodentia', id: 5 },
      children: [
        {
          taxon: { scientificName: 'Mus', id: 6 },
          species: [{ id: 10090, name: 'mouse', genus: 'Mus', speciesName: 'musculus', preferredDisplayOrder: 3 }],
        },
      ],
    },
  ],
};

const tree = parseSpeciesByTaxon(rawTree) as TaxonTree;

test('parses species labels and preferred order', () => {
  assert.equal(tree.label, 'Euarchontoglires');
  assert.equal(tree.children[0].children[0].species[0].label, 'human');
  assert.equal(tree.children[0].children[0].species[0].preferredDisplayOrder, 1);
});

test('orders species blocks by preferredDisplayOrder and keeps genes inside a species', () => {
  const ordered = orderGenesByPreferredDisplay(
    [gene('10090', 'm1'), gene('9606', 'h2'), gene('9598', 'c1'), gene('9606', 'h1')],
    tree
  );
  assert.deepEqual(
    ordered.map((entry) => entry.geneId),
    ['h2', 'h1', 'c1', 'm1']
  );
});

test('returns the same list when it is already in preferred order', () => {
  const current = [gene('9606', 'h1'), gene('9598', 'c1'), gene('10090', 'm1')];
  assert.equal(orderGenesByPreferredDisplay(current, tree), current);
});

test('accepts a sister swap and rejects a split species or an interleaved clade', () => {
  const preferred = [gene('9606'), gene('9598'), gene('10090')];
  const swappedSisters = [gene('9598'), gene('9606'), gene('10090')];
  const interleaved = [gene('9606'), gene('10090'), gene('9598')];
  const split = [gene('9606', 'h1'), gene('10090'), gene('9606', 'h2')];

  assert.equal(isTreeLinearization(preferred, tree), true);
  assert.equal(isPreferredSpeciesOrder(preferred, tree), true);
  assert.equal(isTreeLinearization(swappedSisters, tree), true);
  assert.equal(isPreferredSpeciesOrder(swappedSisters, tree), false);
  assert.equal(isTreeLinearization(interleaved, tree), false);
  assert.equal(isTreeLinearization(split, tree), false);
});

test('drops unary ranks and keeps a taxon that groups more than one species', () => {
  const model = speciesAxisModel(['9606', '9598', '10090'], tree);
  assert.ok(model);
  assert.deepEqual(
    model.leaves.map((leaf) => leaf.label),
    ['human', 'chimpanzee', 'mouse']
  );
  const labels = model.brackets.map((bracket) => bracket.label).sort();
  assert.deepEqual(labels, ['Euarchontoglires', 'Primates']);
  const primates = model.brackets.find((bracket) => bracket.label === 'Primates');
  assert.equal(primates?.start, 0);
  assert.equal(primates?.end, 1);
  assert.equal(model.depth >= 2, true);
});

test('a species with several genes is one leaf covering those columns', () => {
  const model = speciesAxisModel(['9606', '9606', '9598'], tree);
  assert.ok(model);
  assert.equal(model.leaves.length, 2);
  assert.deepEqual(
    model.leaves.map((leaf) => [leaf.start, leaf.end]),
    [
      [0, 1],
      [2, 2],
    ]
  );
});

test('keeps clades intact when preferredDisplayOrder would interleave them', () => {
  // human 1 and mouse 2 would put mouse between human and chimpanzee.
  const interleaved = parseSpeciesByTaxon({
    taxon: { scientificName: 'Boreoeutheria', id: 10 },
    children: [
      {
        taxon: { scientificName: 'Laurasiatheria', id: 11 },
        children: [
          {
            taxon: { scientificName: 'Felis', id: 12 },
            species: [{ id: 9685, name: 'cat', genus: 'Felis', speciesName: 'catus', preferredDisplayOrder: 7 }],
          },
          {
            taxon: { scientificName: 'Bos', id: 13 },
            species: [{ id: 9913, name: 'cattle', genus: 'Bos', speciesName: 'taurus', preferredDisplayOrder: 10 }],
          },
        ],
      },
      {
        taxon: { scientificName: 'Euarchontoglires', id: 14 },
        children: [
          {
            taxon: { scientificName: 'Homininae', id: 15 },
            children: [
              {
                taxon: { scientificName: 'Homo', id: 16 },
                species: [{ id: 9606, name: 'human', genus: 'Homo', speciesName: 'sapiens', preferredDisplayOrder: 1 }],
              },
              {
                taxon: { scientificName: 'Pan', id: 17 },
                species: [
                  { id: 9598, name: 'chimpanzee', genus: 'Pan', speciesName: 'troglodytes', preferredDisplayOrder: 26 },
                ],
              },
            ],
          },
          {
            taxon: { scientificName: 'Murinae', id: 18 },
            children: [
              {
                taxon: { scientificName: 'Mus', id: 19 },
                species: [
                  { id: 10090, name: 'mouse', genus: 'Mus', speciesName: 'musculus', preferredDisplayOrder: 2 },
                ],
              },
              {
                taxon: { scientificName: 'Rattus', id: 20 },
                species: [
                  { id: 10116, name: 'rat', genus: 'Rattus', speciesName: 'norvegicus', preferredDisplayOrder: 30 },
                ],
              },
            ],
          },
        ],
      },
    ],
  }) as TaxonTree;
  const ordered = orderGenesByPreferredDisplay(
    [gene('10116'), gene('9685'), gene('9606'), gene('10090'), gene('9913'), gene('9598')],
    interleaved
  );
  assert.deepEqual(
    ordered.map((entry) => entry.speciesId),
    ['9606', '9598', '10090', '10116', '9685', '9913']
  );
  assert.equal(isTreeLinearization(ordered, interleaved), true);
  assert.equal(isPreferredSpeciesOrder(ordered, interleaved), true);
});

test('puts a species the tree does not know after the ranked blocks', () => {
  const ordered = orderGenesByPreferredDisplay([gene('999', 'z'), gene('10090', 'm')], tree);
  assert.deepEqual(
    ordered.map((entry) => entry.geneId),
    ['m', 'z']
  );
  assert.equal(isTreeLinearization(ordered, tree), false);
});
