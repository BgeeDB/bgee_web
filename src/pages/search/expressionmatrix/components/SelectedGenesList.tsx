import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router';
import { Trash2 } from 'lucide-react';
import Button from '../../../../components/Bulma/Button/Button';
import Select from '../../../../components/Select/Select';
import api from '../../../../api';

interface GeneEntry {
  speciesId: string;
  speciesLabel: string;
  geneId: string;
  geneLabel: string;
}

interface TaxonOption {
  value: string;
  text: string;
  taxonId: string;
}

interface OrthologData {
  orthologsByTaxon: Array<{
    taxon: {
      id: string;
      scientificName: string;
    };
    genes: any[];
  }>;
}

interface SelectedGenesListProps {
  selectedGenes: GeneEntry[];
  removeGene: (speciesId: string, geneId: string) => void;
  addOrthologs: (geneId: string, speciesId: string, taxonId?: string) => Promise<void>;
}

const SelectedGenesList = ({ selectedGenes, removeGene, addOrthologs }: SelectedGenesListProps) => {
  const [loadingOrthologs, setLoadingOrthologs] = useState<Record<string, boolean>>({});
  const [fetchingOrthologs, setFetchingOrthologs] = useState<Record<string, boolean>>({});
  const [orthologData, setOrthologData] = useState<Record<string, OrthologData>>({});
  const [selectedTaxons, setSelectedTaxons] = useState<Record<string, string>>({});
  const fetchedGenesRef = useRef<Set<string>>(new Set());

  // Automatically fetch orthologs when genes are added
  useEffect(() => {
    selectedGenes.forEach((gene) => {
      const key = `${gene.speciesId}:${gene.geneId}`;
      // Only fetch if we haven't already fetched for this gene
      if (!fetchedGenesRef.current.has(key)) {
        fetchedGenesRef.current.add(key);
        setFetchingOrthologs((prev) => ({ ...prev, [key]: true }));
        api.search.genes
          .homologs(gene.geneId, gene.speciesId)
          .then((result) => {
            setOrthologData((prev) => ({
              ...prev,
              [key]: result.data,
            }));
          })
          .catch((error) => {
            console.error(`Error fetching orthologs for ${key}:`, error);
            // Remove from ref on error so we can retry
            fetchedGenesRef.current.delete(key);
          })
          .finally(() => {
            setFetchingOrthologs((prev) => ({ ...prev, [key]: false }));
          });
      }
    });
  }, [selectedGenes]);

  // Clean up ortholog data when genes are removed
  useEffect(() => {
    const currentKeys = new Set(selectedGenes.map((g) => `${g.speciesId}:${g.geneId}`));
    // Clean up ref
    fetchedGenesRef.current.forEach((key) => {
      if (!currentKeys.has(key)) {
        fetchedGenesRef.current.delete(key);
      }
    });
    setOrthologData((prev) => {
      const filtered: Record<string, OrthologData> = {};
      Object.keys(prev).forEach((key) => {
        if (currentKeys.has(key)) {
          filtered[key] = prev[key];
        }
      });
      return filtered;
    });
    setSelectedTaxons((prev) => {
      const filtered: Record<string, string> = {};
      Object.keys(prev).forEach((key) => {
        if (currentKeys.has(key)) {
          filtered[key] = prev[key];
        }
      });
      return filtered;
    });
  }, [selectedGenes]);

  if (selectedGenes.length === 0) {
    return null;
  }

  const handleAddOrthologs = async (geneId: string, speciesId: string, taxonId?: string) => {
    const key = `${speciesId}:${geneId}`;
    setLoadingOrthologs((prev) => ({ ...prev, [key]: true }));
    try {
      await addOrthologs(geneId, speciesId, taxonId);
      // Clear selected taxon after adding
      setSelectedTaxons((prev) => {
        const updated = { ...prev };
        delete updated[key];
        return updated;
      });
    } finally {
      setLoadingOrthologs((prev) => ({ ...prev, [key]: false }));
    }
  };

  const getTaxonOptions = (key: string): TaxonOption[] => {
    const data = orthologData[key];
    if (!data || !data.orthologsByTaxon) {
      return [];
    }
    return data.orthologsByTaxon.map((entry) => ({
      value: entry.taxon.id,
      text: entry.taxon.scientificName,
      taxonId: entry.taxon.id,
    }));
  };

  return (
    <div className="table-container mt-4">
      <table className="table is-fullwidth is-striped">
        <thead>
          <tr>
            <th>Species</th>
            <th>Gene</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {selectedGenes.map((gene, index) => {
            const key = `${gene.speciesId}:${gene.geneId}`;
            const isLoading = loadingOrthologs[key] || false;
            return (
              <tr key={`${gene.speciesId}-${gene.geneId}-${index}`}>
                <td>
                  <div>
                    <strong>
                      <Link
                        className="internal-link"
                        to={`/species/${gene.speciesId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {gene.speciesLabel}
                      </Link>
                    </strong>
                    <br />
                    <small className="has-text-grey">{gene.speciesId}</small>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>
                      <Link
                        className="internal-link"
                        to={`/gene/${gene.geneId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {gene.geneLabel}
                      </Link>
                    </strong>
                    <br />
                    <small className="has-text-grey">{gene.geneId}</small>
                  </div>
                </td>
                <td>
                  <div className="buttons">
                    <Button
                      type="button"
                      className="button is-small is-danger is-outlined"
                      onClick={() => removeGene(gene.speciesId, gene.geneId)}
                      aria-label="Remove gene"
                    >
                      <Trash2 size={16} />
                    </Button>
                    <div className="is-flex is-align-items-center" style={{ gap: '0.5rem' }}>
                      {fetchingOrthologs[key] ? (
                        <span className="is-size-7 has-text-grey">Loading taxa...</span>
                      ) : (
                        <>
                          <Select
                            title="Select taxon"
                            defaultValue=""
                            value={selectedTaxons[key] || ''}
                            options={[{ value: '', text: 'Select taxon...' }, ...getTaxonOptions(key)]}
                            onChange={(value) => {
                              setSelectedTaxons((prev) => ({
                                ...prev,
                                [key]: value,
                              }));
                            }}
                          />
                          <Button
                            type="button"
                            className="button is-small is-info is-outlined"
                            onClick={() => handleAddOrthologs(gene.geneId, gene.speciesId, selectedTaxons[key])}
                            disabled={isLoading || !selectedTaxons[key] || fetchingOrthologs[key]}
                          >
                            {isLoading ? 'Loading...' : 'Add Orthologs'}
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default SelectedGenesList;
