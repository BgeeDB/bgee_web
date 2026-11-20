import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  bestDescendantCellMarks,
  callDescendantExpressionScore,
  cornerMarkSize,
  descendantChildMarks,
  descendantExpressionScore,
  descendantMarkBox,
  formatExpressionScore,
} from './descendantScore.ts';

test('reads a numeric best-descendant score', () => {
  assert.equal(descendantExpressionScore(87), 87);
  assert.equal(descendantExpressionScore(0), 0);
  assert.equal(descendantExpressionScore({ expressionScore: 42.5 }), 42.5);
});

test('ignores a missing or unusable best-descendant score', () => {
  assert.equal(descendantExpressionScore(undefined), undefined);
  assert.equal(descendantExpressionScore(null), undefined);
  assert.equal(descendantExpressionScore('87'), undefined);
  assert.equal(descendantExpressionScore({ expressionScore: '87' }), undefined);
  assert.equal(descendantExpressionScore(Number.NaN), undefined);
});

test('reads the score nested on expressionScore when the top-level field is null', () => {
  assert.equal(
    callDescendantExpressionScore({
      bestDescendantExpressionScore: null,
      expressionScore: {
        expressionScore: '60.07',
        bestDescendantExpressionScore: 73.13,
      },
    }),
    73.13
  );
  assert.equal(
    callDescendantExpressionScore({
      bestDescendantExpressionScore: 12,
      expressionScore: { bestDescendantExpressionScore: 99 },
    }),
    12
  );
  assert.equal(callDescendantExpressionScore({ expressionScore: { expressionScore: '60.07' } }), undefined);
  assert.equal(callDescendantExpressionScore(null), undefined);
});

test('rounds a score the same way the cell value is shown', () => {
  assert.equal(formatExpressionScore(42.126), 42.13);
  assert.equal(formatExpressionScore(0), 0);
});

test('marks every child on the path to the parent best, including ties', () => {
  const marks = descendantChildMarks(73.13, [
    { id: 'cortex', ownScore: '73.126', descendantScore: 40 },
    { id: 'stem', ownScore: 73.13, descendantScore: 10 },
    { id: 'other', ownScore: 20, descendantScore: 73.13 },
  ]);
  assert.equal(marks.get('cortex'), 'self');
  assert.equal(marks.get('stem'), 'self');
  // A sibling whose own score differs still leads to the same best descendant.
  assert.equal(marks.get('other'), 'branch');
});

test('keeps a corner mark inside a narrow column', () => {
  // Outer tile from a large gene set: about 22 by 27, with a 4px frame pad.
  const box = descendantMarkBox({ x: 0, y: 0, width: 21.97, height: 26.68 }, 4);
  assert.equal(box.x, 4);
  assert.ok(cornerMarkSize(box.width, box.height) >= 4);
  const wide = descendantMarkBox({ x: 0, y: 0, width: 47, height: 27 }, 4);
  assert.equal(wide.width, 39);
  assert.equal(cornerMarkSize(wide.width, wide.height), 8);
});

test('uses the outer corner when the fill cannot hold a mark', () => {
  const box = descendantMarkBox({ x: 1, y: 2, width: 11, height: 27 }, 4);
  assert.deepEqual(box, { x: 1, y: 2, width: 11, height: 27 });
  assert.ok(cornerMarkSize(box.width, box.height) >= 4);
  assert.equal(cornerMarkSize(2, 2), 0);
});

test('marks the branch that contains the parent best when no child score matches', () => {
  const marks = descendantChildMarks(90, [
    { id: 'cortex', ownScore: 40, descendantScore: 90 },
    { id: 'stem', ownScore: 50, descendantScore: 55 },
  ]);
  assert.equal(marks.get('cortex'), 'branch');
  assert.equal(marks.has('stem'), false);
  assert.equal(descendantChildMarks(undefined, [{ id: 'cortex', ownScore: 1 }]).size, 0);
});

test('marks children only while their parent is expanded', () => {
  const tree = [
    {
      id: 'brain',
      isExpanded: true,
      children: [{ id: 'cortex', isExpanded: false, children: [{ id: 'layer' }] }, { id: 'stem' }],
    },
    {
      id: 'heart',
      isExpanded: false,
      children: [{ id: 'ventricle' }],
    },
  ];
  const cells = [
    { x: 'geneA', y: 'brain', value: 10, maxExp: 90 },
    { x: 'geneA', y: 'cortex', value: 40, maxExp: 90 },
    { x: 'geneA', y: 'stem', value: 90, maxExp: 20 },
    { x: 'geneA', y: 'layer', value: 90, maxExp: 0 },
    { x: 'geneA', y: 'heart', value: 5, maxExp: 80 },
    { x: 'geneA', y: 'ventricle', value: 80, maxExp: 0 },
    { x: 'geneB', y: 'brain', value: 1, maxExp: 30 },
    { x: 'geneB', y: 'cortex', value: 30, maxExp: 4 },
  ];
  const marks = bestDescendantCellMarks(tree, cells);
  assert.equal(marks.get('geneA\u0000stem'), 'self');
  assert.equal(marks.get('geneA\u0000cortex'), 'branch');
  assert.equal(marks.has('geneA\u0000layer'), false);
  assert.equal(marks.has('geneA\u0000ventricle'), false);
  assert.equal(marks.get('geneB\u0000cortex'), 'self');
});
