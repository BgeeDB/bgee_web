import { getMetadata } from '~/helpers/metadata';
import RawDataAnnotations from '~/pages/search/rawdata/RawDataAnnotations';
import { DATA_TYPES, EXPERIMENTS, searchRawData } from '~/pages/search/rawdata/useLogic';

export function meta() {
  return getMetadata({
    title: 'Raw data annotated and processed',
    description: 'Search for Experiments, Raw data annotations and Processed expression values',
    keywords:
      'Raw data, annotations, annotated, processed, experiments, raw data annotations, processed expression values',
  });
}

// Enabled basic SSR for when a species_id is provided in the URL, to help SEO to find experiments links
// But the search is retriggered on the client side to get all data
export async function loader({ request }) {
  const url = new URL(request.url);
  const speciesId = url.searchParams.get('species_id');
  // const isExprCalls = url.searchParams.get('pageType') === TAB_PAGE_EXPR_CALL.id || url.pathname.includes('/expression-calls');
  if (speciesId && url.searchParams.size === 1) {
    // Preload when species ID provided for SEO
    const { resp, searchParams } = await searchRawData({
      hash: '',
      isFirstSearch: true,
      initSearch: url.searchParams,
      pageType: url.searchParams.get('pageType') || EXPERIMENTS,
      selectedSpecies: speciesId,
      dataType: [url.searchParams.get('data_type') || DATA_TYPES[0].id],
      // dataType: ALL_DATA_TYPES_ID,
      selectedExpOrAssay: [],
      selectedCellTypes: [],
      selectedGene: [],
      selectedStrain: [],
      selectedTissue: [],
      selectedDevStages: [],
      selectedSexes: ['all'],
      hasCellTypeSubStructure: true,
      hasDevStageSubStructure: true,
      hasTissueSubStructure: true,
      onlyPropagated: true,
      pageNumber: '1',
      limit: url.searchParams.get('limit') || '50',
    });
    return { initSearchResult: { ...resp.data, searchParams, initSpecies: speciesId } };
  }
  return { initSearchResult: {} };
}

export default function RawDataPage({ loaderData }) {
  const { initSearchResult } = loaderData;

  return <RawDataAnnotations initSearchResult={initSearchResult} />;
}
