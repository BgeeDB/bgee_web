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
import SelectedGenesList from './components/SelectedGenesList';
import { getMetadata } from '~/helpers/metadata';
import { URL_ROOT } from '~/helpers/constants';
import './rawDataAnnotations.scss';
import Bulma from '~/components/Bulma';
import api from '~/api';
import { getGeneLabel } from '~/helpers/gene';
import { ChevronDown, ChevronUp } from 'lucide-react';

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

const GeneExpressionMatrix = () => {
  const [multiSpeciesGenes, setMultiSpeciesGenes] = useState<GeneWithSpecies[]>([]);
  const [isGenesListExpanded, setIsGenesListExpanded] = useState(true);
  // TODO: remove this useless state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setPageIsBrowseResult] = useState(false);

  const {
    searchResult,
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

  // Add orthologs for a gene
  const addOrthologs = useCallback(async (geneId: string, speciesId: string, taxonId?: string) => {
    try {
      const result = await api.search.genes.homologs(geneId, speciesId);
      const orthologs: GeneWithSpecies[] = [];

      if (taxonId) {
        // Find the selected taxon and include it plus all more specific taxa (descendants)
        const selectedTaxonIndex = result.data.orthologsByTaxon.findIndex(
          (entry: any) => entry.taxon.id === taxonId || entry.taxon.id.toString() === taxonId.toString()
        );

        if (selectedTaxonIndex !== -1) {
          // The array is ordered from most specific (highest level) to most general (lowest level)
          // When a user selects a taxon, we want to include:
          // - The selected taxon
          // - All more specific taxa (which come BEFORE the selected taxon in the array)
          // So we include from index 0 up to and including the selected taxon index
          for (let i = 0; i <= selectedTaxonIndex; i++) {
            const entry = result.data.orthologsByTaxon[i];
            entry.genes.forEach((gene: any) => {
              orthologs.push({
                speciesId: gene.species.id,
                speciesLabel: `${gene.species.genus} ${gene.species.speciesName}`,
                geneId: gene.geneId,
                geneLabel: getGeneLabel(gene),
              });
            });
          }
        }
      } else {
        // If no taxon selected, include all orthologs (original behavior)
        result.data.orthologsByTaxon.forEach((entry: any) => {
          entry.genes.forEach((gene: any) => {
            orthologs.push({
              speciesId: gene.species.id,
              speciesLabel: `${gene.species.genus} ${gene.species.speciesName}`,
              geneId: gene.geneId,
              geneLabel: getGeneLabel(gene),
            });
          });
        });
      }

      // Add orthologs that don't already exist
      setMultiSpeciesGenes((prev) => {
        const existingKeys = new Set(prev.map((g) => `${g.speciesId}:${g.geneId}`));
        const newOrthologs = orthologs.filter((orth) => !existingKeys.has(`${orth.speciesId}:${orth.geneId}`));
        return [...prev, ...newOrthologs];
      });
    } catch (error) {
      console.error('Error fetching orthologs:', error);
    }
  }, []);

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

  // Handler for Reinitialize button - clears multiSpeciesGenes and resets form
  const handleReinitialize = useCallback(() => {
    setMultiSpeciesGenes([]);
    resetForm(false);
  }, [resetForm]);

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
                  {multiSpeciesGenes.length > 0 && (
                    <div>
                      <Bulma.Card className="mt-4">
                        <Bulma.Card.Body>
                          <div className="content">
                            <div className="is-flex is-align-items-center is-justify-content-space-between mb-2">
                              <label className="has-text-weight-semibold">
                                Selected Genes ({multiSpeciesGenes.length})
                              </label>
                              <button
                                type="button"
                                className="button is-small is-text"
                                onClick={() => setIsGenesListExpanded(!isGenesListExpanded)}
                                aria-label={isGenesListExpanded ? 'Collapse list' : 'Expand list'}
                              >
                                <span className="icon">
                                  {isGenesListExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                </span>
                              </button>
                            </div>
                            {isGenesListExpanded && (
                              <SelectedGenesList
                                selectedGenes={multiSpeciesGenes}
                                removeGene={removeGene}
                                addOrthologs={addOrthologs}
                              />
                            )}
                          </div>
                        </Bulma.Card.Body>
                      </Bulma.Card>
                    </div>
                  )}
                </div>
                <div className="column">
                  {selectedGene.length > 0 && (
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
                    {selectedGene.length > 0 && (
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
                        onClick={() => onSubmit(multiSpeciesGenes)}
                        disabled={isLoading}
                      >
                        Submit
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
