import { useEffect, useState, useMemo, useCallback, useRef } from 'react';

import Button from '../../../components/Bulma/Button/Button';
import Species from './components/filters/Species/Species';
import useLogic, { TAB_PAGE_EXPR_CALL } from './useLogic';
import CellTypes from './components/filters/CellTypes';
import Tissues from './components/filters/Tissues/Tissues';
import Gene from './components/filters/Gene/Gene';
import DataType from './components/filters/DataType/DataType';
import DataQualityParameter from './components/filters/DataQualityParameter';
// import DevelopmentalAndLifeStages from './components/filters/DevelopmentalAndLifeStages/DevelopmentalAndLifeStages';
// import Sex from './components/filters/Sex/Sex';
// import Strain from './components/filters/Strain/Strain';
// import CallType from './components/filters/CallType';
import GeneExpressionMatrixResults from './GeneExpressionMatrixResults';
import UserFeedback from './components/UserFeedback';
import SelectedGenesList, { getSelectedGeneKey, type OrthologData } from './components/SelectedGenesList';
import MultiSpeciesGeneListInput from './components/MultiSpeciesGeneListInput';
import type { GeneResolutionStatus } from './components/MultiSpeciesGeneListInput';
import { getMetadata } from '~/helpers/metadata';
import { URL_ROOT } from '~/helpers/constants';
import './rawDataAnnotations.scss';
import Bulma from '~/components/Bulma';
import api from '~/api';
import { getGeneLabel } from '~/helpers/gene';
import { ChevronDown, ChevronUp } from 'lucide-react';

type InputMode = 'species' | 'list';

// Parse newline-separated, trimmed, non-empty gene IDs (preserving original order)
const parseGeneListIds = (text: string): string[] =>
  text
    .split(/[\r\n]+/)
    .map((line) => line.trim())
    .filter(Boolean);

export function meta() {
  return getMetadata({
    title: 'Expression graph (beta)',
  });
}

// Track genes with species information across all species
interface GeneWithSpecies {
  speciesId: string;
  speciesLabel: string;
  geneId: string;
  geneLabel: string;
}

type SelectedGenesFilter = 'all' | 'with' | 'without';

const GeneExpressionMatrix = () => {
  const [multiSpeciesGenes, setMultiSpeciesGenes] = useState<GeneWithSpecies[]>([]);
  const [isGenesListExpanded, setIsGenesListExpanded] = useState(true);
  const [selectedGenesFilter, setSelectedGenesFilter] = useState<SelectedGenesFilter>('all');
  const [geneHomologsData, setGeneHomologsData] = useState<Record<string, OrthologData>>({});
  const [fetchingGeneHomologs, setFetchingGeneHomologs] = useState<Record<string, boolean>>({});
  const fetchedGeneHomologsRef = useRef<Set<string>>(new Set());

  // Multi-species gene list input (alternative input mode)
  const [inputMode, setInputMode] = useState<InputMode>('species');
  const [geneListText, setGeneListText] = useState('');
  const [geneListStatuses, setGeneListStatuses] = useState<Record<string, GeneResolutionStatus>>({});
  const [hasResolvedGeneList, setHasResolvedGeneList] = useState(false);
  const [isResolvingGeneList, setIsResolvingGeneList] = useState(false);

  // TODO: remove this useless state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPageIsBrowseResult] = useState(false);

  const {
    searchResult,
    setSearchResult,
    show,
    selectedSpecies,
    selectedCellTypes,
    hasTissueSubStructure,
    hasCellTypeSubStructure,
    selectedGene,
    selectedTissue,
    isLoading,
    isFirstSearch,
    dataTypesExpCalls,
    dataQuality,
    setDataQuality,
    setDataTypesExpCalls,
    onChangeSpecies,
    getSpeciesLabel,
    setSelectedCellTypes,
    setSelectedTissue,
    setSelectedGene,
    setHasTissueSubStructure,
    setHasCellTypeSubStructure,
    setShow,
    AutoCompleteByType,
    onSubmit,
    resetForm,
    addConditionalParam,
    getSearchParams,
    triggerSearchChildren,
  }: any = useLogic({
    setMultiSpeciesGenes,
    multiSpeciesGenes,
  });

  // Wrapper for setSelectedGene that tracks genes with species information
  const handleGeneSelection = useCallback(
    (genes: Array<{ label: string; value: string }>) => {
      // Update the underlying selectedGene state (for current species only)
      setSelectedGene(genes);

      // Update multi-species tracking
      if (selectedSpecies.value) {
        setMultiSpeciesGenes((prev) => {
          // Remove all genes from current species
          const filtered = prev.filter((g) => g.speciesId !== selectedSpecies.value);
          // Add new genes from current species with species info
          const newGenes = genes.map((gene) => ({
            speciesId: selectedSpecies.value,
            speciesLabel: selectedSpecies.label,
            geneId: gene.value,
            geneLabel: gene.label,
          }));
          return [...filtered, ...newGenes];
        });
      }
    },
    [selectedSpecies, setSelectedGene]
  );

  // Filter genes for current species to show in Gene component
  const currentSpeciesGenes = useMemo(() => {
    return multiSpeciesGenes
      .filter((g) => g.speciesId === selectedSpecies.value)
      .map((g) => ({
        label: g.geneLabel,
        value: g.geneId,
      }));
  }, [multiSpeciesGenes, selectedSpecies.value]);

  // Remove a gene from multi-species tracking
  const removeGene = useCallback(
    (speciesId: string, geneId: string) => {
      setMultiSpeciesGenes((prev) => prev.filter((g) => !(g.speciesId === speciesId && g.geneId === geneId)));

      // Also remove from selectedGene if it's the current species
      if (speciesId === selectedSpecies.value) {
        setSelectedGene((prev: Array<{ label: string; value: string }>) => prev.filter((g) => g.value !== geneId));
      }
    },
    [selectedSpecies.value, setSelectedGene]
  );

  const fetchGeneHomologs = useCallback((geneId: string, speciesId: string) => {
    const key = getSelectedGeneKey(speciesId, geneId);
    if (fetchedGeneHomologsRef.current.has(key)) {
      return;
    }
    fetchedGeneHomologsRef.current.add(key);
    setFetchingGeneHomologs((prev) => ({ ...prev, [key]: true }));
    api.search.genes
      .homologs(geneId, speciesId)
      .then((result) => {
        setGeneHomologsData((prev) => ({
          ...prev,
          [key]: result.data,
        }));
      })
      .catch((error) => {
        console.error(`Error fetching homologs for ${key}:`, error);
        fetchedGeneHomologsRef.current.delete(key);
      })
      .finally(() => {
        setFetchingGeneHomologs((prev) => ({ ...prev, [key]: false }));
      });
  }, []);

  // Fetch homologs when the genes list is expanded; cache survives collapse.
  useEffect(() => {
    if (!isGenesListExpanded) {
      return;
    }
    multiSpeciesGenes.forEach((gene) => {
      fetchGeneHomologs(gene.geneId, gene.speciesId);
    });
  }, [isGenesListExpanded, multiSpeciesGenes, fetchGeneHomologs]);

  // Drop cached homolog data for genes no longer selected.
  useEffect(() => {
    const currentKeys = new Set(multiSpeciesGenes.map((g) => getSelectedGeneKey(g.speciesId, g.geneId)));
    fetchedGeneHomologsRef.current.forEach((key) => {
      if (!currentKeys.has(key)) {
        fetchedGeneHomologsRef.current.delete(key);
      }
    });
    setGeneHomologsData((prev) => {
      const filtered: Record<string, OrthologData> = {};
      Object.keys(prev).forEach((key) => {
        if (currentKeys.has(key)) {
          filtered[key] = prev[key];
        }
      });
      return filtered;
    });
  }, [multiSpeciesGenes]);

  const clearGeneHomologsCache = useCallback(() => {
    fetchedGeneHomologsRef.current.clear();
    setGeneHomologsData({});
    setFetchingGeneHomologs({});
  }, []);

  // Add orthologs for a gene.
  //
  // The /homologs API returns orthologsByTaxon ordered from most specific (highest "level")
  // to most general (lowest "level"). Each entry's `genes` array is ALREADY cumulative for
  // that taxon, i.e. it contains every ortholog at or below that taxonomic level. So when
  // the user picks a taxon, we just take that single entry's genes -- iterating across
  // multiple levels would re-add the same genes several times (Bilateria already contains
  // every Chordate gene, which already contains every Clupeocephala gene, etc.).
  const addOrthologs = useCallback(
    async (geneId: string, speciesId: string, taxonId?: string) => {
      try {
        const key = getSelectedGeneKey(speciesId, geneId);
        let taxa = geneHomologsData[key]?.orthologsByTaxon;
        if (!taxa) {
          const result = await api.search.genes.homologs(geneId, speciesId);
          taxa = result?.data?.orthologsByTaxon || [];
          setGeneHomologsData((prev) => ({
            ...prev,
            [key]: result.data,
          }));
          fetchedGeneHomologsRef.current.add(key);
        }

        let sourceEntry: any = null;
        if (taxonId) {
          sourceEntry = taxa.find(
            (entry: any) => entry.taxon.id === taxonId || entry.taxon.id?.toString() === taxonId.toString()
          );
        } else {
          // No explicit taxon -> take the most general (last) entry, which already includes
          // every ortholog returned by the API.
          sourceEntry = taxa[taxa.length - 1] || null;
        }
        if (!sourceEntry) return;

        // Build orthologs with an intra-batch dedup safety net (in case the API ever
        // returns duplicate entries within a single taxon's genes array).
        const seenInBatch = new Set<string>();
        const orthologs: GeneWithSpecies[] = [];
        (sourceEntry.genes || []).forEach((gene: any) => {
          const key = `${gene.species.id}:${gene.geneId}`;
          if (seenInBatch.has(key)) return;
          seenInBatch.add(key);
          orthologs.push({
            speciesId: gene.species.id,
            speciesLabel: `${gene.species.genus} ${gene.species.speciesName}${
              gene.species.name ? ` - ${gene.species.name}` : ''
            }`,
            geneId: gene.geneId,
            geneLabel: getGeneLabel(gene),
          });
        });

        // Merge into multiSpeciesGenes, skipping any orthologs already present.
        setMultiSpeciesGenes((prev) => {
          const existingKeys = new Set(prev.map((g) => `${g.speciesId}:${g.geneId}`));
          const newOrthologs = orthologs.filter((orth) => !existingKeys.has(`${orth.speciesId}:${orth.geneId}`));
          return [...prev, ...newOrthologs];
        });
      } catch (error) {
        console.error('Error fetching orthologs:', error);
      }
    },
    [geneHomologsData]
  );

  // Sync selectedGene from useLogic into multiSpeciesGenes (handles URL params initialization)
  // This ensures genes initialized from URL params are tracked in multiSpeciesGenes
  useEffect(() => {
    if (selectedSpecies.value && selectedGene.length > 0) {
      // Check if these genes are already in multiSpeciesGenes for this species
      const existingGeneIds = new Set(
        multiSpeciesGenes.filter((g) => g.speciesId === selectedSpecies.value).map((g) => g.geneId)
      );
      const newGeneIds = new Set(selectedGene.map((g) => g.value));

      // Only update if there are new genes or genes are missing
      const hasNewGenes = selectedGene.some((g) => !existingGeneIds.has(g.value));
      const hasMissingGenes =
        existingGeneIds.size !== newGeneIds.size || [...existingGeneIds].some((id) => !newGeneIds.has(id));

      if (hasNewGenes || hasMissingGenes) {
        setMultiSpeciesGenes((prev) => {
          // Remove all genes from current species
          const filtered = prev.filter((g) => g.speciesId !== selectedSpecies.value);
          // Add genes from selectedGene with species info
          const newGenes = selectedGene.map((gene) => ({
            speciesId: selectedSpecies.value,
            speciesLabel: selectedSpecies.label,
            geneId: gene.value,
            geneLabel: gene.label,
          }));
          return [...filtered, ...newGenes];
        });
      }
    }
  }, [selectedGene, selectedSpecies.value, selectedSpecies.label]); // Sync when selectedGene changes (e.g., from URL params)

  // Sync currentSpeciesGenes with selectedGene when species changes
  // Use a ref to track the previous species to avoid unnecessary updates
  const prevSpeciesRef = useRef<string | null>(null);
  useEffect(() => {
    if (selectedSpecies.value && prevSpeciesRef.current !== selectedSpecies.value) {
      const genesForSpecies = multiSpeciesGenes
        .filter((g) => g.speciesId === selectedSpecies.value)
        .map((g) => ({
          label: g.geneLabel,
          value: g.geneId,
        }));
      setSelectedGene(genesForSpecies);
      prevSpeciesRef.current = selectedSpecies.value;
    }
  }, [selectedSpecies.value, multiSpeciesGenes, setSelectedGene]); // Sync when species changes

  // Handler for Reinitialize button - clears multiSpeciesGenes, resets form, and
  // clears the previous search result so the "With data" / "No data" filters return
  // to their inactive state and any stale heatmap is hidden.
  const handleReinitialize = useCallback(() => {
    setMultiSpeciesGenes([]);
    clearGeneHomologsCache();
    setGeneListText('');
    setGeneListStatuses({});
    setHasResolvedGeneList(false);
    setSelectedGenesFilter('all');
    setIsGenesListExpanded(true);
    setSearchResult(null);
    resetForm(false);
  }, [clearGeneHomologsCache, resetForm, setSearchResult]);

  // Resolve textarea content into multiSpeciesGenes; returns the resolved gene list.
  // Each line's resolution status is tracked in geneListStatuses for inline display.
  const resolveGeneList = useCallback(async (text: string): Promise<GeneWithSpecies[]> => {
    const geneIds = Array.from(new Set(parseGeneListIds(text)));
    if (geneIds.length === 0) {
      setGeneListStatuses({});
      setHasResolvedGeneList(true);
      setMultiSpeciesGenes([]);
      return [];
    }

    setIsResolvingGeneList(true);
    setHasResolvedGeneList(true);
    setGeneListStatuses(
      geneIds.reduce<Record<string, GeneResolutionStatus>>((acc, id) => {
        acc[id] = { state: 'pending' };
        return acc;
      }, {})
    );

    const settled = await Promise.all(
      geneIds.map(async (geneId): Promise<[string, GeneResolutionStatus, GeneWithSpecies | null]> => {
        try {
          const result: any = await api.search.genes.geneSearchResult(geneId);
          if (result?.code !== 200) {
            return [geneId, { state: 'error' }, null];
          }
          const matchCount = result.data?.result?.totalMatchCount ?? 0;
          const matches = result.data?.result?.geneMatches || [];
          if (matchCount === 1 && matches[0]?.gene) {
            const gene = matches[0].gene;
            const speciesLabel = `${gene.species.genus} ${gene.species.speciesName}${
              gene.species.name ? ` - ${gene.species.name}` : ''
            }`;
            const geneEntry: GeneWithSpecies = {
              speciesId: gene.species.id,
              speciesLabel,
              geneId: gene.geneId,
              geneLabel: getGeneLabel(gene),
            };
            return [geneId, { state: 'found', speciesLabel, geneLabel: geneEntry.geneLabel }, geneEntry];
          }
          if (matchCount > 1) {
            return [geneId, { state: 'ambiguous', matchCount }, null];
          }
          return [geneId, { state: 'not_found' }, null];
        } catch (err) {
          console.error(`[GeneExpressionMatrix.resolveGeneList] error for ${geneId}:`, err);
          return [geneId, { state: 'error' }, null];
        }
      })
    );

    const nextStatuses: Record<string, GeneResolutionStatus> = {};
    const resolved: GeneWithSpecies[] = [];
    const seenKeys = new Set<string>();
    settled.forEach(([id, status, gene]) => {
      nextStatuses[id] = status;
      if (gene) {
        const key = `${gene.speciesId}:${gene.geneId}`;
        if (!seenKeys.has(key)) {
          seenKeys.add(key);
          resolved.push(gene);
        }
      }
    });

    setGeneListStatuses(nextStatuses);
    setMultiSpeciesGenes(resolved);
    setIsResolvingGeneList(false);
    return resolved;
  }, []);

  // Submit handler that resolves the gene list first when list-input mode is active.
  // After a successful submit we collapse the "Selected Genes" panel so the user's
  // attention is directed to the Expression Graph below; the search form itself
  // stays expanded so filters can be tweaked and re-submitted.
  const handleSubmit = useCallback(async () => {
    setSelectedGenesFilter('all');
    if (inputMode === 'list') {
      const resolved = await resolveGeneList(geneListText);
      if (resolved.length === 0) return;
      setIsGenesListExpanded(false);
      onSubmit(resolved);
      return;
    }
    if (multiSpeciesGenes.length === 0) return;
    setIsGenesListExpanded(false);
    onSubmit(multiSpeciesGenes);
  }, [inputMode, geneListText, resolveGeneList, onSubmit, multiSpeciesGenes]);

  // Whether the Submit button should be enabled
  const canSubmit = useMemo(() => {
    if (isLoading || isResolvingGeneList) return false;
    if (inputMode === 'list') {
      return parseGeneListIds(geneListText).length > 0;
    }
    return multiSpeciesGenes.length > 0;
  }, [isLoading, isResolvingGeneList, inputMode, geneListText, multiSpeciesGenes.length]);

  const resultExprsCall = searchResult?.expressionData?.expressionCalls || [];
  const results = resultExprsCall;
  // const defaultColumDesc = searchResult?.columnDescriptions?.[dataType] || [];
  // const columnDescExprsCall = searchResult?.columnDescriptions || [];
  // const columnsDesc = isExprCalls ? columnDescExprsCall : defaultColumDesc;

  // Extract unique genes from search results - only show genes that have been searched
  const searchedGenes = useMemo(() => {
    if (results.length === 0) return [];

    // Get unique genes from expression calls
    const geneMap = new Map<string, { label: string; value: string }>();
    results.forEach((result) => {
      const geneId = result.gene.geneId;
      const geneName = result.gene.name;
      if (!geneMap.has(geneId)) {
        // Try to find matching gene from multiSpeciesGenes for label
        const multiSpeciesGene = multiSpeciesGenes.find((g) => g.geneId === geneId);
        geneMap.set(geneId, {
          label: multiSpeciesGene?.geneLabel || (geneName ? `${geneId} - ${geneName}` : geneId),
          value: geneId,
        });
      }
    });
    return Array.from(geneMap.values());
  }, [results, multiSpeciesGenes]);

  // Set of geneIds that returned at least one expression call in the current search results
  const geneIdsWithData = useMemo<Set<string>>(() => new Set(results.map((r: any) => r.gene.geneId)), [results]);

  // Whether a search has been run (so we can show with/without data filters)
  const hasSearchResults = searchResult !== null;

  // Counts for the Selected Genes header filter tabs
  const genesWithDataCount = useMemo(
    () => multiSpeciesGenes.filter((g) => geneIdsWithData.has(g.geneId)).length,
    [multiSpeciesGenes, geneIdsWithData]
  );
  const genesWithoutDataCount = multiSpeciesGenes.length - genesWithDataCount;

  // Apply the active filter to the gene list shown in the SelectedGenesList table
  const filteredSelectedGenes = useMemo(() => {
    if (!hasSearchResults || selectedGenesFilter === 'all') return multiSpeciesGenes;
    if (selectedGenesFilter === 'with') {
      return multiSpeciesGenes.filter((g) => geneIdsWithData.has(g.geneId));
    }
    return multiSpeciesGenes.filter((g) => !geneIdsWithData.has(g.geneId));
  }, [hasSearchResults, multiSpeciesGenes, geneIdsWithData, selectedGenesFilter]);

  const detailedData = TAB_PAGE_EXPR_CALL;

  // TODO: remove this useless useEffect, wth is it even doing? Changing a state that is not used anywhere?
  // Burning through CPU cycles for no reason?
  useEffect(() => {
    const params = getSearchParams();
    if (params?.initSearch?.get('filters_for_all') === '1') {
      setPageIsBrowseResult(true);
    }
  }, []);

  // TODO: use dedicated styling classes?
  return (
    <>
      <div className="rawDataAnnotation">
        <div className="columns is-8 ongletPageWrapper">
          <h1 className="ongletPages pageActive">{TAB_PAGE_EXPR_CALL.label}</h1>
        </div>

        <div>
          <h2 className="gradient-underline title is-size-5 has-text-primary">{detailedData?.searchLabel}</h2>
          {show && (
            <>
              <div className="columns is-8">
                <div className="column mr-6">
                  <div className="tabs is-toggle is-small is-fullwidth maxWidth50 mb-3 gene-input-mode-tabs">
                    <ul>
                      <li className={inputMode === 'species' ? 'is-active' : ''}>
                        <a onClick={() => setInputMode('species')}>
                          <span>Pick species &amp; genes</span>
                        </a>
                      </li>
                      <li className={inputMode === 'list' ? 'is-active' : ''}>
                        <a onClick={() => setInputMode('list')}>
                          <span>Paste gene list (multi-species)</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                  {inputMode === 'species' ? (
                    <>
                      <div className="mb-2 maxWidth50">
                        <Species
                          selectedSpecies={selectedSpecies}
                          onChangeSpecies={onChangeSpecies}
                          getSpeciesLabel={getSpeciesLabel}
                        />
                      </div>
                      {selectedSpecies.value && (
                        <div>
                          <div className="my-2 maxWidth50">
                            <Gene
                              selectedGene={currentSpeciesGenes}
                              setSelectedGene={handleGeneSelection}
                              AutoCompleteByType={AutoCompleteByType}
                            />
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="my-2 maxWidth50">
                      <MultiSpeciesGeneListInput
                        value={geneListText}
                        onChange={setGeneListText}
                        statuses={geneListStatuses}
                        isResolving={isResolvingGeneList}
                        hasResolved={hasResolvedGeneList}
                      />
                    </div>
                  )}
                  {multiSpeciesGenes.length > 0 && (
                    <div>
                      <Bulma.Card className="mt-4">
                        <Bulma.Card.Body>
                          <div className="content">
                            <div className="selected-genes-header mb-2">
                              <label className="has-text-weight-semibold selected-genes-header-label">
                                Selected Genes
                              </label>
                              <div className="tabs is-toggle is-small selected-genes-filter-tabs">
                                <ul>
                                  <li className={selectedGenesFilter === 'all' ? 'is-active' : ''}>
                                    <a onClick={() => setSelectedGenesFilter('all')}>
                                      <span>All</span>
                                      <span className="selected-genes-filter-count">({multiSpeciesGenes.length})</span>
                                    </a>
                                  </li>
                                  <li
                                    className={`${selectedGenesFilter === 'with' ? 'is-active' : ''} ${
                                      !hasSearchResults ? 'is-disabled' : ''
                                    }`}
                                  >
                                    <a
                                      onClick={() => {
                                        if (hasSearchResults) setSelectedGenesFilter('with');
                                      }}
                                      title={
                                        hasSearchResults
                                          ? 'Show only genes with expression data in the current search'
                                          : 'Run a search to enable this filter'
                                      }
                                    >
                                      <span>With data</span>
                                      <span className="selected-genes-filter-count has-text-success">
                                        ({hasSearchResults ? genesWithDataCount : '—'})
                                      </span>
                                    </a>
                                  </li>
                                  <li
                                    className={`${selectedGenesFilter === 'without' ? 'is-active' : ''} ${
                                      !hasSearchResults ? 'is-disabled' : ''
                                    }`}
                                  >
                                    <a
                                      onClick={() => {
                                        if (hasSearchResults) setSelectedGenesFilter('without');
                                      }}
                                      title={
                                        hasSearchResults
                                          ? 'Show only genes without expression data in the current search'
                                          : 'Run a search to enable this filter'
                                      }
                                    >
                                      <span>No data</span>
                                      <span className="selected-genes-filter-count has-text-danger">
                                        ({hasSearchResults ? genesWithoutDataCount : '—'})
                                      </span>
                                    </a>
                                  </li>
                                </ul>
                              </div>
                              <button
                                type="button"
                                className="button is-small is-text selected-genes-header-toggle"
                                onClick={() => setIsGenesListExpanded(!isGenesListExpanded)}
                                aria-label={isGenesListExpanded ? 'Collapse list' : 'Expand list'}
                              >
                                <span className="icon">
                                  {isGenesListExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </span>
                              </button>
                            </div>
                            {isGenesListExpanded &&
                              (filteredSelectedGenes.length > 0 ? (
                                <SelectedGenesList
                                  selectedGenes={filteredSelectedGenes}
                                  removeGene={removeGene}
                                  addOrthologs={addOrthologs}
                                  orthologData={geneHomologsData}
                                  fetchingOrthologs={fetchingGeneHomologs}
                                />
                              ) : (
                                <p className="has-text-grey is-italic is-size-7 mt-2">
                                  {selectedGenesFilter === 'with'
                                    ? 'No selected gene has expression data in the current search.'
                                    : 'All selected genes have expression data in the current search.'}
                                </p>
                              ))}
                          </div>
                        </Bulma.Card.Body>
                      </Bulma.Card>
                    </div>
                  )}
                </div>
                <div className="column">
                  {(selectedGene.length > 0 || inputMode === 'list' || multiSpeciesGenes.length > 0) && (
                    <>
                      <div className="my-2 maxWidth50">
                        <Tissues
                          selectedTissue={selectedTissue}
                          setSelectedTissue={setSelectedTissue}
                          AutoCompleteByType={AutoCompleteByType}
                          hasTissueSubStructure={hasTissueSubStructure}
                          setHasTissueSubStructure={setHasTissueSubStructure}
                          addConditionalParam={addConditionalParam}
                        />
                      </div>
                      <div className="my-2 maxWidth50">
                        <CellTypes
                          selectedCellTypes={selectedCellTypes}
                          setSelectedCellTypes={setSelectedCellTypes}
                          AutoCompleteByType={AutoCompleteByType}
                          hasCellTypeSubStructure={hasCellTypeSubStructure}
                          setHasCellTypeSubStructure={setHasCellTypeSubStructure}
                          addConditionalParam={addConditionalParam}
                        />
                      </div>
                      {/* {false && ( // TODO: display dev stage as condition param?
                          <div className="my-2 maxWidth50">
                            <DevelopmentalAndLifeStages
                              devStages={devStages}
                              hasDevStageSubStructure={hasDevStageSubStructure}
                              setDevStageSubStructure={setDevStageSubStructure}
                              selectedOptions={selectedDevStages}
                              setSelectedOptions={setSelectedDevStages}
                              addConditionalParam={addConditionalParam}
                            />
                          </div>
                        )}
                        {false && ( // TODO: display strain as condition param?
                          <div className="my-2">
                            <Strain
                              selectedStrain={selectedStrain}
                              setSelectedStrain={setSelectedStrain}
                              AutoCompleteByType={AutoCompleteByType}
                              addConditionalParam={addConditionalParam}
                            />
                          </div>
                        )}
                        {false && ( // TODO: display sex as condition param?
                          <div className="my-2">
                            <Sex
                              speciesSexes={speciesSexes}
                              selectedSexes={selectedSexes}
                              toggleSex={toggleSex}
                              addConditionalParam={addConditionalParam}
                            />
                          </div>
                        )} */}
                    </>
                  )}
                  <div>
                    {(selectedGene.length > 0 || inputMode === 'list' || multiSpeciesGenes.length > 0) && (
                      <>
                        <DataType dataTypes={dataTypesExpCalls} setDataTypes={setDataTypesExpCalls} />
                        {/* {false && ( // TODO: remove permanently?
                          <CallType callTypes={callTypes} setCallTypes={setCallTypes} />
                        )} */}
                        <hr />
                        <DataQualityParameter dataQuality={dataQuality} setDataQuality={setDataQuality} />
                      </>
                    )}
                    <div className="submit-reinit">
                      <Button
                        className="button is-success is-light is-outlined"
                        type="submit"
                        onClick={handleSubmit}
                        disabled={!canSubmit}
                      >
                        {isResolvingGeneList ? 'Resolving...' : 'Submit'}
                      </Button>
                      <Button
                        type="button"
                        className="reinit is-warning is-light is-outlined"
                        onClick={handleReinitialize}
                      >
                        Reinitialize
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
          <div className="control is-flex is-align-items-center">
            <button className="button mr-2 mb-5" type="button" onClick={() => setShow(!show)}>
              {show ? 'Hide Form' : 'Show Form'}
            </button>
          </div>

          <p>
            Examples:
            <br />
            <a
              className="internal-link"
              href={`${URL_ROOT}/search/expression-matrix?species_id=7227&gene_id=FBgn0030298&gene_id=FBgn0030715&gene_id=FBgn0041626&gene_id=FBgn0023523&gene_id=FBgn0030016&gene_id=FBgn0030204`}
            >
              Olfactory receptor genes (<i>Drosophila melanogaster</i>)
            </a>
            <br />
            <a
              className="internal-link"
              href={`${URL_ROOT}/search/expression-matrix?species_id=9606&gene_id=ENSG00000206172&gene_id=ENSG00000188536&gene_id=ENSG00000244734&gene_id=ENSG00000223609&gene_id=ENSG00000213934&gene_id=ENSG00000196565&gene_id=ENSG00000206177&gene_id=ENSG00000130656`}
            >
              Hemoglobin genes (<i>Homo sapiens</i>)
            </a>
            <br />
            <a
              className="internal-link"
              href={`${URL_ROOT}/search/expression-matrix?gene_list=ENSG00000139767%0AENSMUSG00000063919%0AENSPPAG00000028134%0AENSPTRG00000005517ENSBTAG00000008676%0AENSRNOG00000001141%0AENSSSCG00000009845%0AENSECAG00000021729%0AENSCAFG00000023113%0AENSOCUG00000004503%0AENSMODG00000015283%0AENSACAG00000004139%0AENSXETG00000019934&display_rp=1&display_type=json`}
            >
              SSRM4 - brain specific genes (<i>multi-species</i>)
            </a>
            <br />
            <a
              className="internal-link"
              href={`${URL_ROOT}/search/expression-matrix?gene_list=ENSDARG00000059263%0AENSG00000170178%0AENSMUSG00000001823&display_rp=1&display_type=json`}
            >
              Hoxd12 - pattern development genes (<i>multi-species</i>)
            </a>
          </p>

          <h2 className="gradient-underline title is-size-5 has-text-primary">{detailedData?.resultLabel}</h2>

          <div className="resultPart" style={{ position: 'relative' }}>
            {isLoading && (
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.7)',
                  zIndex: 10,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <progress
                  className="progress is-small is-primary m-5"
                  style={{
                    animationDuration: '2s',
                    width: '80%',
                  }}
                />
              </div>
            )}

            <GeneExpressionMatrixResults
              results={results}
              // columnDescriptions={columnsDesc}
              // searchParams={getSearchParams}
              genes={searchedGenes}
              isLoading={isLoading}
              isFirstSearch={isFirstSearch}
              onFetchChildren={(parentId, selectedTissueId) =>
                triggerSearchChildren(parentId, selectedTissueId, multiSpeciesGenes)
              }
            />
          </div>
          <UserFeedback />
        </div>
      </div>
    </>
  );
};

export default GeneExpressionMatrix;
