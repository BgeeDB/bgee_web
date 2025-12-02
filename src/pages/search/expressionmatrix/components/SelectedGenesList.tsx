import { useState } from 'react';
import Button from '../../../../components/Bulma/Button/Button';

interface GeneEntry {
  speciesId: string;
  speciesLabel: string;
  geneId: string;
  geneLabel: string;
}

interface SelectedGenesListProps {
  selectedGenes: GeneEntry[];
  removeGene: (speciesId: string, geneId: string) => void;
  addOrthologs: (geneId: string, speciesId: string) => Promise<void>;
}

const SelectedGenesList = ({ selectedGenes, removeGene, addOrthologs }: SelectedGenesListProps) => {
  const [loadingOrthologs, setLoadingOrthologs] = useState<Record<string, boolean>>({});

  if (selectedGenes.length === 0) {
    return null;
  }

  const handleAddOrthologs = async (geneId: string, speciesId: string) => {
    const key = `${speciesId}:${geneId}`;
    setLoadingOrthologs((prev) => ({ ...prev, [key]: true }));
    try {
      await addOrthologs(geneId, speciesId);
    } finally {
      setLoadingOrthologs((prev) => ({ ...prev, [key]: false }));
    }
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
                    <strong>{gene.speciesLabel}</strong>
                    <br />
                    <small className="has-text-grey">{gene.speciesId}</small>
                  </div>
                </td>
                <td>
                  <div>
                    <strong>{gene.geneLabel}</strong>
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
                    >
                      Remove
                    </Button>
                    <Button
                      type="button"
                      className="button is-small is-info is-outlined"
                      onClick={() => handleAddOrthologs(gene.geneId, gene.speciesId)}
                      disabled={isLoading}
                    >
                      {isLoading ? 'Loading...' : 'Add Orthologs'}
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
