import { useEffect, useLayoutEffect, useMemo, useRef, useState, type RefObject } from 'react';
import ReactDOM from 'react-dom';
import { Link } from 'react-router';
import { Plus, Trash2 } from 'lucide-react';
import Button from '../../../../components/Bulma/Button/Button';
import isPlural from '../../../../helpers/isPlural';

interface GeneEntry {
  speciesId: string;
  speciesLabel: string;
  geneId: string;
  geneLabel: string;
}

export interface HomologGene {
  geneId: string;
  name?: string;
  species: {
    id: string | number;
    genus?: string;
    speciesName?: string;
    name?: string;
  };
}

export interface HomologTaxonGroup {
  taxon: {
    id: string | number;
    scientificName: string;
  };
  genes: HomologGene[];
}

export interface HomologData {
  orthologsByTaxon?: HomologTaxonGroup[];
  paralogsByTaxon?: HomologTaxonGroup[];
}

export interface HomologSelection {
  orthologTaxonId?: string;
  paralogTaxonId?: string;
}

export const getSelectedGeneKey = (speciesId: string, geneId: string) => `${speciesId}:${geneId}`;

interface SelectedGenesListProps {
  selectedGenes: GeneEntry[];
  trackedGenes: GeneEntry[];
  removeGene: (speciesId: string, geneId: string) => void;
  addHomologs: (geneId: string, speciesId: string, selection: HomologSelection) => Promise<void>;
  loadHomologs: (geneId: string, speciesId: string) => Promise<HomologData | null>;
  homologData: Record<string, HomologData>;
  fetchingHomologs: Record<string, boolean>;
}

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

// geneLabel is the canonical "geneId - name" string. The row shows the name, then the ID.
const geneDisplayName = (geneId: string, geneLabel: string) => {
  const prefix = `${geneId} - `;
  if (geneLabel.startsWith(prefix)) {
    return geneLabel.slice(prefix.length).trim();
  }
  if (!geneLabel || geneLabel === geneId) return '';
  return geneLabel.trim();
};

const newGeneKeys = (genes: HomologGene[] | undefined, trackedKeys: Set<string>, alsoSkip?: Set<string>) => {
  const keys = new Set<string>();
  (genes || []).forEach((gene) => {
    if (!gene?.geneId || gene.species?.id == null) return;
    const key = getSelectedGeneKey(String(gene.species.id), gene.geneId);
    if (trackedKeys.has(key) || alsoSkip?.has(key) || keys.has(key)) return;
    keys.add(key);
  });
  return keys;
};

const addButtonLabel = (orthologCount: number, paralogCount: number) => {
  const parts: string[] = [];
  if (orthologCount > 0) parts.push(`${orthologCount} ${isPlural('ortholog', orthologCount)}`);
  if (paralogCount > 0) parts.push(`${paralogCount} ${isPlural('paralog', paralogCount)}`);
  if (parts.length === 0) return 'Already in the list';
  return `Add ${parts.join(' and ')}`;
};

interface HomologAddPanelProps {
  anchorRef: RefObject<HTMLSpanElement | null>;
  gene: GeneEntry;
  orthologs: HomologTaxonGroup[];
  paralogs: HomologTaxonGroup[];
  trackedKeys: Set<string>;
  addHomologs: SelectedGenesListProps['addHomologs'];
  onClose: () => void;
}

const HomologAddPanel = ({
  anchorRef,
  gene,
  orthologs,
  paralogs,
  trackedKeys,
  addHomologs,
  onClose,
}: HomologAddPanelProps) => {
  const panelRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const [orthologTaxonId, setOrthologTaxonId] = useState('');
  const [paralogTaxonId, setParalogTaxonId] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useLayoutEffect(() => {
    const place = () => {
      const anchor = anchorRef.current;
      const panel = panelRef.current;
      if (!anchor || !panel) return;
      const rect = anchor.getBoundingClientRect();
      if (rect.width === 0 && rect.height === 0) return;
      if (rect.bottom < 0 || rect.top > window.innerHeight) {
        onCloseRef.current();
        return;
      }
      const margin = 8;
      const gap = 4;
      const width = panel.offsetWidth;
      const height = panel.offsetHeight;
      const cookie = document.querySelector('.cookie-message');
      const cookieRect = cookie?.getBoundingClientRect();
      const bottomLimit =
        cookieRect && cookieRect.height > 0 && cookieRect.bottom >= window.innerHeight - 4
          ? cookieRect.top - margin
          : window.innerHeight - margin;
      const left = Math.max(margin, Math.min(rect.right - width, window.innerWidth - width - margin));
      const spaceBelow = bottomLimit - (rect.bottom + gap);
      const spaceAbove = rect.top - gap - margin;
      let top = rect.bottom + gap;
      if (height > spaceBelow && spaceAbove >= height) {
        top = rect.top - height - gap;
      } else if (height > spaceBelow && spaceAbove > spaceBelow) {
        top = margin;
      } else if (height > spaceBelow) {
        top = Math.max(margin, bottomLimit - height);
      }
      setPosition((prev) => (prev && prev.top === top && prev.left === left ? prev : { top, left }));
    };

    const onScroll = (event: Event) => {
      const target = event.target;
      if (target instanceof Node && panelRef.current?.contains(target)) return;
      place();
    };

    place();
    window.addEventListener('resize', place);
    window.addEventListener('scroll', onScroll, true);
    return () => {
      window.removeEventListener('resize', place);
      window.removeEventListener('scroll', onScroll, true);
    };
  }, [anchorRef, orthologs, paralogs, orthologTaxonId, paralogTaxonId, error]);

  useEffect(() => {
    const onPointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onCloseRef.current();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onCloseRef.current();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [anchorRef]);

  const orthologGroup = orthologs.find((entry) => String(entry.taxon.id) === orthologTaxonId);
  const paralogGroup = paralogs.find((entry) => String(entry.taxon.id) === paralogTaxonId);
  const orthologKeys = orthologTaxonId ? newGeneKeys(orthologGroup?.genes, trackedKeys) : null;
  const paralogKeys = paralogTaxonId ? newGeneKeys(paralogGroup?.genes, trackedKeys, orthologKeys || undefined) : null;
  const orthologCount = orthologKeys ? orthologKeys.size : 0;
  const paralogCount = paralogKeys ? paralogKeys.size : 0;
  const hasSelection = Boolean(orthologTaxonId || paralogTaxonId);
  const canSubmit = hasSelection && orthologCount + paralogCount > 0 && !submitting;
  const label = hasSelection ? addButtonLabel(orthologCount, paralogCount) : 'Add';

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      await addHomologs(gene.geneId, gene.speciesId, {
        orthologTaxonId: orthologTaxonId || undefined,
        paralogTaxonId: paralogTaxonId || undefined,
      });
      onClose();
    } catch {
      setError('Could not add these genes.');
      setSubmitting(false);
    }
  };

  const panel = (
    <div
      ref={panelRef}
      className="homolog-add-panel"
      role="dialog"
      aria-label="Add orthologs or paralogs"
      aria-describedby="homolog-add-panel-note"
      style={position ? { top: position.top, left: position.left } : { top: 0, left: 0, visibility: 'hidden' }}
    >
      <p id="homolog-add-panel-note" className="homolog-add-panel-note">
        Counts are genes not yet in the list.
      </p>
      <div className="homolog-add-panel-columns">
        <TaxonColumn
          title="Orthologs"
          tone="ortholog"
          groups={orthologs}
          selectedId={orthologTaxonId}
          trackedKeys={trackedKeys}
          onSelect={setOrthologTaxonId}
        />
        <TaxonColumn
          title="Paralogs"
          tone="paralog"
          groups={paralogs}
          selectedId={paralogTaxonId}
          trackedKeys={trackedKeys}
          onSelect={setParalogTaxonId}
        />
      </div>
      {error && <p className="homolog-add-panel-error">{error}</p>}
      <Button
        type="button"
        className="homolog-add-panel-submit"
        color="info"
        size="small"
        onClick={submit}
        disabled={!canSubmit}
        loading={submitting}
      >
        {label}
      </Button>
    </div>
  );

  if (typeof document === 'undefined') return null;
  return ReactDOM.createPortal(panel, document.body);
};

interface TaxonColumnProps {
  title: string;
  tone: 'ortholog' | 'paralog';
  groups: HomologTaxonGroup[];
  selectedId: string;
  trackedKeys: Set<string>;
  onSelect: (taxonId: string) => void;
}

const TaxonColumn = ({ title, tone, groups, selectedId, trackedKeys, onSelect }: TaxonColumnProps) => {
  const headingId = `${tone}-${title.replace(/\s+/g, '-').toLowerCase()}`;
  const toneClass = tone === 'ortholog' ? 'homolog-ortholog' : 'homolog-paralog';
  const groupName = `${tone}-taxon`;

  return (
    <div className="homolog-add-panel-column" role="radiogroup" aria-labelledby={headingId}>
      <p id={headingId} className={`homolog-add-panel-heading ${toneClass}`}>
        {title}
      </p>
      {groups.length === 0 ? (
        <p className="homolog-add-panel-empty">{tone === 'ortholog' ? 'No orthologs' : 'No paralogs'}</p>
      ) : (
        <ul className="homolog-add-panel-options">
          <li>
            <label className="homolog-add-panel-option has-text-grey">
              <input type="radio" name={groupName} value="" checked={selectedId === ''} onChange={() => onSelect('')} />
              <span>None</span>
            </label>
          </li>
          {groups.map((entry) => {
            const taxonId = String(entry.taxon.id);
            const count = newGeneKeys(entry.genes, trackedKeys).size;
            const hasGenes = (entry.genes || []).some((gene) => gene?.geneId);
            return (
              <li key={taxonId}>
                <label className={`homolog-add-panel-option ${toneClass}`}>
                  <input
                    type="radio"
                    name={groupName}
                    value={taxonId}
                    checked={selectedId === taxonId}
                    onChange={() => onSelect(taxonId)}
                  />
                  <span>
                    {entry.taxon.scientificName}
                    {count > 0 ? (
                      ` (${count})`
                    ) : hasGenes ? (
                      <span className="homolog-add-panel-added"> all added</span>
                    ) : (
                      ' (0)'
                    )}
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

const SelectedGenesList = ({
  selectedGenes,
  trackedGenes,
  removeGene,
  addHomologs,
  loadHomologs,
  homologData,
  fetchingHomologs,
}: SelectedGenesListProps) => {
  const [openKey, setOpenKey] = useState<string | null>(null);
  const [loadFailedKey, setLoadFailedKey] = useState<string | null>(null);
  const anchorRef = useRef<HTMLSpanElement | null>(null);
  const loadRequestRef = useRef(0);
  const trackedKeys = useMemo(
    () => new Set(trackedGenes.map((gene) => getSelectedGeneKey(String(gene.speciesId), gene.geneId))),
    [trackedGenes]
  );

  useEffect(() => {
    if (!openKey) return;
    const stillVisible = selectedGenes.some(
      (gene) => getSelectedGeneKey(String(gene.speciesId), gene.geneId) === openKey
    );
    if (!stillVisible) setOpenKey(null);
  }, [openKey, selectedGenes]);

  if (selectedGenes.length === 0) {
    return null;
  }

  const openGene = selectedGenes.find((gene) => getSelectedGeneKey(String(gene.speciesId), gene.geneId) === openKey);

  return (
    <div className="table-container mt-4 selected-genes-table-container">
      <table className="table is-fullwidth is-striped selected-genes-table">
        <thead>
          <tr>
            <th className="selected-genes-col-species">Species</th>
            <th className="selected-genes-col-gene">Gene</th>
            <th className="selected-genes-col-actions">Add homologs</th>
          </tr>
        </thead>
        <tbody>
          {selectedGenes.map((gene, index) => {
            const key = getSelectedGeneKey(String(gene.speciesId), gene.geneId);
            const isOpen = openKey === key;
            const isFetching = Boolean(fetchingHomologs[key]);
            const data = homologData[key];
            const hasChoices = Boolean(data?.orthologsByTaxon?.length || data?.paralogsByTaxon?.length);
            const canOpen = !isFetching && (!data || hasChoices);
            const geneName = geneDisplayName(gene.geneId, gene.geneLabel);
            let addTitle = 'Add orthologs or paralogs';
            if (isFetching) addTitle = 'Loading homologs...';
            else if (loadFailedKey === key && !data) addTitle = 'Could not load homologs';
            else if (data && !hasChoices) addTitle = 'No orthologs or paralogs';

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
                    <span className="has-text-grey"> - {gene.speciesId}</span>
                  </div>
                </td>
                <td className="selected-genes-cell-gene">
                  <div className="selected-genes-primary-cell">
                    {geneName ? (
                      <>
                        <strong>
                          <Link
                            className="internal-link"
                            to={`/gene/${gene.geneId}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {geneName}
                          </Link>
                        </strong>
                        <span className="has-text-grey"> - {gene.geneId}</span>
                      </>
                    ) : (
                      <strong>
                        <Link
                          className="internal-link"
                          to={`/gene/${gene.geneId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {gene.geneId}
                        </Link>
                      </strong>
                    )}
                  </div>
                </td>
                <td className="selected-genes-cell-actions">
                  <div className="selected-genes-actions">
                    <span className="selected-genes-add-anchor" ref={isOpen ? anchorRef : undefined}>
                      <Button
                        type="button"
                        className={`button is-small selected-genes-add-btn${isOpen ? ' is-info' : ' is-info is-outlined'}`}
                        onClick={() => {
                          if (isOpen) {
                            setOpenKey(null);
                            return;
                          }
                          if (data) {
                            if (hasChoices) setOpenKey(key);
                            return;
                          }
                          const requestId = ++loadRequestRef.current;
                          setLoadFailedKey((current) => (current === key ? null : current));
                          loadHomologs(gene.geneId, String(gene.speciesId)).then((loaded) => {
                            if (loadRequestRef.current !== requestId) return;
                            if (!loaded) {
                              setLoadFailedKey(key);
                              return;
                            }
                            const choices = Boolean(loaded.orthologsByTaxon?.length || loaded.paralogsByTaxon?.length);
                            if (choices) setOpenKey(key);
                          });
                        }}
                        disabled={!canOpen}
                        loading={isFetching}
                        aria-label="Add orthologs or paralogs"
                        aria-expanded={isOpen}
                        aria-haspopup="dialog"
                        title={addTitle}
                      >
                        {!isFetching && <Plus size={14} />}
                      </Button>
                    </span>
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
      {openGene && (
        <HomologAddPanel
          key={openKey || undefined}
          anchorRef={anchorRef}
          gene={openGene}
          orthologs={homologData[openKey || '']?.orthologsByTaxon || []}
          paralogs={homologData[openKey || '']?.paralogsByTaxon || []}
          trackedKeys={trackedKeys}
          addHomologs={addHomologs}
          onClose={() => setOpenKey(null)}
        />
      )}
    </div>
  );
};

export default SelectedGenesList;
