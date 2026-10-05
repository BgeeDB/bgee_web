import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../../../../components/Bulma/Button/Button';
import Select from '../../../../components/Select/Select';
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

export interface OrthologData {
  orthologsByTaxon: Array<{
    taxon: {
      id: string;
      scientificName: string;
    };
    genes: any[];
  }>;
}

export const getSelectedGeneKey = (speciesId: string, geneId: string) => `${speciesId}:${geneId}`;

interface SelectedGenesListProps {
  selectedGenes: GeneEntry[];
  removeGene: (speciesId: string, geneId: string) => void;
  addOrthologs: (geneId: string, speciesId: string, taxonId?: string) => Promise<void>;
  orthologData: Record<string, OrthologData>;
  fetchingOrthologs: Record<string, boolean>;
}

const SelectedGenesList = ({
  selectedGenes,
  removeGene,
  addOrthologs,
  orthologData,
  fetchingOrthologs,
}: SelectedGenesListProps) => {
  const [loadingOrthologs, setLoadingOrthologs] = useState<Record<string, boolean>>({});
  const [selectedTaxons, setSelectedTaxons] = useState<Record<string, string>>({});

  const formatSpeciesDisplayLabel = (label: string) => {
    if (!label) {
      return label;
    }
    if (label.includes(' - ')) {
      return label;
    }
    const bracketMatch = label.match(/^(.*)\s+\(([^)]+)\)$/);
    if (bracketMatch) {
      const scientificName = bracketMatch[1].trim();
      const commonName = bracketMatch[2].trim();
      return `${scientificName} - ${commonName}`;
    }
    return label;
  };

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
    <div className="table-container mt-4 selected-genes-table-container">
      <table className="table is-fullwidth is-striped selected-genes-table">
        <thead>
          <tr>
            <th className="selected-genes-col-species">Species</th>
            <th className="selected-genes-col-gene">Gene</th>
            <th className="selected-genes-col-actions">Orthologs</th>
          </tr>
        </thead>
        <tbody>
          {selectedGenes.map((gene, index) => {
            const key = `${gene.speciesId}:${gene.geneId}`;
            const isLoading = loadingOrthologs[key] || false;
            return (
              <tr key={`${gene.speciesId}-${gene.geneId}-${index}`}>
                <td className="selected-genes-cell-species">
                  <div className="selected-genes-primary-cell">
                    <strong>
                      <Link
                        className="internal-link"
                        to={`/species/${gene.speciesId}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {formatSpeciesDisplayLabel(gene.speciesLabel)}
                      </Link>
                    </strong>
                    <br />
                    <small className="has-text-grey">{gene.speciesId}</small>
                  </div>
                </td>
                <td className="selected-genes-cell-gene">
                  <div className="selected-genes-primary-cell">
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
                <td className="selected-genes-cell-actions">
                  <div className="selected-genes-actions">
                    <div className="selected-genes-ortholog-controls">
                      {fetchingOrthologs[key] ? (
                        <span className="is-size-7 has-text-grey">Loading taxa...</span>
                      ) : (
                        <>
                          <div className="selected-genes-taxon-select">
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
                          </div>
                          <Button
                            type="button"
                            className="button is-small is-info is-outlined selected-genes-add-btn"
                            onClick={() => handleAddOrthologs(gene.geneId, gene.speciesId, selectedTaxons[key])}
                            disabled={isLoading || !selectedTaxons[key] || fetchingOrthologs[key]}
                            loading={isLoading}
                            aria-label="Add orthologs"
                            title="Add orthologs"
                          >
                            {!isLoading && <Plus size={14} />}
                          </Button>
                        </>
                      )}
                    </div>
                    <Button
                      type="button"
                      className="button is-small is-danger is-outlined selected-genes-remove-btn"
                      onClick={() => removeGene(gene.speciesId, gene.geneId)}
                      aria-label="Remove gene"
                      title="Remove gene"
                    >
                      <Trash2 size={16} />
                    </Button>
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
