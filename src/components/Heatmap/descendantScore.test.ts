import assert from 'node:assert/strict';
import { test } from 'node:test';

import { callDescendantExpressionScore, descendantExpressionScore, formatExpressionScore } from './descendantScore.ts';

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
