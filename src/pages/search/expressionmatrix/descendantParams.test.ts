import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  ANAT_ENTITY_DESCENDANT_PARAM,
  CELL_TYPE_DESCENDANT_PARAM,
  applyDescendantPageParams,
  copyMissingDescendantFlags,
  descendantFlagFromParams,
  descendantFlagFromValue,
} from './descendantParams.ts';

test('reads true, false, 1, and 0, and ignores anything else', () => {
  assert.equal(descendantFlagFromValue('true'), true);
  assert.equal(descendantFlagFromValue('TRUE'), true);
  assert.equal(descendantFlagFromValue('1'), true);
  assert.equal(descendantFlagFromValue(true), true);
  assert.equal(descendantFlagFromValue('false'), false);
  assert.equal(descendantFlagFromValue('0'), false);
  assert.equal(descendantFlagFromValue(false), false);
  assert.equal(descendantFlagFromValue(''), null);
  assert.equal(descendantFlagFromValue(null), null);
  assert.equal(descendantFlagFromValue('yes'), null);
});

test('reads a flag from a page URL or an API parameter object', () => {
  const url = new URLSearchParams('anat_entity_descendant=false&cell_type_descendant=1');
  assert.equal(descendantFlagFromParams(url, ANAT_ENTITY_DESCENDANT_PARAM), false);
  assert.equal(descendantFlagFromParams(url, CELL_TYPE_DESCENDANT_PARAM), true);
  assert.equal(descendantFlagFromParams(url, 'stage_descendant'), null);

  assert.equal(descendantFlagFromParams({ anat_entity_descendant: 'false' }, ANAT_ENTITY_DESCENDANT_PARAM), false);
  assert.equal(descendantFlagFromParams({ cell_type_descendant: ['0'] }, CELL_TYPE_DESCENDANT_PARAM), false);
  assert.equal(descendantFlagFromParams({}, ANAT_ENTITY_DESCENDANT_PARAM), null);
});

test('keeps an explicit page param and fills only a missing flag from the stored query', () => {
  const target = new URLSearchParams('anat_entity_descendant=false');
  copyMissingDescendantFlags(target, {
    anat_entity_descendant: 'true',
    cell_type_descendant: 'false',
  });
  assert.equal(target.get(ANAT_ENTITY_DESCENDANT_PARAM), 'false');
  assert.equal(target.get(CELL_TYPE_DESCENDANT_PARAM), 'false');
});

test('publishes an opt-out and drops the default', () => {
  const params = new URLSearchParams('anat_entity_descendant=1&cell_type_descendant=1&data=abc');
  applyDescendantPageParams(params, true, false);
  assert.equal(params.get(ANAT_ENTITY_DESCENDANT_PARAM), null);
  assert.equal(params.get(CELL_TYPE_DESCENDANT_PARAM), 'false');
  assert.equal(params.get('data'), 'abc');
});
