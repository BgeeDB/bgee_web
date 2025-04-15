/* eslint-disable import/prefer-default-export */
export const getGeneLabel = g => `${g?.geneId}${g?.name ? ` - ${g?.name}` : ''}`;
