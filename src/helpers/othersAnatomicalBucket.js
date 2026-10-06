// Synthetic y-axis bucket for anatomical terms that are not part of the SUMMARY forest.
// Expanding it loads children of BGEE:000000 with discard_anat_entity_and_children_id=SUMMARY.

export const OTHERS_BUCKET_ID = 'others';
export const OTHERS_BUCKET_LABEL = 'others';
// Bgee anatomical root (ConditionDAO.ANAT_ENTITY_ROOT_ID).
export const OTHERS_ANAT_ENTITY_ID = 'BGEE:0000000';
export const OTHERS_CELL_TYPE_ID = 'GO:0005575';
const ROOT_TERM_ID = 'UBERON:0001062-GO:0005575';

export const isOthersBucket = (node) => node?.isOthersBucket === true || node?.id === OTHERS_BUCKET_ID;

export const createOthersBucketNode = (depth = 1) => ({
  id: OTHERS_BUCKET_ID,
  label: OTHERS_BUCKET_LABEL,
  anatEntityId: OTHERS_ANAT_ENTITY_ID,
  anatEntityLabel: OTHERS_BUCKET_LABEL,
  cellTypeId: OTHERS_CELL_TYPE_ID,
  cellTypeLabel: 'cellular component',
  depth,
  isTopLevelTerm: true,
  isOthersBucket: true,
  isExpanded: false,
  isPopulated: true,
  hasBeenQueried: false,
  isSingleCell: false,
  children: [],
});

export const othersBucketTermProps = () => ({
  label: OTHERS_BUCKET_LABEL,
  anatEntityId: OTHERS_ANAT_ENTITY_ID,
  anatEntityLabel: OTHERS_BUCKET_LABEL,
  cellTypeId: OTHERS_CELL_TYPE_ID,
  cellTypeLabel: 'cellular component',
  isTopLevelTerm: true,
  isOthersBucket: true,
  isExpanded: false,
  isPopulated: true,
  hasBeenQueried: false,
  isSingleCell: false,
});

// Append the bucket as the last child of the anatomical-entity root.
export const appendOthersBucket = (anatTerms, termProps) => {
  if (!Array.isArray(anatTerms) || anatTerms.length === 0) return anatTerms;
  const root = anatTerms.find((term) => term.id === ROOT_TERM_ID) || anatTerms[0];
  if (!root.children) root.children = [];
  if (root.children.some((child) => isOthersBucket(child))) return anatTerms;
  root.children.push(createOthersBucketNode((root.depth ?? 0) + 1));
  if (termProps && !(OTHERS_BUCKET_ID in termProps)) {
    termProps[OTHERS_BUCKET_ID] = othersBucketTermProps();
  }
  return anatTerms;
};
