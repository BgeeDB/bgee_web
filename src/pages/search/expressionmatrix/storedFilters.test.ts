import assert from 'node:assert/strict';
import { test } from 'node:test';

import { appendMissingFilterValues } from './storedFilters.ts';

test('restores every stored organ, not only the first', () => {
  const page = new URLSearchParams('data=abc');
  const stored = new URLSearchParams();
  ['UBERON:0001348', 'UBERON:0002107', 'UBERON:0000955'].forEach((id) => stored.append('anat_entity_id', id));
  stored.append('data_type', 'RNA_SEQ');
  stored.append('data_type', 'IN_SITU');

  appendMissingFilterValues(page, stored);

  assert.deepEqual(page.getAll('anat_entity_id'), ['UBERON:0001348', 'UBERON:0002107', 'UBERON:0000955']);
  assert.deepEqual(page.getAll('data_type'), ['RNA_SEQ', 'IN_SITU']);
  assert.equal(page.get('data'), 'abc');
});

test('leaves a filter the page already set', () => {
  const page = new URLSearchParams('anat_entity_id=UBERON:0000955');
  const stored = new URLSearchParams();
  stored.append('anat_entity_id', 'UBERON:0001348');
  stored.append('anat_entity_id', 'UBERON:0002107');
  stored.append('cell_type_id', 'CL:0000540');

  appendMissingFilterValues(page, stored);

  assert.deepEqual(page.getAll('anat_entity_id'), ['UBERON:0000955']);
  assert.deepEqual(page.getAll('cell_type_id'), ['CL:0000540']);
});
