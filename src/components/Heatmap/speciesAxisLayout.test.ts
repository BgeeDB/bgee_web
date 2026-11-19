import assert from 'node:assert/strict';
import { test } from 'node:test';

import type { SpeciesAxisModel } from '../../helpers/speciesTree';
import { buildSpeciesAxisLayout, highlightedTaxonKeys } from './speciesAxisLayout.ts';

const CHAR_WIDTH = 8;

const columnScale = (domain: string[], plotWidth: number) => {
  const bandwidth = plotWidth / domain.length;
  const scale = (value: string) => {
    const index = domain.indexOf(value);
    return index < 0 ? undefined : index * bandwidth;
  };
  scale.bandwidth = () => bandwidth;
  scale.step = () => bandwidth;
  return scale;
};

const helpers = {
  verticalExtent: (text: string) => text.length * CHAR_WIDTH,
  rightExtent: () => CHAR_WIDTH,
  labelMetrics: (fontSize: number) => ({ fontSize, charWidth: CHAR_WIDTH }),
};

// Human and chimpanzee are neighboring multi-gene species. Rat is one gene and a short name,
// hung directly on the root the way a unary rank is dropped.
const model: SpeciesAxisModel = {
  depth: 2,
  leaves: [
    { speciesId: '9606', label: 'Human', start: 0, end: 2 },
    { speciesId: '9598', label: 'Chimpanzee', start: 3, end: 4 },
    { speciesId: '10116', label: 'Rat', start: 5, end: 5 },
  ],
  brackets: [
    {
      key: 'mammals',
      label: 'Mammals',
      depth: 2,
      start: 0,
      end: 5,
      children: [
        { start: 0, end: 4, depth: 1 },
        { start: 5, end: 5, depth: 0 },
      ],
    },
    {
      key: 'primates',
      label: 'Primates',
      depth: 1,
      start: 0,
      end: 4,
      children: [
        { start: 0, end: 2, depth: 0 },
        { start: 3, end: 4, depth: 0 },
      ],
    },
  ],
};

const domain = ['g0', 'g1', 'g2', 'g3', 'g4', 'g5'];

test('species names share the matrix edge and stems reach each name', () => {
  const layout = buildSpeciesAxisLayout({
    model,
    domain,
    xScale: columnScale(domain, 600),
    plotRight: 600,
    leafPadding: 15,
    helpers,
  });
  assert.ok(layout);
  const human = layout.leaves.find((leaf) => leaf.label === 'Human');
  const chimpanzee = layout.leaves.find((leaf) => leaf.label === 'Chimpanzee');
  const rat = layout.leaves.find((leaf) => leaf.label === 'Rat');
  const primates = layout.brackets.find((bracket) => bracket.label === 'Primates');
  const mammals = layout.brackets.find((bracket) => bracket.label === 'Mammals');
  assert.ok(human && chimpanzee && rat && primates && mammals);

  assert.equal(human.textAnchor, 'start');
  assert.equal(human.y, chimpanzee.y);
  assert.equal(chimpanzee.y, rat.y);
  assert.ok(human.y < 0);
  assert.ok(human.y >= -20);

  // Chimpanzee is the long name, so its stem stops highest. Rat's stem continues down to the short name.
  assert.ok(primates.childYs[1] < primates.childYs[0]);
  assert.ok(primates.y < primates.childYs[1]);
  assert.ok(primates.childYs[0] - primates.y > primates.childYs[1] - primates.y);
  assert.equal(mammals.childYs[0], primates.y);
  assert.ok(mammals.childYs[1] > primates.childYs[0]);
  assert.equal(mammals.childLeafKeys[1], rat.key);
  assert.equal(mammals.childLeafKeys[0], null);
  assert.deepEqual(primates.childLeafKeys, [human.key, chimpanzee.key]);

  const reach = (baseline: number, stemEnd: number) => baseline - stemEnd;
  assert.equal(
    reach(chimpanzee.y, primates.childYs[1]) - reach(human.y, primates.childYs[0]),
    ('Chimpanzee'.length - 'Human'.length) * CHAR_WIDTH
  );
  assert.ok(layout.topSpace > -mammals.y);
});

test('a painted name length replaces the character-width estimate for that stem', () => {
  const shared = {
    model,
    domain,
    xScale: columnScale(domain, 600),
    plotRight: 600,
    leafPadding: 15,
    helpers,
  };
  const estimated = buildSpeciesAxisLayout(shared);
  const painted = buildSpeciesAxisLayout({
    ...shared,
    leafExtents: {
      'species-leaf-9598': { fontSize: 15, label: 'Chimpanzee', extent: 120 },
      'species-leaf-9606': { fontSize: 9, label: 'Human', extent: 200 },
    },
  });
  assert.ok(estimated && painted);
  const estimatedPrimates = estimated.brackets.find((bracket) => bracket.label === 'Primates');
  const paintedPrimates = painted.brackets.find((bracket) => bracket.label === 'Primates');
  assert.ok(estimatedPrimates && paintedPrimates);
  // Chimpanzee is drawn 120px tall, taller than the 10-character estimate, so its stem stops higher.
  assert.ok(paintedPrimates.childYs[1] < estimatedPrimates.childYs[1]);
  // The human measurement is for a different font size, so the estimate stands.
  assert.equal(paintedPrimates.childYs[0], estimatedPrimates.childYs[0]);
  assert.ok(painted.topSpace > estimated.topSpace);
});

test('a species bracket spans every gene of a species and stops between neighbors', () => {
  const layout = buildSpeciesAxisLayout({
    model,
    domain,
    xScale: columnScale(domain, 600),
    plotRight: 600,
    leafPadding: 15,
    helpers,
  });
  assert.ok(layout);
  const human = layout.leaves.find((leaf) => leaf.label === 'Human');
  const chimpanzee = layout.leaves.find((leaf) => leaf.label === 'Chimpanzee');
  const rat = layout.leaves.find((leaf) => leaf.label === 'Rat');
  assert.ok(human && chimpanzee && rat);
  assert.equal(rat.speciesBracket, null);
  assert.ok(human.speciesBracket);
  assert.ok(chimpanzee.speciesBracket);

  const bandwidth = 100;
  assert.ok(human.speciesBracket.x1 > 0);
  assert.ok(human.speciesBracket.x1 < bandwidth);
  assert.ok(human.speciesBracket.x2 > 2 * bandwidth);
  assert.ok(human.speciesBracket.x2 < 3 * bandwidth);
  assert.ok(human.speciesBracket.x2 < chimpanzee.speciesBracket.x1);
  assert.equal(human.speciesBracket.y, chimpanzee.speciesBracket.y);
  assert.ok(human.speciesBracket.y > human.y);
  assert.ok(human.speciesBracket.y + human.speciesBracket.tick < 0);
});

test('selecting a clade highlights its descendant clades and species', () => {
  const layout = buildSpeciesAxisLayout({
    model,
    domain,
    xScale: columnScale(domain, 600),
    plotRight: 600,
    leafPadding: 15,
    helpers,
  });
  assert.ok(layout);
  const human = layout.leaves.find((leaf) => leaf.label === 'Human');
  const chimpanzee = layout.leaves.find((leaf) => leaf.label === 'Chimpanzee');
  const rat = layout.leaves.find((leaf) => leaf.label === 'Rat');
  assert.ok(human && chimpanzee && rat);

  const fromMammals = highlightedTaxonKeys(layout, 'mammals');
  assert.deepEqual([...fromMammals].sort(), ['mammals', 'primates', human.key, chimpanzee.key, rat.key].sort());

  const fromPrimates = highlightedTaxonKeys(layout, 'primates');
  assert.deepEqual([...fromPrimates].sort(), ['primates', human.key, chimpanzee.key].sort());
  assert.equal(fromPrimates.has('mammals'), false);
  assert.equal(fromPrimates.has(rat.key), false);

  assert.deepEqual([...highlightedTaxonKeys(layout, rat.key)], [rat.key]);
});
