import { AlertTriangle, Check, Loader2, X } from 'lucide-react';

export type GeneResolutionStatus =
  | { state: 'pending' }
  | { state: 'found'; speciesLabel: string; geneLabel: string }
  | { state: 'ambiguous'; matchCount: number }
  | { state: 'not_found' }
  | { state: 'error' };

interface MultiSpeciesGeneListInputProps {
  value: string;
  onChange: (next: string) => void;
  statuses: Record<string, GeneResolutionStatus>;
  isResolving: boolean;
  hasResolved: boolean;
}

const PLACEHOLDER = [
  'Paste one gene ID per line, e.g.:',
  'ENSG00000139767',
  'ENSMUSG00000063919',
  'ENSDARG00000059263',
].join('\n');

const StatusIcon = ({ status }: { status: GeneResolutionStatus | undefined }) => {
  if (!status) return null;
  switch (status.state) {
    case 'pending':
      return <Loader2 size={14} className="multispec-gene-list-icon is-spinning" aria-label="Resolving" />;
    case 'found':
      return <Check size={14} className="multispec-gene-list-icon has-text-success" aria-label="Found" />;
    case 'ambiguous':
      return (
        <AlertTriangle
          size={14}
          className="multispec-gene-list-icon has-text-warning"
          aria-label={`Ambiguous (${status.matchCount} matches)`}
        />
      );
    case 'not_found':
      return <X size={14} className="multispec-gene-list-icon has-text-danger" aria-label="Not found" />;
    case 'error':
      return <X size={14} className="multispec-gene-list-icon has-text-danger" aria-label="Lookup failed" />;
    default:
      return null;
  }
};

const StatusLabel = ({ status }: { status: GeneResolutionStatus | undefined }) => {
  if (!status) return null;
  switch (status.state) {
    case 'pending':
      return <span className="has-text-grey">Resolving...</span>;
    case 'found':
      return (
        <span className="has-text-success">
          Found{' '}
          <span className="has-text-grey">
            — {status.geneLabel} ({status.speciesLabel})
          </span>
        </span>
      );
    case 'ambiguous':
      return (
        <span className="has-text-warning-dark">
          Ambiguous <span className="has-text-grey">— {status.matchCount} matches; please refine the ID</span>
        </span>
      );
    case 'not_found':
      return <span className="has-text-danger">Not found</span>;
    case 'error':
      return <span className="has-text-danger">Lookup failed</span>;
    default:
      return null;
  }
};

const parseLines = (text: string): string[] =>
  text
    .split(/[\r\n]+/)
    .map((line) => line.trim())
    .filter(Boolean);

const MultiSpeciesGeneListInput = ({
  value,
  onChange,
  statuses,
  isResolving,
  hasResolved,
}: MultiSpeciesGeneListInputProps) => {
  const rawLines = parseLines(value);
  // Show one row per unique gene ID; preserve first-seen order
  const uniqueLines = Array.from(new Set(rawLines));
  const duplicateCount = rawLines.length - uniqueLines.length;
  const showStatuses = hasResolved && uniqueLines.length > 0;

  let summary: React.ReactNode = null;
  if (showStatuses) {
    const counts = uniqueLines.reduce(
      (acc, id) => {
        const s = statuses[id]?.state;
        if (s === 'found') acc.found += 1;
        else if (s === 'ambiguous') acc.ambiguous += 1;
        else if (s === 'not_found' || s === 'error') acc.notFound += 1;
        else if (s === 'pending') acc.pending += 1;
        return acc;
      },
      { found: 0, ambiguous: 0, notFound: 0, pending: 0 }
    );
    summary = (
      <p className="is-size-7 multispec-gene-list-summary">
        <span className="has-text-success">{counts.found} found</span>
        {counts.ambiguous > 0 && (
          <>
            <span className="has-text-grey"> · </span>
            <span className="has-text-warning-dark">{counts.ambiguous} ambiguous</span>
          </>
        )}
        {counts.notFound > 0 && (
          <>
            <span className="has-text-grey"> · </span>
            <span className="has-text-danger">{counts.notFound} not found</span>
          </>
        )}
        {counts.pending > 0 && (
          <>
            <span className="has-text-grey"> · </span>
            <span className="has-text-grey">{counts.pending} pending</span>
          </>
        )}
        <span className="has-text-grey"> · {uniqueLines.length} unique</span>
        {duplicateCount > 0 && (
          <span className="has-text-grey">
            {' '}
            ({duplicateCount} duplicate{duplicateCount === 1 ? '' : 's'} ignored)
          </span>
        )}
      </p>
    );
  }

  return (
    <div className="multispec-gene-list">
      <label className="label is-small" htmlFor="multispec-gene-list-textarea">
        Gene IDs (one per line)
      </label>
      <textarea
        id="multispec-gene-list-textarea"
        className="textarea is-family-monospace is-small multispec-gene-list-textarea"
        rows={8}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
        value={value}
        placeholder={PLACEHOLDER}
        onChange={(e) => onChange(e.target.value)}
        disabled={isResolving}
      />
      <p className="help">
        Enter one gene ID per line. Genes can come from any supported species. Click <strong>Submit</strong> to resolve
        the list and run the search.
      </p>

      {summary}

      {showStatuses && (
        <div className="multispec-gene-list-statuses table-container">
          <table className="table is-fullwidth is-narrow is-size-7 multispec-gene-list-table">
            <thead>
              <tr>
                <th style={{ width: '1.75rem' }} aria-label="Status" />
                <th style={{ width: '30%' }}>Gene ID</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {uniqueLines.map((id) => {
                const status = statuses[id];
                return (
                  <tr key={id}>
                    <td className="multispec-gene-list-status-cell">
                      <StatusIcon status={status} />
                    </td>
                    <td className="is-family-monospace">{id}</td>
                    <td>
                      <StatusLabel status={status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MultiSpeciesGeneListInput;
