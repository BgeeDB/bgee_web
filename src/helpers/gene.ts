export const getGeneLabel = (g) => `${g?.geneId}${g?.name ? ` - ${g?.name}` : ''}`;

const sameGeneId = (left, right) => String(left ?? '').toLowerCase() === String(right ?? '').toLowerCase();

// A pasted ID can match its own record and a synonym (for example LRG_292 for ENSG00000012048).
// Prefer the record whose geneId is the query. A unique name hit is still accepted.
// Several inexact hits stay unresolved.
export const pickGeneFromSearchResult = (query, result) => {
  if (!result || result.code !== 200) return { state: 'error' };

  const matches = result.data?.result?.geneMatches || [];
  const matchCount = result.data?.result?.totalMatchCount ?? matches.length;
  const exact = matches.filter((match) => match?.gene && sameGeneId(match.gene.geneId, query));

  if (exact.length === 1) return { state: 'found', gene: exact[0].gene };
  if (exact.length > 1) return { state: 'ambiguous', matchCount: exact.length };
  if (matchCount === 1 && matches[0]?.gene) return { state: 'found', gene: matches[0].gene };
  if (matchCount > 1) return { state: 'ambiguous', matchCount };
  return { state: 'not_found' };
};
